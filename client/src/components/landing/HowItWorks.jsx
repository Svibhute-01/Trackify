import styles from "./HowItWorks.module.css";
import { FaSearch, FaListUl, FaBus } from "react-icons/fa";

const steps = [
  {
    num: "01",
    icon: <FaSearch />,
    title: "Search your route",
    text: "Enter your origin and destination cities. Partial matches work too — typing a few letters is enough.",
  },
  {
    num: "02",
    icon: <FaListUl />,
    title: "Compare available trips",
    text: "Browse today and upcoming buses with departure times, drivers, distance and total stops.",
  },
  {
    num: "03",
    icon: <FaBus />,
    title: "Track your journey",
    text: "See live status on your scheduled trip — from scheduled to running to completed.",
  },
];

const HowItWorks = () => (
  <section className={styles.section} id="how-it-works">
    <div className={styles.inner}>
      <span className={styles.eyebrow}>How it works</span>
      <h2 className={styles.title}>From search to seat in three simple steps</h2>
      <p className={styles.subtitle}>
        Trackify keeps the experience focused — no clutter, no confusion, just
        the trips that matter to you.
      </p>

      <div className={styles.grid}>
        {steps.map((s, i) => (
          <div key={s.num} className={styles.step}>
            <div className={styles.stepHeader}>
              <span className={styles.num}>{s.num}</span>
              <span className={styles.icon}>{s.icon}</span>
            </div>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepText}>{s.text}</p>
            {i < steps.length - 1 && <div className={styles.connector} />}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
