import StatCard from "../../components/admin/StatCard";
import styles from "./Dashboard.module.css";
import {
  FaBus,
  FaUserTie,
  FaUsers,
  FaRoute,
  FaExclamationTriangle,
} from "react-icons/fa";

function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Overview</h1>

      {/* STAT CARDS */}
      <div className={styles.cardGrid}>
        <StatCard title="Total Buses" value="124" icon={<FaBus />} color="red" />
        <StatCard title="Active Buses" value="87" icon={<FaBus />} color="green" />
        <StatCard title="Total Drivers" value="156" icon={<FaUserTie />} color="orange" />
        <StatCard title="Total Users" value="1243" icon={<FaUsers />} color="blue" />
        <StatCard title="Active Routes" value="42" icon={<FaRoute />} color="purple" />
        <StatCard title="Delayed Buses" value="8" icon={<FaExclamationTriangle />} color="danger" />
      </div>

      {/* QUICK VISUAL SECTION */}
      <div className={styles.visualSection}>
        

        <div className={styles.mapSection}>
          <h3>📍 Live Map Preview</h3>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapCircle}></div>
            <p>Map integration coming soon</p>
            <span>Real-time bus tracking will appear here</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
