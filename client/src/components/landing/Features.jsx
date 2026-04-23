import styles from "./Features.module.css";
import {
  FaSearchLocation,
  FaRoute,
  FaClock,
  FaShieldAlt,
  FaUsersCog,
  FaMobileAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaSearchLocation />,
    title: "Instant Trip Search",
    text: "Find buses between any two cities in seconds with smart, partial-name matching.",
  },
  {
    icon: <FaRoute />,
    title: "Smart Route Management",
    text: "Routes with intermediate stops, distance and duration, all kept in one place.",
  },
  {
    icon: <FaClock />,
    title: "Real-Time Schedules",
    text: "Today and upcoming trips only — no clutter from past or cancelled journeys.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Conflict-Free Booking",
    text: "The system blocks double-booking of buses or drivers automatically.",
  },
  {
    icon: <FaUsersCog />,
    title: "Role-Based Access",
    text: "Separate experiences for passengers, administrators and drivers.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Friendly",
    text: "A responsive design that works seamlessly on phones, tablets and desktops.",
  },
];

const Features = () => (
  <section className={styles.section} id="features">
    <div className={styles.inner}>
      <span className={styles.eyebrow}>Why Trackify</span>
      <h2 className={styles.title}>Everything you need to run a smarter fleet</h2>
      <p className={styles.subtitle}>
        Trackify combines passenger search, fleet operations and driver tools in
        a single, beautifully simple platform.
      </p>

      <div className={styles.grid}>
        {features.map((f) => (
          <div key={f.title} className={styles.card}>
            <div className={styles.iconWrap}>{f.icon}</div>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardText}>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
