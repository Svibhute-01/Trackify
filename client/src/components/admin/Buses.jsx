import { useState, useEffect } from "react";

import styles from "./Buses.module.css";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

function Buses() {
  const navigate = useNavigate();

  // State
  const [buses, setBuses] = useState([]);
  const [numberPlate, setNumberPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [loading, setLoading] = useState(false);

  // Fetch buses from backend
  const fetchBuses = async () => {
    try {
      const res = await API.get("/buses");
      setBuses(res.data.data); // assuming backend returns array of buses
    } catch (err) {
      console.error(err);
      alert("Could not fetch buses");
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Add Bus
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numberPlate.trim() || !capacity) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/buses/add", {
        numberPlate: numberPlate.toUpperCase(),
        capacity: Number(capacity),
        status,
      });

      alert("Bus added successfully!");
      // Clear form
      setNumberPlate("");
      setCapacity("");
      setStatus("Inactive");

      // Refresh buses list
      fetchBuses();
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Could not add bus..");
    } finally {
      setLoading(false);
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
        <h3>Add New Bus</h3>

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
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Trip">On Trip</option>
            </select>
          </div>

          <button type="submit" className={styles.addBtn} disabled={loading}>
            <FaPlus /> {loading ? "Adding..." : "Add Bus"}
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
            </tr>
          </thead>
          <tbody>
  {buses.map((bus, index) => (
    <tr key={bus.id || index}>
      <td>{index + 1}</td>
                <td className={styles.plate}>{bus.numberPlate}</td>
                <td>{bus.capacity}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(bus.status)}`}
                  >
                    {bus.status}
                  </span>
                </td>

      {/* ✅ Actions Column */}
      <td className={styles.actions}>
        <button className={styles.iconBtn}>
          <FaEdit />
        </button>

        <button className={`${styles.iconBtn} ${styles.delete}`}>
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