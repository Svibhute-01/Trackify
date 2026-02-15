import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import styles from "./Routes.module.css";

function Routes() {
  const [routes, setRoutes] = useState([]);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    duration: "",
    status: "Active",
    stops: [],
    stopInput: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add stop
  const addStop = () => {
    if (formData.stopInput.trim() === "") return;

    setFormData({
      ...formData,
      stops: [...formData.stops, formData.stopInput],
      stopInput: "",
    });
  };

  // Remove stop
  const removeStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: updatedStops });
  };

  // Submit route
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setRoutes(
        routes.map((route) =>
          route.id === editingId
            ? { ...route, ...formData, stopInput: "" }
            : route
        )
      );
      setEditingId(null);
    } else {
      setRoutes([
        ...routes,
        { id: Date.now(), ...formData, stopInput: "" },
      ]);
    }

    // Reset form
    setFormData({
      from: "",
      to: "",
      distance: "",
      duration: "",
      status: "Active",
      stops: [],
      stopInput: "",
    });
  };

  // Edit route
  const handleEdit = (route) => {
    setFormData({
      from: route.from,
      to: route.to,
      distance: route.distance,
      duration: route.duration,
      status: route.status,
      stops: route.stops || [],
      stopInput: "",
    });

    setEditingId(route.id);
  };

  // Delete route
  const handleDelete = (id) => {
    if (window.confirm("Delete this route?")) {
      setRoutes(routes.filter((route) => route.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Routes Management</h2>

      {/* FORM */}
      <div className={styles.card}>
        <h3>{editingId ? "Edit Route" : "Create Route"}</h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="from"
            placeholder="From"
            value={formData.from}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="to"
            placeholder="To"
            value={formData.to}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="distance"
            placeholder="Distance (km)"
            value={formData.distance}
            onChange={handleChange}
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (mins)"
            value={formData.duration}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Stop Input */}
          <div className={styles.stopSection}>
            <input
              type="text"
              placeholder="Add Stop"
              value={formData.stopInput}
              onChange={(e) =>
                setFormData({ ...formData, stopInput: e.target.value })
              }
            />
            <button type="button" onClick={addStop}>
              <FaPlus />
            </button>
          </div>

          {/* Stop Preview */}
          <div className={styles.stopsList}>
            {formData.stops.map((stop, index) => (
              <div key={index} className={styles.stopItem}>
                {stop}
                <FaTrash
                  className={styles.stopDelete}
                  onClick={() => removeStop(index)}
                />
              </div>
            ))}
          </div>

          <button type="submit" className={styles.submitBtn}>
            {editingId ? "Update Route" : "Create Route"}
          </button>
        </form>
      </div>

      {/* TIMELINE VIEW */}
      <div className={styles.card}>
        <h3>All Routes</h3>

        {routes.length === 0 ? (
          <p className={styles.empty}>No routes created yet</p>
        ) : (
          routes.map((route) => (
            <div key={route.id} className={styles.routeCard}>
              {/* Timeline */}
              <div className={styles.timelineWrapper}>
                <div className={styles.timelineLine}></div>

                {/* From */}
                <div className={styles.timelineItem}>
                  <div className={`${styles.dot} ${styles.startDot}`}></div>
                  <span className={styles.locationLabel}>
                    {route.from}
                  </span>
                </div>

                {/* Stops */}
                {route.stops.map((stop, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.dot}></div>
                    <span className={styles.stopLabel}>{stop}</span>
                  </div>
                ))}

                {/* To */}
                <div className={styles.timelineItem}>
                  <div className={`${styles.dot} ${styles.endDot}`}></div>
                  <span className={styles.locationLabel}>
                    {route.to}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className={styles.routeInfo}>
                <div>
                  📏 {route.distance || 0} km | ⏱ {route.duration || 0} mins
                </div>

                <span
                  className={
                    route.status === "Active"
                      ? styles.activeStatus
                      : styles.inactiveStatus
                  }
                >
                  {route.status}
                </span>

                <div className={styles.actions}>
                  <FaEdit
                    className={styles.icon}
                    onClick={() => handleEdit(route)}
                  />
                  <FaTrash
                    className={styles.icon}
                    onClick={() => handleDelete(route.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Routes;
