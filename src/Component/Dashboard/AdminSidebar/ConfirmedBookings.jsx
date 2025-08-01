import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import { useAuth } from '../../hooks/AuthContext';

export const ConfirmedBookings = () => {
  const axiosSecure = UseaxiosPublic();
  const { user } = useAuth();

  // Fetch payments data for the current user (Member view)
  const { data: payments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/payments/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  console.log('payments:', payments);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading payments: {error.message}</span>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Confirmed Bookings</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>

      <div className="stats stats-horizontal shadow mb-6">
        <div className="stat">
          <div className="stat-title">My Total Payments</div>
          <div className="stat-value text-primary">{payments.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">My Total Spent</div>
          <div className="stat-value text-success">
            Tk{payments.reduce((sum, payment) => sum + (payment.price || 0), 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Court</th>
              <th>Booking Date</th>
              <th>Slots</th>
              <th>Price</th>
              <th>Payment Status</th>
              <th>Paid At</th>
              <th>Card ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <div className="text-gray-500">
                    No confirmed bookings found
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={payment._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="badge badge-outline">
                      {payment.courtName || 'N/A'}
                    </span>
                  </td>
                  <td>
                    {payment.date ?
                      new Date(payment.date).toLocaleDateString() :
                      'N/A'
                    }
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {payment.slots && payment.slots.length > 0 ?
                        payment.slots.map((slot, idx) => (
                          <span key={idx} className="badge badge-primary badge-sm">
                            {slot}
                          </span>
                        )) :
                        <span className="text-gray-400">No slots</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success font-semibold">
                      Tk{payment.price || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      payment.payment_status === 'completed'
                        ? 'badge-success'
                        : payment.payment_status === 'pending'
                        ? 'badge-warning'
                        : payment.payment_status === 'failed'
                        ? 'badge-error'
                        : 'badge-info'
                    }`}>
                      {payment.payment_status || 'unknown'}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm">
                      {payment.paidAt ?
                        new Date(payment.paidAt).toLocaleString() :
                        'N/A'
                      }
                    </div>
                  </td>
                  <td>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[100px] block truncate">
                      {payment.cardId || 'N/A'}
                    </code>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {payments.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {payments.length} confirmed booking{payments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
