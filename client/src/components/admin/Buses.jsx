import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import styles from "./Buses.module.css";

function Buses() {
  const [buses, setBuses] = useState([
    { id: 1, numberPlate: "MH12AB1234", status: "Active" },
    { id: 2, numberPlate: "MH12CD5678", status: "Inactive" },
    { id: 3, numberPlate: "MH14EF9012", status: "On Trip" },
  ]);

  const [numberPlate, setNumberPlate] = useState("");
  const [status, setStatus] = useState("Active");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!numberPlate.trim()) return;

    if (editingId) {
      setBuses(
        buses.map((bus) =>
          bus.id === editingId ? { ...bus, numberPlate, status } : bus
        )
      );
      setEditingId(null);
    } else {
      const newBus = {
        id: Date.now(),
        numberPlate,
        status,
      };
      setBuses([...buses, newBus]);
    }

    setNumberPlate("");
    setStatus("Active");
  };

  const handleEdit = (bus) => {
    setNumberPlate(bus.numberPlate);
    setStatus(bus.status);
    setEditingId(bus.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      setBuses(buses.filter((bus) => bus.id !== id));
    }
  };

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

          <button type="submit" className={styles.addBtn}>
            <FaPlus /> {editingId ? "Update Bus" : "Add Bus"}
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus, index) => (
              <tr key={bus.id}>
                <td>{index + 1}</td>
                <td className={styles.plate}>{bus.numberPlate}</td>
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
                    onClick={() => handleDelete(bus.id)}
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
