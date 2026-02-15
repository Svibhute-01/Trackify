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

function Sidebar({ selectedtab, setselectedtab }) {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Buses", icon: <FaBus /> },
    { name: "Drivers", icon: <FaUserTie /> },
    { name: "Routes", icon: <FaRoute /> },
    { name: "Schedules", icon: <FaCalendarAlt /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Reports", icon: <FaChartBar /> },
    { name: "Notifications", icon: <FaBell /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className={styles.container}>
      

      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`${styles.item} ${
              selectedtab === item.name ? styles.active : ""
            }`}
            onClick={() => setselectedtab(item.name)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div className={styles.logout}>
        <FaSignOutAlt className={styles.icon} />
        Logout
      </div>
    </div>
  );
}

export default Sidebar;
