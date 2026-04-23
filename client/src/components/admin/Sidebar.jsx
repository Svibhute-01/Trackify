import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBus,
  FaUserTie,
  FaRoute,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin", end: true },
  { name: "Buses", icon: <FaBus />, path: "/admin/add-bus" },
  { name: "Drivers", icon: <FaUserTie />, path: "/admin/add-driver" },
  { name: "Routes", icon: <FaRoute />, path: "/admin/add-route" },
  { name: "Schedules", icon: <FaCalendarAlt />, path: "/admin/schedule-bus" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🚍</span>
        <span className={styles.brandName}>Trackify</span>
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

export default Sidebar;
