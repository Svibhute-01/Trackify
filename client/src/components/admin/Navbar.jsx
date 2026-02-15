import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search buses, routes, drivers..."
        className={styles.search}
      />

      <div className={styles.admin}>
        🔔
        <span>Admin</span>
      </div>
    </div>
  );
}

export default Navbar;
