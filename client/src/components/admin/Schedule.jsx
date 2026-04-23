import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaTimes, FaInfoCircle } from "react-icons/fa";
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
import styles from "./Schedule.module.css";

const initialForm = {
  date: "", departureTime: "", arrivalTime: "",
  bus: "", driver: "", route: "", status: "scheduled",
};

const Schedule = () => {
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [available, setAvailable] = useState({ buses: [], drivers: [], routes: [] });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  const fetchSchedules = async () => {
    try {
      setFetching(true);
      const res = await API.get("/schedules");
      setSchedules(res.data.data || []);
    } catch {
      toast.error("Could not fetch schedules");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchSchedules(); }, []);

  useEffect(() => {
    const fetchAvailable = async () => {
      if (!form.date || !form.departureTime || !form.arrivalTime) {
        setAvailable({ buses: [], drivers: [], routes: [] });
        return;
      }
      try {
        setLoadingAvailable(true);
        const params = new URLSearchParams({
          date: form.date,
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
        });
        if (editingId) params.set("excludeId", editingId);
        const res = await API.get(`/schedules/available?${params.toString()}`);
        setAvailable(res.data.data);
      } catch (err) {
        if (err.response?.status !== 400) {
          toast.error("Failed to load availability");
        }
      } finally {
        setLoadingAvailable(false);
      }
    };
    fetchAvailable();
  }, [form.date, form.departureTime, form.arrivalTime, editingId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Required";
    if (!form.departureTime) e.departureTime = "Required";
    if (!form.arrivalTime) e.arrivalTime = "Required";
    if (form.departureTime && form.arrivalTime && form.arrivalTime <= form.departureTime)
      e.arrivalTime = "Must be after departure";
    if (!form.bus) e.bus = "Select a bus";
    if (!form.driver) e.driver = "Select a driver";
    if (!form.route) e.route = "Select a route";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => { setForm(initialForm); setEditingId(null); setErrors({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (editingId) {
        const res = await API.put(`/schedules/${editingId}`, form);
        setSchedules((prev) => prev.map((s) => (s._id === editingId ? res.data.data : s)));
        toast.success("Schedule updated");
      } else {
        const res = await API.post("/schedules", form);
        setSchedules((prev) => [...prev, res.data.data]);
        toast.success("Schedule created");
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setForm({
      date: s.date?.split("T")[0],
      departureTime: new Date(s.departureTime).toTimeString().slice(0, 5),
      arrivalTime: new Date(s.arrivalTime).toTimeString().slice(0, 5),
      bus: s.bus?._id,
      driver: s.driver?._id,
      route: s.route?._id,
      status: s.status,
    });
    setEditingId(s._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await API.delete(`/schedules/${id}`);
      setSchedules((prev) => prev.filter((s) => s._id !== id));
      toast.success("Schedule deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const timeWindowFilled = form.date && form.departureTime && form.arrivalTime;

  return (
    <div>
      <PageHeader title="Schedules" subtitle="Assign buses, drivers and routes to time slots" />

      <Card title={editingId ? "Edit Schedule" : "Create New Schedule"}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row3}>
            <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} error={errors.date} />
            <Input label="Departure" name="departureTime" type="time" value={form.departureTime} onChange={handleChange} error={errors.departureTime} />
            <Input label="Arrival" name="arrivalTime" type="time" value={form.arrivalTime} onChange={handleChange} error={errors.arrivalTime} />
          </div>

          <div className={styles.hint}>
            <FaInfoCircle />
            {timeWindowFilled
              ? loadingAvailable
                ? "Checking availability…"
                : `${available.buses?.length || 0} bus(es) and ${available.drivers?.length || 0} driver(s) available for this slot`
              : "Pick date and time first to see available buses and drivers"}
          </div>

          <div className={styles.row3}>
            <Select label="Bus" name="bus" value={form.bus} onChange={handleChange} error={errors.bus} disabled={!timeWindowFilled}>
              <option value="">Select bus</option>
              {available.buses?.map((b) => (
                <option key={b._id} value={b._id}>{b.numberPlate}</option>
              ))}
            </Select>
            <Select label="Driver" name="driver" value={form.driver} onChange={handleChange} error={errors.driver} disabled={!timeWindowFilled}>
              <option value="">Select driver</option>
              {available.drivers?.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </Select>
            <Select label="Route" name="route" value={form.route} onChange={handleChange} error={errors.route} disabled={!timeWindowFilled}>
              <option value="">Select route</option>
              {available.routes?.map((r) => (
                <option key={r._id} value={r._id}>{r.from} → {r.to}</option>
              ))}
            </Select>
          </div>

          {editingId && (
            <Select label="Status" name="status" value={form.status} onChange={handleChange}>
              <option value="scheduled">Scheduled</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          )}

          <div className={styles.actions}>
            {editingId && (
              <Button type="button" variant="ghost" icon={<FaTimes />} onClick={resetForm}>Cancel</Button>
            )}
            <Button type="submit" loading={loading} icon={!loading && <FaPlus />}>
              {editingId ? "Update Schedule" : "Create Schedule"}
            </Button>
          </div>
        </form>
      </Card>

      <div style={{ height: "var(--space-5)" }} />

      <Card title="All Schedules" subtitle={`${schedules.length} schedule${schedules.length === 1 ? "" : "s"}`} padded={false}>
        {fetching ? (
          <div className={styles.center}><Spinner size={24} color="var(--color-primary)" /></div>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr><td colSpan="7" className={tableStyles.empty}>No schedules yet</td></tr>
                ) : (
                  schedules.map((s) => (
                    <tr key={s._id}>
                      <td className={styles.bus}>{s.bus?.numberPlate || "—"}</td>
                      <td>{s.driver?.name || "—"}</td>
                      <td className={styles.muted}>{s.route?.from} → {s.route?.to}</td>
                      <td>{new Date(s.departureTime).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className={styles.muted}>
                        {new Date(s.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {" – "}
                        {new Date(s.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <div className={tableStyles.actions}>
                          <button className={tableStyles.iconBtn} onClick={() => handleEdit(s)} aria-label="Edit"><FaEdit /></button>
                          <button className={`${tableStyles.iconBtn} ${tableStyles.danger}`} onClick={() => handleDelete(s._id)} aria-label="Delete"><FaTrash /></button>
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
  );
};

export default Schedule;
