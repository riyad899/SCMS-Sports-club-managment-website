import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  TicketPercent,
  Megaphone,
  ClipboardList,
  CalendarDays
} from 'lucide-react';

export const AdminDashboard = () => {
  const location = useLocation();

  // Check if we're on the main admin dashboard (no child routes)
  const isMainDashboard = location.pathname === '/dashboard/admin' || location.pathname === '/dashboard/admin/';

  return (
 <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md min-h-screen p-6 space-y-6">
        <div className="text-2xl font-bold text-[#162E50]">Admin Panel</div>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }
          >
            <LayoutDashboard className="inline-block mr-2" /> Profile
          </NavLink>

          <NavLink to="manage-booking-requests" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <ClipboardList className="inline-block mr-2" /> Booking Approvals
          </NavLink>

          <NavLink to="manage-members" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <Users className="inline-block mr-2" /> Manage Members
          </NavLink>

          <NavLink to="all-users" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <Users className="inline-block mr-2" /> All Users
          </NavLink>

          <NavLink to="manage-courts" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <BookOpen className="inline-block mr-2" /> Manage Courts
          </NavLink>

          <NavLink to="confirmed-bookings" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <CalendarDays className="inline-block mr-2" /> Confirmed Bookings
          </NavLink>

          <NavLink to="manage-coupons" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <TicketPercent className="inline-block mr-2" /> Manage Coupons
          </NavLink>

          <NavLink to="announcements-admin" className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }>
            <Megaphone className="inline-block mr-2" /> Announcements
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {isMainDashboard && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#162E50] mb-2">Welcome to Admin Dashboard</h1>
              <p className="text-gray-600">Manage your sports club efficiently from here</p>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-[#162E50]">156</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Courts</p>
                    <p className="text-2xl font-bold text-[#162E50]">12</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-bold text-[#162E50]">8</p>
                  </div>
                  <ClipboardList className="h-10 w-10 text-orange-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-[#162E50]">$2,450</p>
                  </div>
                  <TicketPercent className="h-10 w-10 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#162E50] mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New member registration</p>
                      <p className="text-xs text-gray-500">John Doe joined the club</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Court booking approved</p>
                      <p className="text-xs text-gray-500">Tennis Court 3 - 2:00 PM</p>
                      <p className="text-xs text-gray-400">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">Monthly membership fee</p>
                      <p className="text-xs text-gray-400">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#162E50] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <NavLink
                    to="manage-booking-requests"
                    className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <ClipboardList className="inline-block mr-2 text-blue-600" />
                    <span className="text-blue-600 font-medium">Review Pending Bookings</span>
                  </NavLink>
                  <NavLink
                    to="manage-members"
                    className="block w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Users className="inline-block mr-2 text-green-600" />
                    <span className="text-green-600 font-medium">Manage Members</span>
                  </NavLink>
                  <NavLink
                    to="announcements"
                    className="block w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Megaphone className="inline-block mr-2 text-purple-600" />
                    <span className="text-purple-600 font-medium">Create Announcement</span>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-[#162E50] mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Booking System: Online</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Payment Gateway: Active</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Member Portal: Operational</span>
                </div>
              </div>
            </div>
          </>
        )}

        <Outlet />
      </main>
    </div>

  )
}
