import React from "react";
import styles from "./DashboardBottom.module.css";

const MapCard = () => {
  return (
    <div className={styles.card} style={{ height: "100%" }}>
      <div className={styles.cardHeader}>
        <span>Map</span>
      </div>

      <div
        style={{
          height: "220px",
          borderRadius: "15px",
          background:
            "url('https://maps.wikimedia.org/img/osm-intl,10,52.5,13.4,400x250.png') center/cover",
        }}
      />
    </div>
  );
};

export default MapCard;