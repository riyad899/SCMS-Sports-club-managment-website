import React from 'react';
import { Link } from 'react-router';
import { FaUser, FaChartBar, FaUsers, FaUserShield } from 'react-icons/fa';

const DashboardShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Enhanced Dashboard System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive Profile Management & Analytics Dashboard
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Features Implemented:</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">✅ Enhanced Profile Page</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Editable user information (name, phone, address, bio)</li>
                  <li>• Beautiful gradient header with profile image</li>
                  <li>• Account information section</li>
                  <li>• Real-time form validation and updates</li>
                  <li>• Responsive design with modern UI</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">✅ Dashboard Overview with Charts</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Interactive charts and statistics</li>
                  <li>• Role-based data display (Admin/User/Member)</li>
                  <li>• Real-time counters with animations</li>
                  <li>• Court utilization analytics</li>
                  <li>• Monthly booking trends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Links */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* User Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <FaUser className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">User Dashboard</h3>
            <p className="text-gray-600 mb-4 text-center">
              Access your personal dashboard with booking management and profile settings.
            </p>
            <Link
              to="/dashboard/user"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              View User Dashboard
            </Link>
          </div>

          {/* Member Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Member Dashboard</h3>
            <p className="text-gray-600 mb-4 text-center">
              Premium member access with enhanced features and exclusive benefits.
            </p>
            <Link
              to="/dashboard/member"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              View Member Dashboard
            </Link>
          </div>

          {/* Admin Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
              <FaUserShield className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Admin Dashboard</h3>
            <p className="text-gray-600 mb-4 text-center">
              Comprehensive admin panel with analytics, user management, and system controls.
            </p>
            <Link
              to="/dashboard/admin"
              className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              View Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FaChartBar className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Analytics Charts</h4>
              <p className="text-sm text-gray-600">Interactive pie charts, bar charts, and line graphs</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FaUser className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Profile Management</h4>
              <p className="text-sm text-gray-600">Comprehensive user profile with editing capabilities</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FaUsers className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Role-Based Views</h4>
              <p className="text-sm text-gray-600">Different dashboard layouts for different user roles</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FaUserShield className="text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Real-time Stats</h4>
              <p className="text-sm text-gray-600">Live statistics and animated counters</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <h4 className="font-semibold mb-2">Charts & Graphs</h4>
              <p className="text-blue-100">Recharts, Chart.js</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">UI Components</h4>
              <p className="text-blue-100">React, Tailwind CSS</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Management</h4>
              <p className="text-blue-100">TanStack Query</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Icons & Animation</h4>
              <p className="text-blue-100">React Icons, CountUp.js</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShowcase;
