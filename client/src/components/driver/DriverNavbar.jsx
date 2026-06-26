import { FaBell } from "react-icons/fa";
import styles from "./DriverNavbar.module.css";

function DriverNavbar() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : {};
  const initial = (user.name || "D").charAt(0).toUpperCase();

  return (
    <header className={styles.bar}>
      <div className={styles.spacer} />
      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <FaBell />
        </button>
        <div className={styles.user}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user.name || "Driver"}</span>
            <span className={styles.userRole}>Driver</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DriverNavbar;
