import React from "react";
import styles from "./DashboardBottom.module.css";

const CurrentTripCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span>Current trip</span>
        ↗
      </div>

      <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
        <div>
          <strong>Departure</strong><br />
          Poznan, Bus Station — 12:45 AM
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Stop</strong><br />
          Berlin Airport BER, T1/2 — 4:05 AM
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Arrival</strong><br />
          Berlin Südkreuz — 4:30 AM
        </div>
      </div>

      <div
        style={{
          marginTop: "15px",
          background: "#e0e7ff",
          color: "#3b66f5",
          padding: "8px",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        ⏱ Duration: 3 hours 45 min
      </div>
    </div>
  );
};

export default CurrentTripCard;