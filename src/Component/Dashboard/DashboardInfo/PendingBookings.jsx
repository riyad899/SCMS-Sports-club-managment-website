import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import { useAuth } from '../../hooks/AuthContext';
import Loading from '../../Loading/Loading';
import Swal from 'sweetalert2';


export const PendingBookings = () => {

const { user } = useAuth();
  const axiosSecure = UseaxiosPublic();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['pendingBookings', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/${user.email}`);
      // Filter only pending bookings
      return res.data.filter((booking) => booking.status === 'pending');
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (id) => {
      // Call your backend delete booking API
      const res = await axiosSecure.delete(`/bookings/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingBookings', user?.email]);
      Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to cancel booking.', 'error');
    },
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelBookingMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;

  if (!bookings.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No pending bookings found.
      </div>
    );

  return (
   <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Bookings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="p-4 rounded-lg border shadow-md space-y-3 bg-gray-50"
          >
            <p>
              <span className="font-semibold">Court Type:</span>{' '}
              {booking.courtType}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{' '}
              {booking.date}
            </p>
            <p>
              <span className="font-semibold">Slots:</span>{' '}
              {booking.slots?.join(', ')}
            </p>
            <p>
              <span className="font-semibold">Price:</span> Tk{booking.price}
            </p>
            <p className="text-yellow-600 font-semibold">
              Status: {booking.status}
            </p>

            <button
              onClick={() => handleCancel(booking._id)}
              className="btn btn-sm bg-red-700 text-white hover:bg-red-600"
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    </div>

  )
}
