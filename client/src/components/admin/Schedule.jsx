import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import { FaTrash } from "react-icons/fa";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [formData, setFormData] = useState({
    busId: "",
    driverId: "",
    routeId: "",
    date: "",
    departureTime: "",
    status: "Scheduled",
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const storedBuses = JSON.parse(localStorage.getItem("buses")) || [];
    const storedDrivers = JSON.parse(localStorage.getItem("drivers")) || [];
    const storedRoutes = JSON.parse(localStorage.getItem("routes")) || [];
    const storedSchedules = JSON.parse(localStorage.getItem("schedules")) || [];

    // Default Buses
    if (storedBuses.length === 0) {
      const defaultBuses = [
        { id: 1, number: "BUS-101" },
        { id: 2, number: "BUS-202" },
      ];
      localStorage.setItem("buses", JSON.stringify(defaultBuses));
      setBuses(defaultBuses);
    } else {
      setBuses(storedBuses);
    }

    // Default Drivers
    if (storedDrivers.length === 0) {
      const defaultDrivers = [
        { id: 1, name: "John Smith" },
        { id: 2, name: "David Kumar" },
      ];
      localStorage.setItem("drivers", JSON.stringify(defaultDrivers));
      setDrivers(defaultDrivers);
    } else {
      setDrivers(storedDrivers);
    }

    // Default Routes
    if (storedRoutes.length === 0) {
      const defaultRoutes = [
        { id: 1, from: "City Center", to: "Airport" },
        { id: 2, from: "Downtown", to: "Hill Station" },
      ];
      localStorage.setItem("routes", JSON.stringify(defaultRoutes));
      setRoutes(defaultRoutes);
    } else {
      setRoutes(storedRoutes);
    }

    // Default Schedules
    if (storedSchedules.length === 0) {
      const defaultSchedules = [
        {
          id: 1,
          busId: "1",
          driverId: "1",
          routeId: "1",
          date: "2026-02-16",
          departureTime: "09:00",
          status: "Scheduled",
        },
        {
          id: 2,
          busId: "2",
          driverId: "2",
          routeId: "2",
          date: "2026-02-16",
          departureTime: "14:30",
          status: "Scheduled",
        },
      ];
      localStorage.setItem("schedules", JSON.stringify(defaultSchedules));
      setSchedules(defaultSchedules);
    } else {
      setSchedules(storedSchedules);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  /* ---------------- AVAILABILITY CHECK ---------------- */
  const isBusBooked = (busId) => {
    return schedules.some(
      (s) =>
        s.busId === busId &&
        s.date === formData.date &&
        s.departureTime === formData.departureTime
    );
  };

  const isDriverBooked = (driverId) => {
    return schedules.some(
      (s) =>
        s.driverId === driverId &&
        s.date === formData.date &&
        s.departureTime === formData.departureTime
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isBusBooked(formData.busId)) {
      alert("Bus already assigned at this time!");
      return;
    }

    if (isDriverBooked(formData.driverId)) {
      alert("Driver already assigned at this time!");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      ...formData,
    };

    setSchedules([...schedules, newSchedule]);

    setFormData({
      busId: "",
      driverId: "",
      routeId: "",
      date: "",
      departureTime: "",
      status: "Scheduled",
    });
  };

  const handleDelete = (id) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
  };

  const getBusNumber = (id) =>
    buses.find((b) => b.id === Number(id))?.number || "N/A";

  const getDriverName = (id) =>
    drivers.find((d) => d.id === Number(id))?.name || "N/A";

  const getRouteName = (id) => {
    const route = routes.find((r) => r.id === Number(id));
    return route ? `${route.from} → ${route.to}` : "N/A";
  };

  return (
    <div className={styles.container}>
      <h2>Admin Schedule Management</h2>

      {/* ASSIGN SECTION */}
      <div className={styles.card}>
        <h3>Assign Bus & Driver</h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />

          <select
            name="busId"
            value={formData.busId}
            onChange={handleChange}
            required
          >
            <option value="">Select Bus</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.number}
              </option>
            ))}
          </select>

          <select
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            required
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          <select
            name="routeId"
            value={formData.routeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.from} → {route.to}
              </option>
            ))}
          </select>

          <button type="submit">Assign Schedule</button>
        </form>
      </div>

      {/* ALL ASSIGNMENTS */}
      <div className={styles.card}>
        <h3>All Assignments</h3>

        {schedules.length === 0 ? (
          <p style={{ padding: "20px" }}>No schedules assigned yet.</p>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className={styles.scheduleCard}>
              <div>
                <strong>🚌 {getBusNumber(schedule.busId)}</strong>
                <p>👨‍✈️ {getDriverName(schedule.driverId)}</p>
                <p>🗺 {getRouteName(schedule.routeId)}</p>
                <p>📅 {schedule.date}</p>
                <p>🕒 {schedule.departureTime}</p>
                <p>Status: {schedule.status}</p>
              </div>

              <FaTrash
                className={styles.deleteIcon}
                onClick={() => handleDelete(schedule.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
