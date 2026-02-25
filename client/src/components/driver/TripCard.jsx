import React from "react";
import styles from "./TripCard.module.css";

const TripCard = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Current trip</h3>

      <div className={styles.tripDetails}>
        <div className={styles.locationGroup}>
          <div className={styles.location}>
            <span className={styles.time}>12:45 AM</span>
            <span className={styles.place}>Poznan, Bus Station</span>
          </div>

          <div className={styles.line} />

          <div className={styles.location}>
            <span className={styles.time}>4:05 AM</span>
            <span className={styles.place}>
              Berlin Airport BER, T 1/2
            </span>
          </div>

          <div className={styles.line} />

          <div className={styles.location}>
            <span className={styles.time}>4:30 AM</span>
            <span className={styles.place}>Berlin Südkreuz</span>
          </div>
        </div>

        <div className={styles.duration}>
          <span className={styles.durationLabel}>Duration:</span>
          <span className={styles.durationValue}>
            3 hours 45 min
          </span>
        </div>
      </div>

      <div className={styles.mapIcons}>
        <span className={styles.mapIcon}>📍 BER</span>
        <span className={styles.mapIcon}>📍 POZ</span>
      </div>
    </div>
  );
};

export default TripCard;