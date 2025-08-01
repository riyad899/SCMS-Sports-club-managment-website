// ✅ src/Component/Dashboard/MemberSidebar/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/AuthContext';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import Loading from '../../Loading/Loading';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Use environment variable for Stripe key, fallback to test key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RjOM9FYUKpnIImrYBrXoiWVZb6KFe0vOmC3pK0C64ev60tiK4Cj6JJv7tMeXo5zZ7eu3Ir5WpS8aygz1IPQKH5Q00IB01aRoQ';
const stripePromise = loadStripe(stripeKey);

const CheckoutForm = ({ booking, coupons, onPaymentSuccess }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseaxiosPublic();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  const [finalAmount, setFinalAmount] = useState(booking?.totalPrice || 0);
  const [couponApplied, setCouponApplied] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Reset finalAmount when booking changes
  useEffect(() => {
    if (booking?.totalPrice) {
      setFinalAmount(booking.totalPrice);
      setCouponApplied(null);
      setCouponCode('');
      setCouponError('');
    }
  }, [booking]);

  const applyCoupon = () => {
    setCouponError('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (!booking?.totalPrice || booking.totalPrice <= 0) {
      setCouponError('Invalid booking amount');
      return;
    }

    const match = coupons.find(c =>
      c.code?.toLowerCase() === couponCode.toLowerCase() &&
      c.isActive &&
      (!c.expiry || new Date(c.expiry) > new Date())
    );

      if (match) {
        const discount = (match.discountType === 'percentage')
          ? (booking.totalPrice * match.value / 100)
          : match.value;
        const newPrice = Math.max(0, booking.totalPrice - discount);
        setFinalAmount(newPrice);
        setCouponApplied(match);
        Swal.fire({
          icon: 'success',
          title: 'Coupon Applied!',
          text: `You saved Tk${discount.toFixed(2)}`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        setCouponError('Invalid or expired coupon code');
        Swal.fire({
          icon: 'error',
          title: 'Invalid Coupon',
          text: 'Please enter a valid and active coupon code.',
          timer: 3000,
          showConfirmButton: false
        });
      }
  };

  const removeCoupon = () => {
    setFinalAmount(booking?.totalPrice || 0);
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      Swal.fire('Error', 'Payment system not loaded. Please refresh and try again.', 'error');
      return;
    }

    if (!booking) {
      Swal.fire('Error', 'No booking selected. Please go back and select a booking.', 'error');
      return;
    }

    if (finalAmount <= 0) {
      Swal.fire('Error', 'Invalid payment amount.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Validate card before processing
      const { error: cardError } = await stripe.createToken(cardElement);
      if (cardError) {
        throw new Error(cardError.message);
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.displayName || user?.email || 'Guest User',
          email: user?.email || '',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const paymentData = {
        userEmail: user?.email || '',
        userName: user?.displayName || user?.email?.split('@')[0] || 'Guest User',
        bookingId: booking._id,
        courtId: booking.courtId,
        courtName: booking.courtName || booking.courtId || 'N/A',
        amount: Math.round(finalAmount * 100) / 100, // Ensure 2 decimal places
        originalAmount: Math.round((booking.totalPrice || 0) * 100) / 100,
        discount: Math.round(((booking.totalPrice || 0) - finalAmount) * 100) / 100,
        couponUsed: couponApplied?.code || null,
        paymentMethod: paymentMethod.card.brand,
        lastFourDigits: paymentMethod.card.last4,
        transactionId: paymentMethod.id,
        status: 'completed',
        description: `Court Booking Payment - ${booking.courtId}`,
        bookingDate: booking.date,
        timeSlots: booking.slots,
        paymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Sending payment data:', paymentData);

      const response = await axiosSecure.post('/payments', paymentData);
      console.log('Payment response:', response.data);

      // Update booking status to confirmed after successful payment
      await axiosSecure.patch(`/bookings/${booking._id}`, {
        status: 'confirmed',
        paymentStatus: 'paid',
        paidAmount: finalAmount,
        paymentDate: new Date().toISOString()
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['approvedBookings']);
      queryClient.invalidateQueries(['confirmedBookings']);
      queryClient.invalidateQueries(['payments']);
      queryClient.invalidateQueries(['pendingBookings']);

      await Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        html: `
          <div class="text-left">
            <p><strong>Amount Paid:</strong> Tk${finalAmount}</p>
            <p><strong>Transaction ID:</strong> ${paymentMethod.id}</p>
            <p><strong>Booking:</strong> ${booking.courtId}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          </div>
        `,
        confirmButtonColor: '#162E50',
      });

      // Reset form and go back to booking selection
      cardElement.clear();
      setCouponCode('');
      setCouponApplied(null);
      setFinalAmount(booking.totalPrice || 0);

      // Navigate back to booking selection after successful payment
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }, 1000);

    } catch (err) {
      console.error('Payment error:', err);

      let errorMessage = 'Payment failed. Please try again.';

      if (err.response) {
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire('Payment Failed', errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-lg sm:text-xl font-bold text-[#162E50] mb-6 text-center">Complete Your Payment</h3>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Booking Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-gray-600">Email:</span>
            <div className="text-gray-900 break-words">{user?.email}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Court:</span>
            <div className="text-gray-900">{booking?.courtId || 'N/A'}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Date:</span>
            <div className="text-gray-900">
              {booking?.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Time Slots:</span>
            <div className="text-gray-900">
              {Array.isArray(booking?.slots) ? booking.slots.join(', ') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Price Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Price Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Original Price:</span>
              <span>Tk{booking?.totalPrice || 0}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({couponApplied.code}):</span>
                <span>-Tk{((booking?.totalPrice || 0) - finalAmount).toFixed(2)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-green-600">Tk{finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="border border-gray-200 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Apply Coupon (Optional)</h4>
          {!couponApplied ? (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className={`input input-bordered flex-1 ${couponError ? 'input-error border-red-500' : ''}`}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError('');
                  }}
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="btn btn-outline btn-primary whitespace-nowrap"
                  disabled={isProcessing || !couponCode.trim()}
                >
                  {isProcessing ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Applying...
                    </>
                  ) : (
                    'Apply Coupon'
                  )}
                </button>
              </div>
              {couponError && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <span>⚠️</span>
                  {couponError}
                </div>
              )}
              {coupons.length > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  Available coupons: {coupons.filter(c => c.isActive && (!c.expiry || new Date(c.expiry) > new Date())).length}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded">
              <div className="text-green-700">
                <span className="font-medium">Coupon Applied: {couponApplied.code}</span>
                <div className="text-sm">
                  {couponApplied.discountType === 'percentage'
                    ? `${couponApplied.value}% off`
                    : `Tk${couponApplied.value} off`}
                </div>
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                className="btn btn-sm btn-outline btn-error"
                disabled={isProcessing}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Card Payment Section */}
        <div className="border border-gray-200 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
          <div className="bg-white p-3 border border-gray-300 rounded">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn w-full text-white font-semibold py-3 text-base ${
            finalAmount <= 0 ? 'btn-disabled' : 'btn-success hover:btn-success'
          }`}
          disabled={!stripe || isProcessing || finalAmount <= 0}
        >
          {isProcessing ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing Payment...
            </>
          ) : finalAmount <= 0 ? (
            'Invalid Amount'
          ) : (
            `Pay Tk${finalAmount.toFixed(2)} Now`
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center text-xs sm:text-sm text-gray-500 space-y-1">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>💳 We accept all major credit and debit cards</p>
        </div>
      </form>
    </div>
  );
};

const PaymentPage = () => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosPublic();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookingsData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['approvedBookings', user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error('User email not found');
      }
      try {
        // Fix the API endpoint to match your booking structure
        const res = await axiosSecure.get(`/bookings/approved/email/${user.email}`);
        return res.data;
      } catch (error) {
        console.error('Error fetching approved bookings:', error);
        // Try alternative endpoint if the first one fails
        if (error.response?.status === 404) {
          try {
            const altRes = await axiosSecure.get(`/bookings/approved/${user.email}`);
            return altRes.data;
          } catch (altError) {
            console.error('Alternative endpoint also failed:', altError);
            throw new Error(altError.response?.data?.message || 'Failed to fetch approved bookings');
          }
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch approved bookings');
      }
    },
    enabled: !!user?.email,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // Ensure bookings is always an array
  const bookings = Array.isArray(bookingsData) ? bookingsData :
                  (bookingsData?.data && Array.isArray(bookingsData.data)) ? bookingsData.data :
                  [];

  const { data: couponsData = [], isLoading: couponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/coupons');
        return res.data;
      } catch (error) {
        console.error('Error fetching coupons:', error);
        return [];
      }
    },
    retry: 1,
  });

  // Ensure coupons is always an array
  const coupons = Array.isArray(couponsData) ? couponsData :
                 (couponsData?.data && Array.isArray(couponsData.data)) ? couponsData.data :
                 [];

  // Loading state
  if (isLoading || couponsLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow min-h-screen">
        <h2 className="text-2xl font-bold text-[#162E50] mb-4">Payment Page</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Bookings</h3>
          <p className="text-red-600 mb-4">
            {error.message || 'Unable to fetch your approved bookings.'}
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-error"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No bookings state
  if (bookings.length === 0) {
    return (
      <div className="p-6 bg-white rounded shadow min-h-screen">
        <h2 className="text-2xl font-bold text-[#162E50] mb-6">Payment Page</h2>
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2">No Approved Bookings</h3>
          <p className="mb-4">You don't have any approved bookings available for payment.</p>
          <p className="text-sm text-gray-400">
            Once your bookings are approved by the admin, you can make payments here.
          </p>
        </div>
      </div>
    );
  }

  // If no booking is selected, show selection screen
  if (!selectedBooking) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded shadow min-h-screen">
        <h2 className="text-xl sm:text-2xl font-bold text-[#162E50] mb-6">Select Booking for Payment</h2>
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#162E50] mb-2">
                    {booking.courtName || booking.courtId || 'Court Booking'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Date:</span> {' '}
                      {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {' '}
                      {Array.isArray(booking.slots) ? booking.slots.join(', ') : (booking.slots || 'N/A')}
                    </div>
                    <div>
                      <span className="font-medium">Court ID:</span> {' '}
                      {booking.courtId || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {' '}
                      <span className="text-green-600 font-semibold">
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Approved'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-lg font-bold text-green-600 mb-2">
                    Tk{booking.totalPrice || 0}
                  </div>
                  <button className="btn btn-primary btn-sm">
                    Pay Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <button
            onClick={() => setSelectedBooking(null)}
            className="btn btn-outline btn-secondary"
          >
            ← Back to Bookings
          </button>
        </div>
        <CheckoutForm
          booking={selectedBooking}
          coupons={coupons}
          onPaymentSuccess={() => setSelectedBooking(null)}
        />
      </div>
    </Elements>
  );
};

export default PaymentPage;
