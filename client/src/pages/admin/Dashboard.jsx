import { useEffect, useState } from "react";
import {
  FaBus,
  FaUserTie,
  FaRoute,
  FaCalendarAlt,
} from "react-icons/fa";
import StatCard from "../../components/admin/StatCard";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import StatusBadge from "../../components/ui/StatusBadge";
import API from "../../api/api";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [stats, setStats] = useState({ buses: 0, activeBuses: 0, drivers: 0, routes: 0, schedules: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [b, d, r, s] = await Promise.all([
          API.get("/buses"),
          API.get("/drivers"),
          API.get("/routes"),
          API.get("/schedules"),
        ]);
        const buses = b.data.data || b.data || [];
        const drivers = d.data.data || d.data || [];
        const routes = r.data.data || r.data || [];
        const schedules = s.data.data || s.data || [];

        setStats({
          buses: buses.length,
          activeBuses: buses.filter((x) => x.status === "Active").length,
          drivers: drivers.length,
          routes: routes.filter((x) => x.status === "Active").length,
          schedules: schedules.length,
        });
        setRecent(schedules.slice(-5).reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your fleet at a glance"
      />

      {loading ? (
        <div className={styles.loading}>
          <Spinner size={28} color="var(--color-primary)" />
        </div>
      ) : (
        <>
          <div className={styles.cardGrid}>
            <StatCard title="Total Buses" value={stats.buses} icon={<FaBus />} color="primary" />
            <StatCard title="Active Buses" value={stats.activeBuses} icon={<FaBus />} color="green" />
            <StatCard title="Drivers" value={stats.drivers} icon={<FaUserTie />} color="orange" />
            <StatCard title="Active Routes" value={stats.routes} icon={<FaRoute />} color="purple" />
            <StatCard title="Total Schedules" value={stats.schedules} icon={<FaCalendarAlt />} color="blue" />
          </div>

          <div className={styles.recent}>
            <Card title="Recent Schedules" subtitle="Last 5 created">
              {recent.length === 0 ? (
                <p className={styles.empty}>No schedules yet.</p>
              ) : (
                <ul className={styles.list}>
                  {recent.map((s) => (
                    <li key={s._id} className={styles.row}>
                      <div className={styles.rowMain}>
                        <span className={styles.bus}>{s.bus?.numberPlate || "—"}</span>
                        <span className={styles.route}>
                          {s.route?.from} → {s.route?.to}
                        </span>
                      </div>
                      <div className={styles.rowMeta}>
                        <span className={styles.time}>
                          {new Date(s.departureTime).toLocaleString([], {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                        <StatusBadge status={s.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
