import { useEffect, useState, useCallback } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaBus,
  FaRoute,
  FaPlayCircle,
} from "react-icons/fa";
import API from "../../api/api";
import Spinner from "../../components/ui/Spinner";
import StatusBadge from "../../components/ui/StatusBadge";
import styles from "./DriverDashboard.module.css";

/* ── helpers ── */
const fmtTime = (dt) =>
  dt ? new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

const fmtDate = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    : "—";

const diffHrMin = (dep, arr) => {
  if (!dep || !arr) return "—";
  const ms = new Date(arr) - new Date(dep);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
};

/* ── stat card ── */
function StatCard({ icon, label, value, color }) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[color]}`}>{icon}</div>
      <div className={styles.statBody}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
      </div>
    </div>
  );
}

/* ── trip action button ── */
function ActionBtn({ scheduleId, currentStatus, onDone, loadingId, setLoadingId }) {
  const handle = async (newStatus) => {
    setLoadingId(scheduleId);
    try {
      await API.patch(`/schedules/${scheduleId}/status`, { status: newStatus });
      onDone();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setLoadingId(null);
    }
  };

  const busy = loadingId === scheduleId;

  if (currentStatus === "scheduled") {
    return (
      <button className={`${styles.btn} ${styles.btnStart}`} onClick={() => handle("running")} disabled={busy}>
        {busy ? "…" : <><FaPlayCircle /> Start</>}
      </button>
    );
  }
  if (currentStatus === "running") {
    return (
      <button className={`${styles.btn} ${styles.btnComplete}`} onClick={() => handle("completed")} disabled={busy}>
        {busy ? "…" : <><FaCheckCircle /> Complete</>}
      </button>
    );
  }
  return null;
}

/* ══════════════ MAIN DASHBOARD ══════════════ */
export default function DriverDashboard() {
  const [data, setData] = useState({ all: [], today: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : {};
  const driverId = user.driverId || user.id;

  const today = new Date().toLocaleDateString([], {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const fetchData = useCallback(async () => {
    if (!driverId) return;
    try {
      const res = await API.get(`/schedules/driver/${driverId}`);
      setData(res.data.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const runningTrip =
    data.today.find((s) => s.status === "running") ||
    data.all.find((s) => s.status === "running");

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={32} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Welcome Banner ── */}
      <div className={styles.banner}>
        <div>
          <h1 className={styles.bannerTitle}>Welcome back, {user.name || "Driver"} 👋</h1>
          <p className={styles.bannerSub}>{today}</p>
        </div>
        <div className={styles.bannerBadge}>
          <FaBus size={28} />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <StatCard icon={<FaCalendarCheck />} label="Today's Trips" value={data.today.length} color="primary" />
        <StatCard icon={<FaClock />} label="Upcoming" value={data.upcoming.length} color="orange" />
        <StatCard icon={<FaCheckCircle />} label="Completed" value={data.completed.length} color="green" />
      </div>

      {/* ── Active Trip Banner ── */}
      {runningTrip && (
        <div className={styles.activeBanner}>
          <div className={styles.activeDot} />
          <div className={styles.activeInfo}>
            <span className={styles.activeLabel}>Trip in progress</span>
            <span className={styles.activeRoute}>
              {runningTrip.route?.from} → {runningTrip.route?.to}
            </span>
          </div>
          <div className={styles.activeMeta}>
            <span>Bus: <strong>{runningTrip.bus?.busNumber || runningTrip.bus?.numberPlate || "—"}</strong></span>
            <span>ETA: <strong>{fmtTime(runningTrip.arrivalTime)}</strong></span>
          </div>
          <ActionBtn
            scheduleId={runningTrip._id}
            currentStatus="running"
            onDone={fetchData}
            loadingId={loadingId}
            setLoadingId={setLoadingId}
          />
        </div>
      )}

      {/* ── Today's Trips ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Today's Trips</h2>
        {data.today.length === 0 ? (
          <div className={styles.empty}>No trips scheduled for today.</div>
        ) : (
          <div className={styles.tripGrid}>
            {data.today.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDone={fetchData} loadingId={loadingId} setLoadingId={setLoadingId} />
            ))}
          </div>
        )}
      </section>

      {/* ── Full Schedule Table ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Schedules</h2>
        <div className={styles.tableWrap}>
          {data.all.length === 0 ? (
            <div className={styles.empty}>No schedules assigned yet.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Bus</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.all.map((trip) => (
                  <tr key={trip._id}>
                    <td>
                      <span className={styles.routeCell}>
                        <FaRoute className={styles.routeIcon} />
                        {trip.route?.from || "—"} → {trip.route?.to || "—"}
                      </span>
                    </td>
                    <td>{trip.bus?.busNumber || trip.bus?.numberPlate || "—"}</td>
                    <td>{fmtDate(trip.departureTime)}</td>
                    <td>{fmtTime(trip.departureTime)}</td>
                    <td>{fmtTime(trip.arrivalTime)}</td>
                    <td>{diffHrMin(trip.departureTime, trip.arrivalTime)}</td>
                    <td><StatusBadge status={trip.status} /></td>
                    <td>
                      <ActionBtn
                        scheduleId={trip._id}
                        currentStatus={trip.status}
                        onDone={fetchData}
                        loadingId={loadingId}
                        setLoadingId={setLoadingId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

/* ── Trip Card ── */
function TripCard({ trip, onDone, loadingId, setLoadingId }) {
  const statusColors = {
    scheduled: { bg: "var(--color-info-soft)", color: "var(--color-info)" },
    running:   { bg: "var(--color-success-soft)", color: "var(--color-success)" },
    completed: { bg: "var(--color-surface-2)", color: "var(--color-text-muted)" },
    cancelled: { bg: "var(--color-danger-soft)", color: "var(--color-danger)" },
  };
  const sc = statusColors[trip.status] || statusColors.scheduled;

  return (
    <div className={styles.tripCard} style={{ borderLeftColor: sc.color }}>
      <div className={styles.tripCardTop}>
        <span className={styles.tripRoute}>
          {trip.route?.from || "—"} <span className={styles.arrow}>→</span> {trip.route?.to || "—"}
        </span>
        <span
          className={styles.tripStatus}
          style={{ background: sc.bg, color: sc.color }}
        >
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>

      <div className={styles.tripCardMeta}>
        <div className={styles.metaItem}>
          <FaBus className={styles.metaIcon} />
          <span>{trip.bus?.busNumber || trip.bus?.numberPlate || "—"}</span>
        </div>
        <div className={styles.metaItem}>
          <FaClock className={styles.metaIcon} />
          <span>{fmtTime(trip.departureTime)} – {fmtTime(trip.arrivalTime)}</span>
        </div>
        <div className={styles.metaItem}>
          <FaRoute className={styles.metaIcon} />
          <span>{diffHrMin(trip.departureTime, trip.arrivalTime)}</span>
        </div>
      </div>

      <div className={styles.tripCardAction}>
        <ActionBtn
          scheduleId={trip._id}
          currentStatus={trip.status}
          onDone={onDone}
          loadingId={loadingId}
          setLoadingId={setLoadingId}
        />
      </div>
    </div>
  );
}
