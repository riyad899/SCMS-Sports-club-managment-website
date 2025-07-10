import { useEffect, useState } from "react";
import { UseaxiousSecure } from "../../../hooks/UseaxiousSecure";
import { useAuth } from "../../../hooks/AuthContext";

export const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = UseaxiousSecure();
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid'
  const [viewFormat, setViewFormat] = useState('table'); // 'table' or 'card'

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const approvedRes = await axiosSecure.get(`/bookings/approved/${user?.email}`);
        setApprovedBookings(approvedRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchBookings();
    }
  }, [user?.email, axiosSecure]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // Filter bookings based on payment status
  const filteredBookings = approvedBookings.filter(booking => {
    if (filter === 'paid') return booking.paymentStatus === 'paid';
    if (filter === 'unpaid') return booking.paymentStatus === 'unpaid';
    return true; // 'all'
  });

  // Calculate statistics
  const totalBookings = approvedBookings.length;
  const paidBookings = approvedBookings.filter(b => b.paymentStatus === 'paid').length;
  const unpaidBookings = totalBookings - paidBookings;
  const totalPaidAmount = approvedBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="p-6 bg-white rounded shadow min-h-screen">
      <h2 className="text-2xl font-bold text-[#162E50] mb-6">Payment History</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-900">{totalBookings}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold">Paid Bookings</h3>
          <p className="text-2xl font-bold text-green-900">{paidBookings}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold">Unpaid Bookings</h3>
          <p className="text-2xl font-bold text-yellow-900">{unpaidBookings}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-purple-800 font-semibold">Total Paid</h3>
          <p className="text-2xl font-bold text-purple-900">Tk{totalPaidAmount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All ({totalBookings})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`btn btn-sm ${filter === 'paid' ? 'btn-success' : 'btn-outline'}`}
          >
            Paid ({paidBookings})
          </button>
          <button
            onClick={() => setFilter('unpaid')}
            className={`btn btn-sm ${filter === 'unpaid' ? 'btn-warning' : 'btn-outline'}`}
          >
            Unpaid ({unpaidBookings})
          </button>
        </div>

        {/* View Format Toggle */}
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setViewFormat('table')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewFormat === 'table'
                ? 'bg-[#162E50] text-white'
                : 'text-gray-600 hover:text-[#162E50]'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewFormat('card')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewFormat === 'card'
                ? 'bg-[#162E50] text-white'
                : 'text-gray-600 hover:text-[#162E50]'
            }`}
          >
            Card View
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">
            {filter === 'all' ? 'No Bookings Found' :
             filter === 'paid' ? 'No Paid Bookings' : 'No Unpaid Bookings'}
          </h3>
          <p>
            {filter === 'all' ? "You don't have any approved bookings yet." :
             filter === 'paid' ? "You don't have any paid bookings yet." :
             "All your bookings have been paid!"}
          </p>
        </div>
      ) : (
        <>
          {/* Table View */}
          {viewFormat === 'table' && (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Court</th>
                    <th>Date</th>
                    <th>Slots</th>
                    <th>Price</th>
                    <th>Booked At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => {
                    const isPaid = booking.paymentStatus === 'paid';
                    return (
                      <tr key={booking._id}>
                        <td className="font-mono text-xs">{booking._id}</td>
                        <td>{booking.courtName || booking.courtId || 'N/A'}</td>
                        <td>{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</td>
                        <td>{Array.isArray(booking.slots) ? booking.slots.join(", ") : (booking.slots || 'N/A')}</td>
                        <td>Tk{booking.price || 0}</td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {isPaid ? (
                            <span className="badge badge-success text-white">Paid</span>
                          ) : (
                            <span className="badge badge-warning text-white">Unpaid</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Card View */}
          {viewFormat === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map(booking => {
                const isPaid = booking.paymentStatus === 'paid';
                return (
                  <div key={booking._id} className="card bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                    <div className="card-body p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="card-title text-lg font-bold text-[#162E50]">
                          {booking.courtName || booking.courtId || 'Court'}
                        </h3>
                        {isPaid ? (
                          <span className="badge badge-success text-white">Paid</span>
                        ) : (
                          <span className="badge badge-warning text-white">Unpaid</span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Date:</span>
                          <span className="text-gray-800">
                            {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Time Slots:</span>
                          <span className="text-gray-800">
                            {Array.isArray(booking.slots) ? booking.slots.join(", ") : (booking.slots || 'N/A')}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Price:</span>
                          <span className="text-lg font-bold text-green-600">
                            Tk{booking.price || 0}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Booked At:</span>
                          <span className="text-gray-800">
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-500 font-mono break-all">
                            ID: {booking._id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};


