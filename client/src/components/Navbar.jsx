import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      
      {/* LOGO */}
      <div className={styles.logo} onClick={() => navigate("/")}>
        <img src={logo} alt="Trackify Logo" />
      </div>

      {/* HAMBURGER */}
      <div
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* NAV LINKS */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
        
        <li>
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={styles.navItem}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/track"
            onClick={() => setMenuOpen(false)}
            className={styles.navItem}
          >
            Track Bus
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/routes"
            onClick={() => setMenuOpen(false)}
            className={styles.navItem}
          >
            Routes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/favorites"
            onClick={() => setMenuOpen(false)}
            className={styles.navItem}
          >
            Favorites
          </NavLink>
        </li>

        {/* 📱 Mobile Login */}
        <li className={styles.mobileOnly}>
          <NavLink
            to="/login"
            className={styles.mobileLogin}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </NavLink>
        </li>
      </ul>

      {/* 💻 Desktop Login */}
      <NavLink to="/login" className={styles.loginBtn}>
        Login
      </NavLink>
    </nav>
  );
}

export default Navbar;