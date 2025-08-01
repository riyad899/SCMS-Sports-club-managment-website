// 📁 src/Component/Dashboard/Dashboard.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { UseaxiosPublic } from "../hooks/UseAxiosPublic";
import Loading from "../Loading/Loading";
import { useAuth } from "../hooks/AuthContext";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = UseaxiosPublic();

  const {
    data: users = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
    enabled: !authLoading && !!user,
    retry: 3,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  // Find current user info from user list
  const currentUser = users.find((u) => u.email === user?.email);

  // Track reload attempts
  const [reloadAttempts, setReloadAttempts] = useState(0);
  const maxReloads = 3;
  const reloadTimeoutRef = useRef(null);

  // Auto-refetch user data if user is not found and we have a logged in user
  useEffect(() => {
    // If user is not found, try to refetch and reload the page up to maxReloads times
    if (!authLoading && !isLoading && user && !currentUser && users.length > 0 && reloadAttempts < maxReloads) {
      reloadTimeoutRef.current = setTimeout(() => {
        setReloadAttempts((prev) => prev + 1);
        refetch();
        // Reload the page to force a fresh state
        window.location.reload();
      }, 2000);
    }
    return () => {
      if (reloadTimeoutRef.current) clearTimeout(reloadTimeoutRef.current);
    };
  }, [user, currentUser, users, authLoading, isLoading, refetch, reloadAttempts]);

  useEffect(() => {
    if (!authLoading && !isLoading && currentUser && currentUser.role && location.pathname === '/dashboard') {
      // Convert role to string for proper comparison
      const userRole = String(currentUser.role).trim().toLowerCase();

      switch (userRole) {
        case "user":
          navigate("/dashboard/user", { replace: true });
          break;
        case "member":
          navigate("/dashboard/member", { replace: true });
          break;
        case "admin":
          navigate("/dashboard/admin", { replace: true });
          break;
        default:
          console.error("Unknown role");
          navigate("/dashboard/user", { replace: true }); // Default to user
          break;
      }
    }
  }, [currentUser, authLoading, isLoading, navigate, location.pathname]);

  if (
    authLoading ||
    isLoading ||
    (!currentUser && reloadAttempts < maxReloads) ||
    (currentUser && typeof currentUser.role === 'undefined')
  ) {
    // Stay in loading state and keep retrying if user is not found and attempts are left
    // Also stay in loading if user is found but role is not yet known
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">{!currentUser || typeof currentUser.role === 'undefined'
            ? `Loading your dashboard... (Attempt ${reloadAttempts + 1} of ${maxReloads})`
            : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Optional fallback if user is not found after all reload attempts
  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">User not found in database after several attempts.</p>
          <p className="text-gray-600 mb-6">Please try refreshing the page or go back to home.</p>
          <div className="space-x-4">
            <button
              onClick={() => { setReloadAttempts(0); refetch(); }}
              className="px-4 py-2 bg-[#162E50] text-white rounded hover:bg-[#1e3a5f]"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Return Outlet to render nested dashboard routes
  return (
    <div className="min-h-screen bg-gray-50">
      {location.pathname === '/dashboard' ? (
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <Loading />
            <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Dashboard;
