import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react'
import { UseaxiousSecure } from '../../../hooks/UseaxiousSecure';
import axios from 'axios';
import Swal from 'sweetalert2';
export const CheckoutForm = ({ selectedBooking }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = UseaxiousSecure();


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

        const amount = selectedBooking?.price || 0;
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
            });

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
                            Total: Tk{selectedBooking.price || 0}
                        </div>
                    </div>
                </div>
            )}

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
                    Pay Tk{selectedBooking?.price || 0}
                </button>
            </form>
        </div>
    )
}
