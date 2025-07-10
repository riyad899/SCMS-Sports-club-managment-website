import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router';

export const MemberDashboard = () => {
  const location = useLocation();

  // Check if we're on a nested route
  const isOnNestedRoute = location.pathname !== '/dashboard/member';

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#ffffff] text-[#162E50] p-6 space-y-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6">Member Dashboard</h2>
        <nav className="space-y-3">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
            }
          >
            My Profile
          </NavLink>

          <NavLink
            to="pending-bookings"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
            }
          >
            Pending Bookings
          </NavLink>

          <NavLink
            to="approved-bookings"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
            }
          >
           Approved Bookings
          </NavLink>

          <NavLink
            to="confirmed-bookings"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
            }
          >
            Confirmed Bookings
          </NavLink>

          <NavLink
            to="payment-page"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
            }
          >
            Payment Page
          </NavLink>

          <NavLink
            to="payment-history"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
            }
          >
            Payment History
          </NavLink>

          <NavLink
            to="announcements"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-3 bg-[#162E50] border border-white/30 backdrop-blur-sm text-white rounded-md font-semibold shadow-lg transition-all duration-300'
                : 'block px-4 py-3 border border-white/50 backdrop-blur-sm hover:bg-[#162E50] hover:text-white hover:border-white/70 rounded-md transition-all duration-300 hover:shadow-md'
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
            <h1 className="text-3xl font-bold mb-6 text-[#162E50]">Welcome to Your Member Dashboard!</h1>
            <p className="text-gray-600 mb-4">Select an option from the sidebar to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#162E50] mb-2">Member Benefits</h3>
                <p className="text-sm text-gray-600">Access exclusive member features</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
