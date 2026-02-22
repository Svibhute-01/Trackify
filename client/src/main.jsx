import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DriverLayout from "./pages/driver/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import App from "./App.jsx";

const router = createBrowserRouter([
  {path:"/",
    element:<App></App>
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