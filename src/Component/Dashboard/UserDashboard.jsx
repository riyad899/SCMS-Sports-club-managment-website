import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router';
import DashboardOverview from './DashboardInfo/DashboardOverview';

export const UserDashboard = () => {
  const location = useLocation();

  // Check if we're on a nested route
  const isOnNestedRoute = location.pathname !== '/dashboard/user';

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#162E50] text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard/user"
            end
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 bg-white text-[#162E50] rounded-md font-semibold'
                : 'block px-4 py-2 hover:bg-white hover:text-[#162E50] rounded-md'
            }
          >
            Dashboard Overview
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 bg-white text-[#162E50] rounded-md font-semibold'
                : 'block px-4 py-2 hover:bg-white hover:text-[#162E50] rounded-md'
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="pending-bookings"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 bg-white text-[#162E50] rounded-md font-semibold'
                : 'block px-4 py-2 hover:bg-white hover:text-[#162E50] rounded-md'
            }
          >
            Pending Bookings
          </NavLink>
          <NavLink
            to="announcements"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 bg-white text-[#162E50] rounded-md font-semibold'
                : 'block px-4 py-2 hover:bg-white hover:text-[#162E50] rounded-md'
            }
          >
            Announcements
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        {/* Show Outlet content for nested routes */}
        <Outlet />

        {/* Show Dashboard Overview when NOT on a nested route */}
        {!isOnNestedRoute && <DashboardOverview />}
      </main>
    </div>
  )
}
