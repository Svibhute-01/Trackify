import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import Dashboard from "./Dashboard";
import Buses from "../../components/admin/Buses";
import Drivers from "../../components/admin/Drivers";
import styles from "./AdminLayout.module.css";
import Schedule from "../../components/admin/Schedule";
import Routes from "../../components/admin/Routes";
import { useState } from "react";

function AdminLayout() {
  const [selectedtab, setselectedtab] = useState("Dashboard");

  // Function to render content based on sidebar selection
  const renderContent = () => {
    switch (selectedtab) {
      case "Dashboard":
        return <Dashboard />;
      case "Buses":
        return <Buses />;
      case "Drivers":
        return <Drivers/>
      case "Routes":
         return <Routes />;
         case "Schedules":
         return <Schedule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar selectedtab={selectedtab} setselectedtab={setselectedtab} />

      <div className={styles.mainSection}>
        <Navbar />
        {renderContent()} {/* Render dynamic section here */}
      </div>
    </div>
  );
}

export default AdminLayout;
