import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/AuthContext';
import { UseaxiousSecure } from '../../hooks/UseaxiousSecure';
import Loading from '../../Loading/Loading';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './Cheakout/CheckoutForm';

// Use environment variable for Stripe key, fallback to test key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ;
const stripePromise = loadStripe(stripeKey);


export const PaymentPage = () => {

    const { user } = useAuth();
    const axiosSecure = UseaxiousSecure();
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { data: bookingsData = [], isLoading, error, refetch } = useQuery({
        queryKey: ['approvedBookings', user?.email],
        queryFn: async () => {
            if (!user?.email) {
                throw new Error('User email not found');
            }
            try {
                // API endpoint returns array directly
                const res = await axiosSecure.get(`/bookings/approved/email/${user.email}`);


                // Return the data directly since API returns array format
                return Array.isArray(res.data) ? res.data : [];
            } catch (error) {

                // Try alternative endpoint if the first one fails
                if (error.response?.status === 404) {
                    try {
                        const altRes = await axiosSecure.get(`/bookings/approved/${user.email}`);

                        return Array.isArray(altRes.data) ? altRes.data : [];
                    } catch (altError) {

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

    const bookings = Array.isArray(bookingsData) ? bookingsData : [];

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
                    {bookings.map((booking) => {

                        return (
                            <div
                                key={booking._id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[#162E50] mb-2">
                                            {booking.courtName || booking.courtId || 'Court Booking'}
                                            {booking.courtName && booking.courtId && (
                                                <span className="text-sm text-gray-500 ml-2">({booking.courtId})</span>
                                            )}
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
                                            {booking.approvedAt && (
                                                <div className="col-span-1 sm:col-span-2">
                                                    <span className="font-medium">Approved:</span> {' '}
                                                    <span className="text-green-600">
                                                        {new Date(booking.approvedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <div className="text-lg font-bold text-green-600 mb-2">
                                            Tk{booking.price || 0}
                                        </div>
                                        <button className="btn btn-primary btn-sm">
                                            Pay Now →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                <CheckoutForm selectedBooking={selectedBooking} />
            </div>
        </Elements>
    );
};



