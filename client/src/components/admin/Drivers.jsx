import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Drivers.module.css";
import API from "../../api/api";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    license: "",
    contact: "",
    email: "",
    password: "",
    status: "Available",
  });

  // 🔥 FETCH DRIVERS
  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setDrivers(data || []);
    } catch (err) {
      console.error(err);
      alert("Could not fetch drivers");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 ADD / UPDATE DRIVER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.license || !formData.contact || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await API.put(`/drivers/${editingId}`, {
          ...formData,
          password: formData.password || undefined,
        });
        alert("Driver updated successfully!");
      } else {
        if (!formData.password) {
          alert("Password is required");
          setLoading(false);
          return;
        }

        await API.post("/drivers/add", formData);
        alert("Driver added successfully!");
      }

      setFormData({
        name: "",
        license: "",
        contact: "",
        email: "",
        password: "",
        status: "Available",
      });

      setEditingId(null);
      fetchDrivers();

    } catch (err) {
      console.error(err.response?.data);
      alert(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EDIT
  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      license: driver.license,
      contact: driver.contact,
      email: driver.email || "",
      password: "",
      status: driver.status,
    });
    setEditingId(driver._id);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;

    try {
      await API.delete(`/drivers/${id}`);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
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

      {/* FORM */}
      <div className={styles.card}>
        <h3>{editingId ? "Edit Driver" : "Add New Driver"}</h3>

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

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {!editingId && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
          </select>

          <button type="submit" className={styles.addBtn} disabled={loading}>
            <FaPlus />
            {loading
              ? editingId
                ? " Updating..."
                : " Adding..."
              : editingId
              ? " Update"
              : " Add"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className={styles.card}>
        <h3>Drivers List</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>License</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="7">No drivers found</td>
              </tr>
            ) : (
              drivers.map((driver, index) => (
                <tr key={driver._id}>
                  <td>{index + 1}</td>
                  <td>{driver.name}</td>
                  <td>{driver.license}</td>
                  <td>{driver.contact}</td>
                  <td>{driver.email}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(driver.status)}`}>
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
                      onClick={() => handleDelete(driver._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Drivers;