import styles from "./Stats.module.css";

const stats = [
  { value: "120+", label: "Cities Connected" },
  { value: "350+", label: "Active Buses" },
  { value: "98%", label: "On-Time Trips" },
  { value: "24/7", label: "Operations Support" },
];

const Stats = () => (
  <section className={styles.section}>
    <div className={styles.inner}>
      {stats.map((s) => (
        <div key={s.label} className={styles.stat}>
          <div className={styles.value}>{s.value}</div>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
