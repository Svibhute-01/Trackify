import React, { useState } from "react";
import styles from "./DashboardBottom.module.css";
import API from "../../api/api";
import { useToast } from "../ui/Toast";

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

const CurrentTripCard = ({ trip, todayTrips = [], onStatusChange }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await API.patch(`/schedules/${id}/status`, { status });
      toast.success(`Trip marked as ${status}`);
      onStatusChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  if (trip) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Current Trip</span>
          <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600 }}>● Running</span>
        </div>

        <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
          <div>
            <strong>Route</strong>
            <br />
            {trip.route?.from || "—"} → {trip.route?.to || "—"}
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>Bus</strong>
            <br />
            {trip.bus?.busNumber || trip.bus?.numberPlate || "—"}
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>Departure</strong>
            <br />
            {fmt(trip.departureTime)}
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>Arrival</strong>
            <br />
            {fmt(trip.arrivalTime)}
          </div>
        </div>

        <button
          onClick={() => updateStatus(trip._id, "completed")}
          disabled={loading}
          style={{
            marginTop: "15px",
            background: "#22c55e",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Updating…" : "✓ Mark as Completed"}
        </button>
      </div>
    );
  }

  const nextTrip = todayTrips.find((s) => s.status === "scheduled");

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span>Current Trip</span>
      </div>

      {nextTrip ? (
        <>
          <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
            <div>
              <strong>Next Trip</strong>
              <br />
              {nextTrip.route?.from || "—"} → {nextTrip.route?.to || "—"}
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>Bus</strong>
              <br />
              {nextTrip.bus?.busNumber || nextTrip.bus?.numberPlate || "—"}
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>Departure</strong>
              <br />
              {fmt(nextTrip.departureTime)}
            </div>
          </div>

          <button
            onClick={() => updateStatus(nextTrip._id, "running")}
            disabled={loading}
            style={{
              marginTop: "15px",
              background: "#3b66f5",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Updating…" : "▶ Start Trip"}
          </button>
        </>
      ) : (
        <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "12px" }}>
          No active or upcoming trips for today.
        </div>
      )}
    </div>
  );
};

export default CurrentTripCard;
