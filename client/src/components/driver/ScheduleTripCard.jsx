import React, { useState } from "react";
import { FiClock } from "react-icons/fi";
import styles from "./ScheduleTripCard.module.css";
import API from "../../api/api";
import { useToast } from "../ui/Toast";

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

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

const STATUS_LABELS = {
  scheduled: "Scheduled",
  running: "Running",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS = {
  scheduled: { bg: "#dbeafe", color: "#1d4ed8" },
  running: { bg: "#dcfce7", color: "#15803d" },
  completed: { bg: "#f3f4f6", color: "#374151" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c" },
};

const ScheduleTripCard = ({ trips = [], onStatusChange }) => {
  const toast = useToast();
  const [loadingId, setLoadingId] = useState(null);

  const updateStatus = async (id, status) => {
    setLoadingId(id);
    try {
      await API.patch(`/schedules/${id}/status`, { status });
      toast.success(`Trip marked as ${status}`);
      onStatusChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update trip");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>All Trips</h2>

      {trips.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: "14px" }}>No trips assigned yet.</p>
      ) : (
        <div className={styles.tripList}>
          {trips.map((trip) => {
            const statusStyle = STATUS_COLORS[trip.status] || STATUS_COLORS.scheduled;
            const isLoading = loadingId === trip._id;

            return (
              <div key={trip._id} className={styles.tripItem}>
                <div className={styles.leftSection}>
                  <div className={styles.route}>
                    {trip.route?.from || "—"}
                    <span className={styles.arrow}>→</span>
                    {trip.route?.to || "—"}
                  </div>
                  <div className={styles.duration}>
                    <FiClock size={14} />
                    <span>{diffHrMin(trip.departureTime, trip.arrivalTime)}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                    Bus: {trip.bus?.busNumber || trip.bus?.numberPlate || "—"}
                  </div>
                </div>

                <div className={styles.rightSection}>
                  <div className={styles.dateTime}>
                    {fmtDate(trip.departureTime)} • {fmt(trip.departureTime)}
                  </div>

                  <span
                    className={styles.status}
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {STATUS_LABELS[trip.status] || trip.status}
                  </span>

                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    {trip.status === "scheduled" && (
                      <button
                        onClick={() => updateStatus(trip._id, "running")}
                        disabled={isLoading}
                        style={{
                          background: "#3b66f5",
                          color: "#fff",
                          border: "none",
                          padding: "5px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: isLoading ? 0.6 : 1,
                        }}
                      >
                        {isLoading ? "…" : "▶ Start"}
                      </button>
                    )}
                    {trip.status === "running" && (
                      <button
                        onClick={() => updateStatus(trip._id, "completed")}
                        disabled={isLoading}
                        style={{
                          background: "#22c55e",
                          color: "#fff",
                          border: "none",
                          padding: "5px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: isLoading ? 0.6 : 1,
                        }}
                      >
                        {isLoading ? "…" : "✓ Complete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduleTripCard;
