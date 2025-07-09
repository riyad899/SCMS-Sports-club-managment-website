import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router';

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
      <main className="flex-1 p-6 bg-white">
        {/* Show Outlet content for nested routes */}
        <Outlet />

        {/* Show default content only when NOT on a nested route */}
        {!isOnNestedRoute && (
          <div className="default-content">
            <h1 className="text-3xl font-bold mb-6 text-[#162E50]">Welcome to Your Dashboard!</h1>
            <p className="text-gray-600 mb-4">Select an option from the sidebar to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#162E50] mb-2">My Profile</h3>
                <p className="text-sm text-gray-600">View and edit your profile information</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#162E50] mb-2">Pending Bookings</h3>
                <p className="text-sm text-gray-600">Check your court booking status</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#162E50] mb-2">Announcements</h3>
                <p className="text-sm text-gray-600">Stay updated with club announcements</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
