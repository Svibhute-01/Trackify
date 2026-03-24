import { useState, useEffect } from "react";
import styles from "./Buses.module.css";
import API from "../../api/api";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

function Buses() {
  // State
  const [buses, setBuses] = useState([]);
  const [numberPlate, setNumberPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 🔥 FETCH BUSES
  const fetchBuses = async () => {
    try {
      const res = await API.get("/buses");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setBuses(data || []);
    } catch (err) {
      console.error(err);
      alert("Could not fetch buses");
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // 🔥 ADD / UPDATE BUS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numberPlate.trim() || !capacity) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const payload = {
      numberPlate: numberPlate.toUpperCase(),
      capacity: Number(capacity),
      status,
    };

    try {
      if (editingId) {
        // UPDATE
        await API.put(`/buses/${editingId}`, payload);
        alert("Bus updated successfully!");
      } else {
        // CREATE
        await API.post("/buses/add", payload);
        alert("Bus added successfully!");
      }

      // RESET FORM
      setNumberPlate("");
      setCapacity("");
      setStatus("Inactive");
      setEditingId(null);

      fetchBuses();
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EDIT BUS
  const handleEdit = (bus) => {
    setNumberPlate(bus.numberPlate);
    setCapacity(bus.capacity);
    setStatus(bus.status);
    setEditingId(bus._id);
  };

  // 🔥 DELETE BUS
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bus?")) return;

    try {
      await API.delete(`/buses/${id}`);
      setBuses(buses.filter((bus) => bus._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Status badge styling
  const getStatusClass = (status) => {
    if (status === "Active") return styles.active;
    if (status === "Inactive") return styles.inactive;
    if (status === "On Trip") return styles.onTrip;
    return "";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Buses Management</h2>

      {/* Add Bus Card */}
      <div className={styles.card}>
        <h3>{editingId ? "Edit Bus" : "Add New Bus"}</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Number Plate</label>
            <input
              type="text"
              placeholder="e.g. MH12AB1234"
              value={numberPlate}
              onChange={(e) => setNumberPlate(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Capacity</label>
            <input
              type="number"
              placeholder="e.g 60"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Trip">On Trip</option>
            </select>
          </div>

          <button type="submit" className={styles.addBtn} disabled={loading}>
            <FaPlus />{" "}
            {loading
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
              ? "Update Bus"
              : "Add Bus"}
          </button>
        </form>
      </div>

      {/* Fleet Overview */}
      <div className={styles.card}>
        <h3>Fleet Overview</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Number Plate</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {buses.map((bus, index) => (
              <tr key={bus._id || index}>
                <td>{index + 1}</td>
                <td className={styles.plate}>{bus.numberPlate}</td>
                <td>{bus.capacity}</td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      bus.status
                    )}`}
                  >
                    {bus.status}
                  </span>
                </td>

                <td className={styles.actions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => handleEdit(bus)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className={`${styles.iconBtn} ${styles.delete}`}
                    onClick={() => handleDelete(bus._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Buses;