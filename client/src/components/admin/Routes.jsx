import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import styles from "./Routes.module.css";
import API from "../../api/api";

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedStops, setSelectedStops] = useState(null);

  const [formData, setFormData] = useState({
    routeName: "",
    routeCode: "",
    from: "",
    to: "",
    distance: "",
    duration: "",
    status: "Active",
    stops: [],
    stopInput: "",
  });

  // 🔥 FETCH ROUTES
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await API.get("/routes");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setRoutes(data || []);
    } catch (err) {
      console.error(err);
      setRoutes([]);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ADD STOP
  const addStop = () => {
    if (!formData.stopInput.trim()) return;

    const newStop = {
      name: formData.stopInput,
      order: formData.stops.length + 1,
    };

    setFormData({
      ...formData,
      stops: [...formData.stops, newStop],
      stopInput: "",
    });
  };

  // REMOVE STOP
  const removeStop = (index) => {
    const updatedStops = formData.stops
      .filter((_, i) => i !== index)
      .map((stop, i) => ({ ...stop, order: i + 1 }));

    setFormData({ ...formData, stops: updatedStops });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanData = {
      routeName: formData.routeName,
      routeCode: formData.routeCode,
      from: formData.from,
      to: formData.to,
      distance: Number(formData.distance),
      duration: Number(formData.duration),
      status: formData.status,
      stops: formData.stops,
    };

    try {
      if (editingId) {
        const res = await API.put(`/routes/${editingId}`, cleanData);
        const updated = res.data.data || res.data;

        setRoutes(routes.map((r) => (r._id === editingId ? updated : r)));

        setEditingId(null);
      } else {
        const res = await API.post("/routes/add", cleanData);
        const newRoute = res.data.data || res.data;

        setRoutes([...routes, newRoute]);
      }

      // RESET
      setFormData({
        routeName: "",
        routeCode: "",
        from: "",
        to: "",
        distance: "",
        duration: "",
        status: "Active",
        stops: [],
        stopInput: "",
      });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // EDIT
  const handleEdit = (route) => {
    setFormData({
      routeName: route.routeName,
      routeCode: route.routeCode,
      from: route.from,
      to: route.to,
      distance: route.distance,
      duration: route.duration,
      status: route.status,
      stops: route.stops || [],
      stopInput: "",
    });

    setEditingId(route._id);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;

    try {
      await API.delete(`/routes/${id}`);
      setRoutes(routes.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
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
            name="routeName"
            placeholder="Route Name"
            value={formData.routeName}
            onChange={handleChange}
            required
          />
          <input
            name="routeCode"
            placeholder="Route Code"
            value={formData.routeCode}
            onChange={handleChange}
            required
          />
          <input
            name="from"
            placeholder="From"
            value={formData.from}
            onChange={handleChange}
            required
          />
          <input
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

          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* STOPS */}
          <div className={styles.stopSection}>
            <input
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

          <div className={styles.stopsList}>
            {formData.stops.map((stop, i) => (
              <div key={i} className={styles.stopItem}>
                {stop.name}
                <FaTrash onClick={() => removeStop(i)} />
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              {editingId ? "Update Route" : "Create Route"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLE UI */}
      <div className={styles.card}>
        <h3>All Routes</h3>

        {routes.length === 0 ? (
          <p className={styles.empty}>No routes found</p>
        ) : (
          <div className={styles.routeTable}>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Code</span>
              <span>Route</span>
              <span>Stops</span>
              <span>Distance</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {routes.map((route) => (
              <div key={route._id} className={styles.tableRow}>
                <span>{route.routeName}</span>
                <span>{route.routeCode}</span>
                <span>
                  {route.from} → {route.to}
                </span>

                {/* STOP BADGE */}
                <span
                  className={styles.stopBadge}
                  onClick={() => setSelectedStops(route.stops)}
                >
                  {route.stops?.length || 0}
                </span>

                <span>
                  {route.distance} km | {route.duration} min
                </span>

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
                  <FaEdit onClick={() => handleEdit(route)} />
                  <FaTrash onClick={() => handleDelete(route._id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedStops && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedStops(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className={styles.modalHeader}>
              <h3>Route Stops</h3>
              <span
                className={styles.closeBtn}
                onClick={() => setSelectedStops(null)}
              >
                ✕
              </span>
            </div>

            {/* CONTENT */}
            <div className={styles.modalContent}>
              {selectedStops.length === 0 ? (
                <p className={styles.empty}>No stops available</p>
              ) : (
                <ul className={styles.stopList}>
                  {selectedStops.map((stop, i) => (
                    <li key={i} className={styles.stopRow}>
                      <span className={styles.stopIndex}>{i + 1}</span>
                      <span className={styles.stopName}>{stop.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Routes;
