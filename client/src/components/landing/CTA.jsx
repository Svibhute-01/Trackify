import { Link } from "react-router-dom";
import styles from "./CTA.module.css";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => (
  <section className={styles.section}>
    <div className={styles.inner}>
      <div className={styles.content}>
        <h2 className={styles.title}>Ready to streamline your bus operations?</h2>
        <p className={styles.text}>
          Join Trackify today and give your passengers, drivers and admins the
          experience they deserve.
        </p>
      </div>
      <div className={styles.actions}>
        <Link to="/register" className={styles.primary}>
          Get Started <FaArrowRight />
        </Link>
        <Link to="/search" className={styles.secondary}>
          Search a bus
        </Link>
      </div>
    </div>
  </section>
);

export default CTA;
