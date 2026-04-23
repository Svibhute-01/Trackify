import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.mainSection}>
        <Navbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
