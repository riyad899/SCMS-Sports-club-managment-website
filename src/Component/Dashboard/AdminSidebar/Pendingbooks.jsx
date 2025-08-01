import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Loading from '../../Loading/Loading';
import Swal from 'sweetalert2';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';

export const Pendingbooks = () => {

     const axiosSecure = UseaxiosPublic();
  const queryClient = useQueryClient();

  // Fetch pending bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/bookings/status');
      return res.data;
    },
  });

  // Mutation for updating booking status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/bookings/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingBookings']);
    },
  });

  const handleAction = async (id, action) => {
    Swal.fire({
      title: `Are you sure to ${action} this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus.mutate({ id, status: action });
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
  <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Booking Requests</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No pending bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th>#</th>
                <th>Email</th>
                <th>Court Type</th>
                <th>Slots</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.courtType}</td>
                  <td>{booking.slots.join(', ')}</td>
                  <td>{booking.date}</td>
                  <td>Tk{booking.price}</td>
                  <td>
                    <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded">
                      {booking.status}
                    </span>
                  </td>
                  <td className="space-x-4 space-y-3">
                    <button
                      onClick={() => handleAction(booking._id, 'approved')}
                      className="btn btn-success w-[100px] h-[28px] "
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(booking._id, 'rejected')}
                      className="btn btn-error w-[100px] h-[28px]"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  )
}
