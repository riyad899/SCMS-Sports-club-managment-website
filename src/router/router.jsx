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




export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
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
        element: (
          <PrivateRoute>
            <Courts />
          </PrivateRoute>
        ),
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
                element: <PendingBookings />,
              },
              {
                path: "announcements",
                element: <Announcements />,
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
                path: "pending-bookings",
                element: <PendingBookings />,
              },
              {
                path: "announcements",
                element: <Announcements />,
              },
            ],
          },
        ],
      }

    ]
  },
]);