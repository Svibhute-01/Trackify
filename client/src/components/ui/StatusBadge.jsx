import styles from "./StatusBadge.module.css";

const TONE_MAP = {
  Active: "success",
  Available: "success",
  scheduled: "info",
  running: "info",
  completed: "success",
  cancelled: "danger",
  Inactive: "neutral",
  "Off Duty": "neutral",
  "On Trip": "warning",
};

function StatusBadge({ status, tone }) {
  const resolvedTone = tone || TONE_MAP[status] || "neutral";
  return (
    <span className={`${styles.badge} ${styles[resolvedTone]}`}>
      <span className={styles.dot} />
      {status}
    </span>
  );
}

export default StatusBadge;
