import styles from "./Sidebar.module.css";
import {
  FaTachometerAlt,
  FaBus,
  FaUserTie,
  FaRoute,
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
    { name: "Buses", icon: <FaBus />, path: "/admin/add-bus" },
    { name: "Drivers", icon: <FaUserTie />, path: "/admin/add-driver" },
    { name: "Routes", icon: <FaRoute />, path: "/admin/add-route" },
    { name: "Schedules", icon: <FaCalendarAlt />, path: "/admin/schedule-bus" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Reports", icon: <FaChartBar />, path: "/admin/reports" },
    { name: "Notifications", icon: <FaBell />, path: "/admin/notifications" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className={styles.container}>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`${styles.item} ${
              location.pathname === item.path ? styles.active : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div
        className={styles.logout}
        onClick={() => {
          // later: clear JWT token
          navigate("/");
        }}
      >
        <FaSignOutAlt className={styles.icon} />
        Logout
      </div>
    </div>
  );
}

export default Sidebar;