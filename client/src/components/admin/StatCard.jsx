import styles from "./StatCard.module.css";

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${styles.card} ${styles.red}`}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;
