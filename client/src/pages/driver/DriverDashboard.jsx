import React from "react";
import styles from "./DriverDashboard.module.css";

import StatsCard from "../../components/driver/StatsCard";
import CalendarCard from "../../components/driver/CalendarCard";
import RatingCard from "../../components/driver/RatingCard";
import CurrentTripCard from "../../components/driver/CurrentTripCard";
import MapCard from "../../components/driver/MapCard";

import { FiPercent, FiNavigation, FiClock } from "react-icons/fi";

/* ================= Mini Bar Chart ================= */
const MiniBarChart = ({ bars }) => {
  return (
    <div className={styles.miniBarChart}>
      {bars.map((h, i) => (
        <div
          key={i}
          className={styles.bar}
          style={{ height: h }}
        />
      ))}
    </div>
  );
};

/* ================= Circular Progress ================= */
const CircularProgress = () => {
  return (
    <div className={styles.circularWrapper}>
      <div className={styles.circularInner} />
    </div>
  );
};

/* ================= Main Dashboard ================= */

const DriverDashboard = () => {
  return (
    <div className={styles.dashboard}>

      {/* ======= TOP STATS SECTION ======= */}
      <div className={styles.statsRow}>
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

      {/* ======= MAIN GRID SECTION ======= */}
      <div className={styles.mainGrid}>
        
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <CalendarCard />
          <RatingCard />
        </div>

        {/* Middle Column */}
        <CurrentTripCard />

        {/* Right Column */}
        <MapCard />

      </div>
    </div>
  );
};

export default DriverDashboard;