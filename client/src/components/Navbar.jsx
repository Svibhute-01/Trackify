import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../assets/logo.png"; // adjust path if needed

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      
      {/* LOGO */}
      <div className={styles.logo}>
        <img src={logo} alt="Trackify Logo" />
       
      </div>

      {/* HAMBURGER ICON */}
      <div
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* NAV LINKS */}
      <ul
        className={`${styles.navLinks} ${
          menuOpen ? styles.showMenu : ""
        }`}
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/track"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            onClick={() => setMenuOpen(false)}
          >
            Track Bus
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/routes"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            onClick={() => setMenuOpen(false)}
          >
            Routes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            onClick={() => setMenuOpen(false)}
          >
            Favorites
          </NavLink>
        </li>

        {/* Mobile Login */}
        <li className={styles.mobileOnly}>
          <button className={styles.mobileLogin}>Login</button>
        </li>
      </ul>

      {/* Desktop Login */}
      <button className={styles.loginBtn}>Login</button>
    </nav>
  );
}

export default Navbar;
