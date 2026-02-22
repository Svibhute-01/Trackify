import React from "react";
import styles from "./DashboardBottom.module.css";

const RatingCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span>Rating</span>
        ↗
      </div>

      <div className={styles.smallText}>Based on 98 reviews</div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "600",
          marginTop: "10px",
        }}
      >
        4.8 <span style={{ color: "#facc15" }}>★</span>
      </div>
    </div>
  );
};

export default RatingCard;