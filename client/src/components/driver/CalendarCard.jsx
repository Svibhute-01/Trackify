import React from "react";
import styles from "./DashboardBottom.module.css";

const CalendarCard = () => {
  const days = Array(21).fill(0);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span>Calendar</span>
        ↗
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}
      >
        {days.map((_, i) => (
          <div
            key={i}
            style={{
              height: "18px",
              borderRadius: "4px",
              background:
                i % 5 === 0
                  ? "#3b66f5"
                  : i % 4 === 0
                  ? "#84cc16"
                  : "#dbeafe",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;