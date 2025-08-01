import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import { useAuth } from '../../hooks/AuthContext';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';

export const AprovedBooking = () => {
  const axiosSecure = UseaxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isCancelling, setIsCancelling] = useState(null);

  const { data: approvedBookings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['approvedBookings', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/approved/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Filter only unpaid bookings
  const unpaidBookings = approvedBookings?.filter(
    booking => booking.paymentStatus === 'unpaid'
  ) || [];

  const cancelMutation = useMutation({
    mutationFn: async (bookingId) => {
      const res = await axiosSecure.delete(`/bookings/${bookingId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['approvedBookings', user?.email]);
      setIsCancelling(null);
      Swal.fire('Cancelled!', 'Your approved booking has been cancelled.', 'success');
    },
    onError: (err) => {
      setIsCancelling(null);
      Swal.fire('Error', err.message || 'Failed to cancel booking.', 'error');
    },
  });

  const handleCancelBooking = async (booking) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      html: `
        <div class="text-left">
          <p><strong>Court:</strong> ${booking.courtName}</p>
          <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p><strong>Slots:</strong> ${booking.slots?.join(', ')}</p>
          <p><strong>Price:</strong> Tk${booking.price}</p>
        </div>
        <p class="text-red-500 mt-2"><strong>This action cannot be undone!</strong></p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    });

    if (confirm.isConfirmed) {
      setIsCancelling(booking._id);
      cancelMutation.mutate(booking._id);
    }
  };

  if (isLoading) return <Loading />;

  if (error) return (
    <div className="text-red-600 text-center mt-10">
      Error loading approved bookings. Try again later.
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-800">My Approved Bookings (Unpaid)</h2>

      {unpaidBookings.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No unpaid approved bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unpaidBookings.map(booking => (
            <div key={booking._id} className="border p-4 rounded shadow-sm bg-green-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{booking.courtName} Court</h3>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Slots:</strong> {booking.slots?.join(', ')}</p>
                  <p><strong>Price:</strong> Tk{booking.price}</p>
                  <p><strong>Status:</strong> <span className="text-green-600 font-medium">{booking.status}</span></p>
                  <p><strong>Payment Status:</strong> <span className="text-red-600 font-medium">{booking.paymentStatus}</span></p>
                  <p><strong>Approved At:</strong> {new Date(booking.approvedAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleCancelBooking(booking)}
                  disabled={isCancelling === booking._id}
                  className="btn btn-sm btn-error text-white"
                >
                  {isCancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
