import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import API from "../../api/api";
import { useToast } from "../ui/Toast";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Spinner from "../ui/Spinner";
import StatusBadge from "../ui/StatusBadge";
import tableStyles from "../ui/DataTable.module.css";
import styles from "./Routes.module.css";

const initialForm = {
  routeName: "", routeCode: "", from: "", to: "",
  distance: "", duration: "", status: "Active", stops: [], stopInput: "",
};

function Routes() {
  const toast = useToast();
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedStops, setSelectedStops] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchRoutes = async () => {
    try {
      setFetching(true);
      const res = await API.get("/routes");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setRoutes(data || []);
    } catch {
      toast.error("Could not fetch routes");
    } finally { setFetching(false); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!form.routeName.trim()) e.routeName = "Required";
    if (!form.routeCode.trim()) e.routeCode = "Required";
    if (!form.from.trim()) e.from = "Required";
    if (!form.to.trim()) e.to = "Required";
    if (form.from.trim().toLowerCase() === form.to.trim().toLowerCase() && form.from)
      e.to = "Destination must differ from origin";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addStop = () => {
    if (!form.stopInput.trim()) return;
    const newStop = { name: form.stopInput.trim(), order: form.stops.length + 1 };
    setForm({ ...form, stops: [...form.stops, newStop], stopInput: "" });
  };

  const removeStop = (index) => {
    const updated = form.stops.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }));
    setForm({ ...form, stops: updated });
  };

  const resetForm = () => { setForm(initialForm); setEditingId(null); setErrors({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      routeName: form.routeName,
      routeCode: form.routeCode,
      from: form.from,
      to: form.to,
      distance: form.distance ? Number(form.distance) : undefined,
      duration: form.duration ? Number(form.duration) : undefined,
      status: form.status,
      stops: form.stops,
    };

    try {
      if (editingId) {
        const res = await API.put(`/routes/${editingId}`, payload);
        const updated = res.data.data || res.data;
        setRoutes(routes.map((r) => (r._id === editingId ? updated : r)));
        toast.success("Route updated");
      } else {
        const res = await API.post("/routes/add", payload);
        const newRoute = res.data.data || res.data;
        setRoutes([...routes, newRoute]);
        toast.success("Route created");
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    setForm({
      routeName: route.routeName,
      routeCode: route.routeCode,
      from: route.from,
      to: route.to,
      distance: route.distance || "",
      duration: route.duration || "",
      status: route.status,
      stops: route.stops || [],
      stopInput: "",
    });
    setEditingId(route._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;
    try {
      await API.delete(`/routes/${id}`);
      setRoutes(routes.filter((r) => r._id !== id));
      toast.success("Route deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <PageHeader title="Routes" subtitle="Define routes and their stops" />

      <div className={styles.grid}>
        <Card title={editingId ? "Edit Route" : "Create Route"}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row2}>
              <Input label="Route Name" name="routeName" value={form.routeName} onChange={handleChange} error={errors.routeName} placeholder="Express A1" />
              <Input label="Route Code" name="routeCode" value={form.routeCode} onChange={handleChange} error={errors.routeCode} placeholder="EXP-A1" />
            </div>
            <div className={styles.row2}>
              <Input label="From" name="from" value={form.from} onChange={handleChange} error={errors.from} placeholder="Origin" />
              <Input label="To" name="to" value={form.to} onChange={handleChange} error={errors.to} placeholder="Destination" />
            </div>
            <div className={styles.row2}>
              <Input label="Distance (km)" name="distance" type="number" value={form.distance} onChange={handleChange} placeholder="120" />
              <Input label="Duration (mins)" name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="180" />
            </div>
            <Select label="Status" name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>Inactive</option>
            </Select>

            <div>
              <label className={styles.label}>Stops</label>
              <div className={styles.stopAdd}>
                <Input
                  name="stopInput"
                  placeholder="Add a stop and press +"
                  value={form.stopInput}
                  onChange={(e) => setForm({ ...form, stopInput: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStop(); } }}
                />
                <Button type="button" variant="secondary" onClick={addStop} icon={<FaPlus />}>Add</Button>
              </div>
              {form.stops.length > 0 && (
                <div className={styles.stopChips}>
                  {form.stops.map((stop, i) => (
                    <span key={i} className={styles.chip}>
                      <span className={styles.chipNum}>{i + 1}</span>
                      {stop.name}
                      <button type="button" onClick={() => removeStop(i)} aria-label="Remove"><FaTimes /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              {editingId && (
                <Button type="button" variant="ghost" icon={<FaTimes />} onClick={resetForm}>Cancel</Button>
              )}
              <Button type="submit" loading={loading} icon={!loading && <FaPlus />}>
                {editingId ? "Update Route" : "Create Route"}
              </Button>
            </div>
          </form>
        </Card>

        <Card title="All Routes" subtitle={`${routes.length} route${routes.length === 1 ? "" : "s"}`} padded={false}>
          {fetching ? (
            <div className={styles.center}><Spinner size={24} color="var(--color-primary)" /></div>
          ) : (
            <div className={tableStyles.tableWrap}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Route</th>
                    <th>Stops</th>
                    <th>Distance</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.length === 0 ? (
                    <tr><td colSpan="7" className={tableStyles.empty}>No routes yet</td></tr>
                  ) : (
                    routes.map((r) => (
                      <tr key={r._id}>
                        <td className={styles.code}>{r.routeCode}</td>
                        <td>{r.routeName}</td>
                        <td className={styles.routeCol}>
                          <span>{r.from}</span>
                          <span className={styles.arrow}>→</span>
                          <span>{r.to}</span>
                        </td>
                        <td>
                          <button className={styles.stopsBtn} onClick={() => setSelectedStops(r.stops || [])}>
                            <FaMapMarkerAlt /> {r.stops?.length || 0}
                          </button>
                        </td>
                        <td className={styles.muted}>
                          {r.distance ? `${r.distance} km` : "—"}
                          {r.duration ? ` · ${r.duration} min` : ""}
                        </td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>
                          <div className={tableStyles.actions}>
                            <button className={tableStyles.iconBtn} onClick={() => handleEdit(r)} aria-label="Edit"><FaEdit /></button>
                            <button className={`${tableStyles.iconBtn} ${tableStyles.danger}`} onClick={() => handleDelete(r._id)} aria-label="Delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {selectedStops !== null && (
        <div className={styles.modalOverlay} onClick={() => setSelectedStops(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Route Stops</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedStops(null)} aria-label="Close"><FaTimes /></button>
            </div>
            <div className={styles.modalContent}>
              {selectedStops.length === 0 ? (
                <p className={styles.muted}>No stops defined</p>
              ) : (
                <ol className={styles.stopList}>
                  {selectedStops.map((s, i) => (
                    <li key={i}>
                      <span className={styles.chipNum}>{i + 1}</span>
                      {s.name}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Routes;
