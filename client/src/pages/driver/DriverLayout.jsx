import { Outlet } from "react-router-dom";
import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverNavbar from "../../components/driver/DriverNavbar";
import styles from "./DriverLayout.module.css";

const DriverLayout = () => {
  return (
    <div className={styles.shell}>
      <DriverSidebar />
      <div className={styles.mainSection}>
        <DriverNavbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
