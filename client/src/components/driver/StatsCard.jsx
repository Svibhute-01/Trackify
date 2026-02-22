import React from "react";
import styles from "./StatCard.module.css";

const StatsCard = ({
  icon,
  title,
  value,
  unit,
  subtitle,
  chart,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.icon}>{icon}</div>
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.middle}>
        <div className={styles.value}>
          {value}
          {unit && <span className={styles.unit}> {unit}</span>}
        </div>

        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>

      <div className={styles.chartArea}>
        {chart}
      </div>
    </div>
  );
};

export default StatsCard;