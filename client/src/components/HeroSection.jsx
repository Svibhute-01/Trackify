import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from.trim() && !to.trim()) return;
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      <div className={styles.inner}>
        <span className={styles.eyebrow}>Real-time bus tracking</span>
        <h1 className={styles.title}>
          Catch every bus,<br />never miss a ride
        </h1>
        <p className={styles.subtitle}>
          Find today's and upcoming bus schedules across your network in seconds.
        </p>

        <form className={styles.searchCard} onSubmit={handleSearch}>
          <div className={styles.field}>
            <FaMapMarkerAlt className={styles.fieldIcon} />
            <input
              type="text"
              placeholder="From (e.g. Mumbai)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <FaArrowRight className={styles.arrow} />

          <div className={styles.field}>
            <FaMapMarkerAlt className={styles.fieldIcon} />
            <input
              type="text"
              placeholder="To (e.g. Pune)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.searchBtn}>
            <FaSearch /> Search
          </button>
        </form>

        <p className={styles.hint}>
          Tip: partial matches work — typing "mum" will match "Mumbai".
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
