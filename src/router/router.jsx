import {
  createBrowserRouter,
} from "react-router";
import { Rootlayout } from "../layouts/Rootlayout";
import { Home } from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import Courts from "../pages/Courts/Courts";
import Dashboard from "../Component/Dashboard/Dashboard";
import { UserDashboard } from "../Component/Dashboard/UserDashboard";
import { MemberDashboard } from "../Component/Dashboard/MemberDashboard";
import { AdminDashboard } from "../Component/Dashboard/AdminDashboard";
import PrivateRoute from "./PrivateRoute";
import { Profile } from "../Component/Dashboard/DashboardInfo/Profile";
import { PendingBookings } from "../Component/Dashboard/DashboardInfo/PendingBookings";
import { Announcements } from "../Component/Dashboard/DashboardInfo/Announcements";
import { Pendingbooks } from "../Component/Dashboard/AdminSidebar/Pendingbooks";
import { ManageMembers } from "../Component/Dashboard/AdminSidebar/ManageMembers";
import { AllUsers } from "../Component/Dashboard/AdminSidebar/AllUsers";
import { ManageCourt } from "../Component/Dashboard/AdminSidebar/ManageCourt";
import ManageCoupons from "../Component/Dashboard/AdminSidebar/ManageCupon,";
import { ManageAnnouncement } from "../Component/Dashboard/AdminSidebar/ManageAnnouncement";
import { PendingBookMem } from "../Component/Dashboard/MemberSidebar/PendingBookMem";
import { PaymentPage } from "../Component/Dashboard/MemberSidebar/PaymentPage";
import { PaymentHistory } from "../Component/Dashboard/MemberSidebar/PaymentHistory/PaymentHistory";
import { ConfirmedBookings } from "../Component/Dashboard/AdminSidebar/ConfirmedBookings";
import { AprovedBooking } from "../Component/Dashboard/MemberSidebar/AprovedBooking";
import Error from "../pages/Error/Error";




export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
    errorElement: <Error />,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/courts",
        element: <Courts />
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          {
            path: "user",
            element: <UserDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "pending-bookings",
                element: <PendingBookings />,
              },
              {
                path: "announcements",
                element: <Announcements />,
              },
            ],
          },
          {
            path: "member",
            element: <MemberDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "pending-bookings",
                element: <PendingBookMem />,
              },
              {
                path: "announcements",
                element: <Announcements />,
              },
              {
                path: "payment-page",
                element: <PaymentPage />,
              },
              {
                path: "payment-history",
                element: <PaymentHistory />,
              },
                {
                path: "approved-bookings",
                element: <AprovedBooking />,
              },
              {
                path: "confirmed-bookings",
                element: <ConfirmedBookings />,
              },
            ],
          },
          {
            path: "admin",
            element: <AdminDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "confirmed-bookings",
                element: <ConfirmedBookings />,
              },
              {
                path: "pending-bookings",
                element: <PendingBookings />,
              },
              {
                path: "announcements-admin",
                element: <ManageAnnouncement />,
              },
              {
                path: "manage-booking-requests",
                element: <Pendingbooks />,
              },
              {
                path: "manage-members",
                element: <ManageMembers />,
              },
              {
                path: "all-users",
                element: <AllUsers />,
              },
              {
                path: "manage-courts",
                element: <ManageCourt />,
              },
              {
                path: "manage-coupons",
                element: <ManageCoupons />,
              },
            ],
          },
        ],
      },
      // Catch-all route for unmatched paths
      {
        path: "*",
        element: <Error />
      }
    ]
  },
]);