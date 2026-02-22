import React from "react";
import StatsCard from "../../components/driver/StatsCard";
import { FiPercent, FiNavigation, FiClock } from "react-icons/fi";
import CalendarCard from "../../components/driver/CalendarCard";
import RatingCard from "../../components/driver/RatingCard";
import CurrentTripCard from "../../components/driver/CurrentTripCard";
import MapCard from "../../components/driver/MapCard";
import stylesBottom from "../../components/driver/DashboardBottom.module.css";

const MiniBarChart = ({ bars }) => {
  return (
    <>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: h,
            background: "#3b66f5",
            borderRadius: "4px",
          }}
        />
      ))}
    </>
  );
};

const CircularProgress = () => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background:
          "conic-gradient(#84cc16 70%, #e5e7eb 0%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#f4f4f6",
        }}
      />
    </div>
  );
};

const DriverDashboard = () => {
  return (
    <div style={{ display: "flex", gap: "25px" }}>
      
      <StatsCard
        icon={<FiPercent />}
        title="Total trips"
        value="84"
        subtitle="+2.1% this month"
        chart={<MiniBarChart bars={[15, 25, 18, 35, 20]} />}
      />

      <StatsCard
        icon={<FiNavigation />}
        title="Distance driven"
        value="1628"
        unit="km"
        chart={<MiniBarChart bars={[20, 28, 30, 22, 34]} />}
      />

      <StatsCard
        icon={<FiClock />}
        title="Driving hours"
        value="16 hr 12"
        unit="m"
        chart={<CircularProgress />}
      />

      

      
    </div>
    
  );
};

export default DriverDashboard;