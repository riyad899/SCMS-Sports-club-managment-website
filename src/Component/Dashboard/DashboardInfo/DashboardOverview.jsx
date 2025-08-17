import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/AuthContext';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import Loading from '../../Loading/Loading';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  FaUsers,
  FaCalendarCheck,
  FaDollarSign,
  FaTrophy,
  FaChartLine,
  FaUserShield,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import CountUp from 'react-countup';

const DashboardOverview = () => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosPublic();

  // Fetch all data needed for dashboard
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    enabled: !!user
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/bookings');
      return res.data;
    },
    enabled: !!user
  });

  const { data: currentUserData, isLoading: currentUserLoading } = useQuery({
    queryKey: ['user', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const { data: courts = [], isLoading: courtsLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: async () => {
      const res = await axiosSecure.get('/courts');
      return res.data;
    },
    enabled: !!user
  });

  const currentUser = currentUserData;
  const isAdmin = currentUser?.role === 'admin';

  if (usersLoading || bookingsLoading || currentUserLoading || courtsLoading) {
    return <Loading />;
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalMembers = users.filter(user => user.isMember).length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
  const totalRevenue = bookings
    .filter(booking => booking.status === 'confirmed')
    .reduce((sum, booking) => sum + (booking.amount || 0), 0);

  // User-specific statistics
  const userBookings = bookings.filter(booking => booking.userEmail === user?.email);
  const userConfirmedBookings = userBookings.filter(booking => booking.status === 'confirmed');
  const userPendingBookings = userBookings.filter(booking => booking.status === 'pending');
  const userTotalSpent = userConfirmedBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

  // Chart data
  const userRoleData = [
    { name: 'Members', value: totalMembers, color: '#10B981' },
    { name: 'Regular Users', value: totalUsers - totalMembers, color: '#6366F1' }
  ];

  const bookingStatusData = [
    { name: 'Confirmed', value: confirmedBookings, color: '#10B981' },
    { name: 'Pending', value: pendingBookings, color: '#F59E0B' },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: '#EF4444' }
  ];

  // Monthly booking trend (sample data - you can modify based on actual booking dates)
  const monthlyBookings = [
    { month: 'Jan', bookings: 20, revenue: 2000 },
    { month: 'Feb', bookings: 25, revenue: 2500 },
    { month: 'Mar', bookings: 30, revenue: 3000 },
    { month: 'Apr', bookings: 35, revenue: 3500 },
    { month: 'May', bookings: 40, revenue: 4000 },
    { month: 'Jun', bookings: 45, revenue: 4500 }
  ];

  // Court utilization data
  const courtUtilization = courts.map(court => ({
    name: court.name,
    bookings: bookings.filter(booking => booking.courtId === court._id).length
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {currentUser?.name || 'User'}! 👋
            </h1>
            <p className="text-blue-100 mt-2">
              {isAdmin 
                ? "Here's an overview of your sports club management dashboard" 
                : "Here's your personal dashboard overview"
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Today's Date</p>
            <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    <CountUp end={totalUsers} duration={2} />
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-green-500 text-sm">
                  {totalMembers} are members
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    <CountUp end={totalBookings} duration={2} />
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCalendarCheck className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-green-500 text-sm">
                  {confirmedBookings} confirmed
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    $<CountUp end={totalRevenue} duration={2} />
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaDollarSign className="text-yellow-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-green-500 text-sm">
                  From confirmed bookings
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    <CountUp end={pendingBookings} duration={2} />
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaClock className="text-orange-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-orange-500 text-sm">
                  Awaiting approval
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">My Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    <CountUp end={userBookings.length} duration={2} />
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaCalendarCheck className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-green-500 text-sm">
                  {userConfirmedBookings.length} confirmed
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">
                    $<CountUp end={userTotalSpent} duration={2} />
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaDollarSign className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-green-500 text-sm">
                  On court bookings
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    <CountUp end={userPendingBookings.length} duration={2} />
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaClock className="text-orange-600 text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-orange-500 text-sm">
                  Awaiting approval
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Membership Status</p>
                  <p className="text-xl font-bold text-gray-900">
                    {currentUser?.isMember ? 'MEMBER' : 'REGULAR'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${currentUser?.isMember ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FaUserShield className={`text-xl ${currentUser?.isMember ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-sm ${currentUser?.isMember ? 'text-green-500' : 'text-gray-500'}`}>
                  {currentUser?.isMember ? 'Premium benefits active' : 'Upgrade for benefits'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            {isAdmin ? 'User Distribution' : 'Platform Overview'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTrophy className="text-green-500" />
            Booking Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trends and Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Booking Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Booking Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Court Utilization */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Court Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courtUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity or Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {isAdmin ? 'Recent System Activity' : 'Quick Actions'}
        </h3>
        {isAdmin ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FaUsers className="text-blue-500" />
              <span className="text-gray-700">
                {totalUsers} total users registered in the system
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FaCalendarCheck className="text-green-500" />
              <span className="text-gray-700">
                {pendingBookings} bookings awaiting your approval
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <FaDollarSign className="text-yellow-500" />
              <span className="text-gray-700">
                ${totalRevenue} total revenue generated this month
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <FaCalendarCheck className="text-blue-500 text-xl" />
              <span className="font-medium text-gray-700">Book a Court</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <FaDollarSign className="text-green-500 text-xl" />
              <span className="font-medium text-gray-700">Payment History</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <FaUserShield className="text-purple-500 text-xl" />
              <span className="font-medium text-gray-700">Upgrade Membership</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;