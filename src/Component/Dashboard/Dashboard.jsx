// 📁 src/Component/Dashboard/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { UseaxiousSecure } from "../hooks/UseaxiousSecure";
import Loading from "../Loading/Loading";
import { useAuth } from "../hooks/AuthContext";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = UseaxiousSecure();

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

  // Auto-refetch user data if user is not found and we have a logged in user
  useEffect(() => {
    if (!authLoading && !isLoading && user && !currentUser && users.length > 0) {
      // If user is logged in but not found in database, refetch after a short delay
      const timer = setTimeout(() => {
        refetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, currentUser, users, authLoading, isLoading, refetch]);

  useEffect(() => {
    if (!authLoading && !isLoading && currentUser && location.pathname === '/dashboard') {
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

  if (authLoading || isLoading) {
    return <Loading />;
  }

  // Optional fallback if user is not found
  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">User not found in database.</p>
          <p className="text-gray-600 mb-6">Please wait while we refresh your data or go back to home.</p>
          <div className="space-x-4">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#162E50] text-white rounded hover:bg-[#1e3a5f]"
            >
              Refresh
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
