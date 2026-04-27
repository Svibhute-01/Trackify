import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import styles from "./Navbar.module.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/search", label: "Search Buses" },
  ];

  return (
    <nav className={styles.navbar}>
            <Link to="/" className={styles.brand} onClick={close}>
        <img src={logo} alt="Trackify Logo" className={styles.logo} />
      </Link>
      <button
        className={styles.hamburger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`${styles.navLinks} ${open ? styles.showMenu : ""}`}>
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              onClick={close}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
        <li className={styles.mobileOnly}>
          <Link to="/login" className={styles.loginBtnMobile} onClick={close}>
            Sign in
          </Link>
        </li>
      </ul>

      <Link to="/login" className={styles.loginBtn}>
        Sign in
      </Link>
    </nav>
  );
}

export default Navbar;
