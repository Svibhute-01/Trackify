import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaRoute,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import styles from "./DriverSidebar.module.css";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/driver/dashboard", end: true },
  { name: "My Schedule", icon: <FaCalendarAlt />, path: "/driver/dashboard" },
  { name: "My Trips", icon: <FaRoute />, path: "/driver/dashboard" },
];

function DriverSidebar() {
  const navigate = useNavigate();
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🚍</span>
        <span className={styles.brandName}>Trackify</span>
      </div>

      <div className={styles.driverCard}>
        <div className={styles.driverAvatar}>
          {(user.name || "D").charAt(0).toUpperCase()}
        </div>
        <div className={styles.driverInfo}>
          <span className={styles.driverName}>{user.name || "Driver"}</span>
          <span className={styles.driverRole}>Driver</span>
        </div>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button className={styles.logout} onClick={handleLogout}>
        <FaSignOutAlt className={styles.icon} />
        Logout
      </button>
    </aside>
  );
}

export default DriverSidebar;
