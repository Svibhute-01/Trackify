import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Drivers.module.css";

function Drivers() {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Rajesh Patil",
      license: "MH-DL-45678",
      contact: "9876543210",
      status: "Available",
    },
    {
      id: 2,
      name: "Amit Sharma",
      license: "MH-DL-78901",
      contact: "9123456780",
      status: "On Trip",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    license: "",
    contact: "",
    status: "Available",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setDrivers(
        drivers.map((driver) =>
          driver.id === editingId ? { ...driver, ...formData } : driver
        )
      );
      setEditingId(null);
    } else {
      setDrivers([...drivers, { id: Date.now(), ...formData }]);
    }

    setFormData({
      name: "",
      license: "",
      contact: "",
      status: "Available",
    });
  };

  const handleEdit = (driver) => {
    setFormData(driver);
    setEditingId(driver.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this driver?")) {
      setDrivers(drivers.filter((driver) => driver.id !== id));
    }
  };

  const getStatusClass = (status) => {
    if (status === "Available") return styles.available;
    if (status === "On Trip") return styles.onTrip;
    if (status === "Off Duty") return styles.offDuty;
    return "";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Driver Management</h2>

      {/* ADD DRIVER CARD */}
      <div className={styles.card}>
        <h3>Add New Driver</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Driver Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="license"
            placeholder="License Number"
            value={formData.license}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
          </select>

          <button type="submit" className={styles.addBtn}>
            <FaPlus /> {editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* DRIVER TABLE */}
      <div className={styles.card}>
        <h3>Drivers List</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>License</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver, index) => (
              <tr key={driver.id}>
                <td>{index + 1}</td>
                <td>{driver.name}</td>
                <td>{driver.license}</td>
                <td>{driver.contact}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      driver.status
                    )}`}
                  >
                    {driver.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => handleEdit(driver)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className={`${styles.iconBtn} ${styles.delete}`}
                    onClick={() => handleDelete(driver.id)}
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

export default Drivers;
