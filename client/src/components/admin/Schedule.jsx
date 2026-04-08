import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import API from "../../api/api";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [available, setAvailable] = useState({
    buses: [],
    drivers: [],
    routes: [],
  });

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    date: "",
    departureTime: "",
    arrivalTime: "",
    bus: "",
    driver: "",
    route: "",
    status: "scheduled",
  });

  /* ---------------- FETCH ---------------- */
  const fetchSchedules = async () => {
    const res = await API.get("/schedules");
    setSchedules(res.data.data || []);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  /* ---------------- AVAILABLE ---------------- */
  useEffect(() => {
    const fetchAvailable = async () => {
      if (!form.date || !form.departureTime || !form.arrivalTime) return;

      const res = await API.get(
        `/schedules/available?date=${form.date}&departureTime=${form.departureTime}&arrivalTime=${form.arrivalTime}`
      );

      setAvailable(res.data.data);
    };

    fetchAvailable();
  }, [form.date, form.departureTime, form.arrivalTime]);

  /* ---------------- INPUT ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await API.put(`/schedules/${editingId}`, form);

        setSchedules((prev) =>
          prev.map((s) => (s._id === editingId ? res.data.data : s))
        );

        setEditingId(null);
      } else {
        const res = await API.post("/schedules", form);
        setSchedules((prev) => [...prev, res.data.data]);
      }

      setForm({
        date: "",
        departureTime: "",
        arrivalTime: "",
        bus: "",
        driver: "",
        route: "",
        status: "scheduled",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (s) => {
    setForm({
      date: s.date?.split("T")[0],
      departureTime: s.departureTime?.slice(11, 16),
      arrivalTime: s.arrivalTime?.slice(11, 16),
      bus: s.bus?._id,
      driver: s.driver?._id,
      route: s.route?._id,
      status: s.status,
    });

    setEditingId(s._id);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    await API.delete(`/schedules/${id}`);
    setSchedules((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className={styles.container}>
      <h2>Admin Schedule Management</h2>

      {/* FORM */}
      <div className={styles.card}>
        <h3>{editingId ? "Edit Schedule" : "Assign Bus & Driver"}</h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="time" name="departureTime" value={form.departureTime} onChange={handleChange} required />
          <input type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} required />

          <select name="bus" value={form.bus} onChange={handleChange} required>
            <option value="">Select Bus</option>
            {available.buses?.map((b) => (
              <option key={b._id} value={b._id}>{b.numberPlate}</option>
            ))}
          </select>

          <select name="driver" value={form.driver} onChange={handleChange} required>
            <option value="">Select Driver</option>
            {available.drivers?.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>

          <select name="route" value={form.route} onChange={handleChange} required>
            <option value="">Select Route</option>
            {available.routes?.map((r) => (
              <option key={r._id} value={r._id}>{r.from} → {r.to}</option>
            ))}
          </select>

          <button type="submit">
            {editingId ? "Update Schedule" : "Assign Schedule"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className={styles.card}>
        <h3>All Schedules</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Bus</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="8">No schedules found</td>
              </tr>
            ) : (
              schedules.map((s, index) => (
                <tr key={s._id}>
                  <td>{index + 1}</td>
                  <td>{s.bus?.numberPlate}</td>
                  <td>{s.driver?.name}</td>
                  <td>{s.route?.from} → {s.route?.to}</td>
                  <td>{new Date(s.departureTime).toLocaleDateString()}</td>
                  <td>
                    {new Date(s.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(s.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td>
                    <span className={styles.status}>{s.status}</span>
                  </td>
                  <td className={styles.actions}>
                    <FaEdit onClick={() => handleEdit(s)} />
                    <FaTrash onClick={() => handleDelete(s._id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;