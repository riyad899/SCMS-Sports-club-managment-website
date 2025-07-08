import {
  createBrowserRouter,
} from "react-router";
import { Rootlayout } from "../layouts/Rootlayout";
import { Home } from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import Courts from "../pages/Courts/Courts";



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
        element: <Courts />,
      }
    ]
  },
]);