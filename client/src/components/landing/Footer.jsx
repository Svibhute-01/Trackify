import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { FaBus, FaTwitter, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <span className={styles.logo}><FaBus /></span>
            <span className={styles.name}>Trackify</span>
          </div>
          <p className={styles.tagline}>
            A modern bus tracking and scheduling platform built for passengers,
            drivers and fleet operators.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="mailto:hello@trackify.app" aria-label="Email"><FaEnvelope /></a>
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>Product</h4>
          <ul>
            <li><Link to="/search">Search Buses</Link></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it works</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/admin">Admin Console</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {year} Trackify. All rights reserved.</span>
        <span>Made with care for safer journeys.</span>
      </div>
    </footer>
  );
};

export default Footer;
