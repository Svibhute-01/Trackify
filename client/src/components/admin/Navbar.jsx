import { FaBell } from "react-icons/fa";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.bar}>
      <div className={styles.spacer} />
      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <FaBell />
        </button>
        <div className={styles.user}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
