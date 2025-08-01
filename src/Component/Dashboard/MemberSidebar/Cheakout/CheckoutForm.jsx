import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useEffect } from 'react'
import { UseaxiosPublic } from '../../../hooks/UseAxiosPublic';
import { useAuth } from '../../../hooks/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
export const CheckoutForm = ({ selectedBooking, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = UseaxiosPublic();
    const { user } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Fetch coupons on component mount
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get('https://sports-club-backend-mwe3s4o3v-riyad899s-projects.vercel.app/coupons/all');
                setCoupons(response.data);
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
            }
        };
        fetchCoupons();
    }, []);

    // Apply coupon function
    const applyCoupon = () => {
        const coupon = coupons.find(c => c.code === couponCode && c.isActive);

        if (!coupon) {
            Swal.fire({
                title: 'Invalid Coupon',
                text: 'Coupon code not found or expired.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Check if coupon is expired
        if (new Date(coupon.expiry) < new Date()) {
            Swal.fire({
                title: 'Coupon Expired',
                text: 'This coupon has expired.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const originalPrice = selectedBooking?.price || 0;
        let discount = 0;

        if (coupon.discountType === 'percentage') {
            discount = (originalPrice * coupon.value) / 100;
        } else if (coupon.discountType === 'fixed') {
            discount = coupon.value;
        }

        setAppliedCoupon(coupon);
        setDiscountAmount(discount);

        Swal.fire({
            title: 'Coupon Applied!',
            text: `${coupon.description}. You saved Tk${discount}`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };

    // Remove coupon function
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
    };

    // Calculate final price
    const originalPrice = selectedBooking?.price || 0;
    const finalPrice = originalPrice - discountAmount;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {

            return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            console.error("CardElement not found");
            return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
        if (error) {
            // Handle error
            console.error("Error creating payment method:", error);
            return;
        }
        else {
            // Handle successful payment method creation
            console.log("Payment method created:", paymentMethod);
            console.log("Booking ID:", selectedBooking?._id);
            console.log("Booking details:", selectedBooking);
            // You can send the paymentMethod.id to your server for further processing
        }

        const amount = finalPrice;
        const amountInCents = amount * 100; // Convert to cents for Stripe
        // createPaymentIntent
        try {
            const res = await axiosSecure.post('/create-payment-intent', {
                amount: amountInCents,
                currency: 'usd',
                paymentMethodId: paymentMethod.id,
                bookingId: selectedBooking?._id,
            });

            const paymentIntent = res.data;
            const clientSecret = paymentIntent.clientSecret;
            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            });
            console.log("Payment Intent:", paymentIntent);
            console.log("Client Secret:", clientSecret);

            // Check for errors in the payment intent
            if (payload.error) {
                console.error("Error confirming card payment:", payload.error);
                return;
            }

            if (paymentIntent.error) {
                console.error("Error creating payment intent:", paymentIntent.error);
                return;
            }

            // Show success alert for successful payment
            Swal.fire({
                title: 'Payment Successful!',
                text: 'Your booking payment has been processed successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Navigate back to PaymentPage after success alert
                if (onPaymentSuccess) {
                    onPaymentSuccess(selectedBooking._id);
                }
            });

            const sendPayment = async ({ email, cardId, payment_status, booking }) => {
                // Log the data being sent to verify it's correct
                console.log('📤 Sending payment data:');
                console.log('Email:', email);
                console.log('Card ID:', cardId);
                console.log('Payment Status:', payment_status);
                console.log('Booking:', booking);

                try {
                    const res = await axios.post('https://sports-club-backend-mwe3s4o3v-riyad899s-projects.vercel.app/payments', {
                        email,
                        cardId,
                        payment_status,
                        booking
                    });

                    if (res.status === 201) {
                        console.log('✅ Payment recorded successfully:', res.data);
                        return res.data;
                    } else {
                        console.warn('⚠️ Unexpected response:', res.data);
                    }
                } catch (error) {
                    console.error('❌ Failed to send payment:', error.response?.data || error.message);
                    throw error;
                }
            };

            // Call the sendPayment function with actual data
            try {
                await sendPayment({
                    email: user?.email || selectedBooking?.email || 'unknown@example.com',
                    cardId: paymentMethod.id,
                    payment_status: 'completed',
                    booking: selectedBooking
                });

                // Update booking payment status to "paid"
                await axiosSecure.patch(`/api/bookings/payment/${selectedBooking._id}`, {
                    paymentStatus: 'paid'
                });

            } catch (error) {
                console.error('Failed to record payment:', error);
            }

            // Continue with payment process
        } catch (error) {
            console.error("Failed to create payment intent:", error);
            // Handle the error appropriately
        }
    }
    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg">
            {/* Booking Details */}
            {selectedBooking && (
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-[#162E50] mb-3">Booking Details</h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="font-medium">Court:</span> {selectedBooking.courtName || selectedBooking.courtId || 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Date:</span> {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Time:</span> {Array.isArray(selectedBooking.slots) ? selectedBooking.slots.join(', ') : (selectedBooking.slots || 'N/A')}
                        </div>
                        <div>
                            <span className="font-medium">Booking ID:</span> {selectedBooking._id || 'N/A'}
                        </div>
                        <div className="text-lg font-bold text-green-600 mt-3">
                            <div>Original Price: Tk{selectedBooking.price || 0}</div>
                            {appliedCoupon && (
                                <>
                                    <div className="text-red-600">Discount ({appliedCoupon.code}): -Tk{discountAmount}</div>
                                    <div className="border-t pt-2">Total: Tk{finalPrice}</div>
                                </>
                            )}
                            {!appliedCoupon && <div>Total: Tk{selectedBooking.price || 0}</div>}
                        </div>
                    </div>
                </div>            )}

            {/* Coupon Section */}
            <div className="p-4 border-b border-gray-200">
                <h4 className="text-md font-medium text-[#162E50] mb-3">Apply Coupon</h4>
                {!appliedCoupon ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="input input-bordered flex-1"
                        />
                        <button
                            type="button"
                            onClick={applyCoupon}
                            className="btn btn-secondary"
                            disabled={!couponCode.trim()}
                        >
                            Apply
                        </button>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold text-green-800">Coupon Applied: {appliedCoupon.code}</div>
                                <div className="text-sm text-green-600">{appliedCoupon.description}</div>
                            </div>
                            <button
                                type="button"
                                onClick={removeCoupon}
                                className="btn btn-sm btn-outline btn-error"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="p-4">
                <h4 className="text-md font-medium text-[#162E50] mb-3">Payment Information</h4>
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#32325d',
                            letterSpacing: '0.025em',
                            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                            fontSmoothing: 'antialiased',
                            lineHeight: '24px',
                            padding: '12px 16px',
                        },
                        invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a',
                        },
                    },
                }} />

                <button type="submit" className="btn btn-primary mt-4 w-full" disabled={!stripe}>
                    Pay Tk{finalPrice}
                </button>
            </form>
        </div>
    )
}
