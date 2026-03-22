import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DriverLayout from "./pages/driver/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import AdminLayout  from "./pages/admin/AdminLayout.jsx"
import App from "./App.jsx";
import Buses from "./components/admin/Buses.jsx";
import Drivers from "./components/admin/Drivers.jsx";
import Routes from "./components/admin/Routes.jsx";
import Schedule from "./components/admin/Schedule.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
const router = createBrowserRouter([
  {path:"/",
    element:<App></App>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Dashboard />
    },
    {
      path: "add-bus",
      element: <Buses />
    },
    {
      path: "add-driver",
      element: <Drivers />
    },
    {
      path: "add-route",
      element: <Routes />
    },
    {
      path: "schedule-bus",
      element: <Schedule />
    }
  ]
},
  {
    path: "/driver",
    element: <DriverLayout />,
    children: [
      {
        path: "dashboard",
        element: <DriverDashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);