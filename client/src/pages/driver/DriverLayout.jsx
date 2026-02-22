import React from "react";
import { Outlet } from "react-router-dom";
import DriverSidebar from "../../components/driver/DriverSidebar";

const DriverLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <DriverSidebar />

      <div
        style={{
          flex: 1,
          padding: "40px",
          maxWidth: "1300px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DriverLayout;