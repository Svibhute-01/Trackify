import React from "react";
import styles from "./CalendarCard.module.css";
import { FiArrowUpRight } from "react-icons/fi";

const CalendarCard = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const activeDays = [2, 4, 9, 11]; // highlighted boxes

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Calendar</h3>
        <FiArrowUpRight className={styles.icon} />
      </div>

      <div className={styles.weekDays}>
        {days.map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.day} ${
              activeDays.includes(i) ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;