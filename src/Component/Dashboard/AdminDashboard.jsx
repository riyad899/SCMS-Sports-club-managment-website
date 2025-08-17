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
import DashboardOverview from './DashboardInfo/DashboardOverview';

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
            to="/dashboard/admin"
            end
            className={({ isActive }) =>
              isActive ? 'text-[#162E50] font-semibold' : 'text-gray-600'
            }
          >
            <LayoutDashboard className="inline-block mr-2" /> Dashboard Overview
          </NavLink>

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
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
        
        {/* Show Dashboard Overview when on main dashboard route */}
        {isMainDashboard && <DashboardOverview />}
      </main>
    </div>
  )
}
