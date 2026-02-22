import React from "react";
import styles from "./DriverSidebar.module.css";
import {
  FiGrid,
  FiPercent,
  FiCalendar,
  FiMail,
  FiBarChart2,
  FiTruck,
  FiFlag,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const DriverSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.globe}>🌐</span>
        Trakify
      </div>

      <div className={styles.menu}>
        <div className={`${styles.menuItem} ${styles.active}`}>
          <FiGrid />
          <span>Dashboard</span>
        </div>

        <div className={styles.menuItem}>
          <FiPercent />
          <span>Trips</span>
        </div>

        <div className={styles.menuItem}>
          <FiCalendar />
          <span>Schedule</span>
        </div>

        <div className={styles.menuItem}>
          <FiMail />
          <span>Messages</span>
          <span className={styles.badge}>2</span>
        </div>

        <div className={styles.menuItem}>
          <FiBarChart2 />
          <span>Analytics</span>
        </div>

        <div className={styles.menuItem}>
          <FiTruck />
          <span>Vehicles</span>
        </div>

        <div className={styles.menuItem}>
          <FiFlag />
          <span>Report</span>
        </div>

        <div className={styles.menuItem}>
          <FiHelpCircle />
          <span>Support</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.menuItem}>
          <FiSettings />
          <span>Settings</span>
        </div>

        <div className={styles.menuItem}>
          <FiLogOut />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};

export default DriverSidebar;