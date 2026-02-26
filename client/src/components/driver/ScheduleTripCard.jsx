import React from "react";
import { FiClock } from "react-icons/fi";
import styles from "./ScheduleTripCard.module.css";

const trips = [
  {
    from: "Poznan",
    to: "Berlin",
    date: "04/15/2025",
    time: "8:51 AM",
    duration: "3h 45m",
    status: "Completed",
  },
  {
    from: "Poznan",
    to: "Berlin",
    date: "04/15/2025",
    time: "8:51 AM",
    duration: "3h 45m",
    status: "En route",
  },
  {
    from: "Poznan",
    to: "Berlin",
    date: "04/15/2025",
    time: "8:51 AM",
    duration: "3h 45m",
    status: "Planned",
  },
  {
    from: "Poznan",
    to: "Berlin",
    date: "04/15/2025",
    time: "8:51 AM",
    duration: "3h 45m",
    status: "Canceled",
  },
];

const ScheduleTripCard = () => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return styles.completed;
      case "En route":
        return styles.enroute;
      case "Planned":
        return styles.planned;
      case "Canceled":
        return styles.canceled;
      default:
        return "";
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Schedule of trips</h2>

      <div className={styles.tripList}>
        {trips.map((trip, index) => (
          <div key={index} className={styles.tripItem}>
            <div className={styles.leftSection}>
              <div className={styles.route}>
                {trip.from}
                <span className={styles.arrow}>→</span>
                {trip.to}
              </div>

              <div className={styles.duration}>
                <FiClock size={14} />
                <span>{trip.duration}</span>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.dateTime}>
                {trip.date} • {trip.time}
              </div>

              <span
                className={`${styles.status} ${getStatusClass(
                  trip.status
                )}`}
              >
                {trip.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTripCard;