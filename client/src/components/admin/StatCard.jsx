import styles from "./StatCard.module.css";

function StatCard({ title, value, icon, color = "primary", trend }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles[color]}`}>{icon}</div>
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
        {trend && <span className={styles.trend}>{trend}</span>}
      </div>
    </div>
  );
}

export default StatCard;
