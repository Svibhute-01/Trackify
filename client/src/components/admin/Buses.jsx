import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
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
import styles from "./Buses.module.css";

const initialForm = { numberPlate: "", capacity: "", status: "Active" };

function Buses() {
  const toast = useToast();
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchBuses = async () => {
    try {
      setFetching(true);
      const res = await API.get("/buses");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setBuses(data || []);
    } catch (err) {
      toast.error("Could not fetch buses");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchBuses(); }, []);

  const validate = () => {
    const e = {};
    if (!form.numberPlate.trim()) e.numberPlate = "Number plate is required";
    else if (form.numberPlate.trim().length < 4) e.numberPlate = "Looks too short";
    if (!form.capacity) e.capacity = "Capacity is required";
    else if (Number(form.capacity) <= 0) e.capacity = "Must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const resetForm = () => { setForm(initialForm); setErrors({}); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      numberPlate: form.numberPlate.toUpperCase().trim(),
      capacity: Number(form.capacity),
      status: form.status,
    };

    try {
      if (editingId) {
        await API.put(`/buses/${editingId}`, payload);
        toast.success("Bus updated");
      } else {
        await API.post("/buses/add", payload);
        toast.success("Bus added");
      }
      resetForm();
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setForm({ numberPlate: bus.numberPlate, capacity: bus.capacity, status: bus.status });
    setEditingId(bus._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bus?")) return;
    try {
      await API.delete(`/buses/${id}`);
      setBuses(buses.filter((b) => b._id !== id));
      toast.success("Bus deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <PageHeader title="Buses" subtitle="Manage your fleet of buses" />

      <div className={styles.grid}>
        <Card title={editingId ? "Edit Bus" : "Add New Bus"}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Number Plate"
              name="numberPlate"
              placeholder="e.g. MH12AB1234"
              value={form.numberPlate}
              onChange={handleChange}
              error={errors.numberPlate}
            />
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              placeholder="e.g. 60"
              value={form.capacity}
              onChange={handleChange}
              error={errors.capacity}
            />
            <Select label="Status" name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Trip">On Trip</option>
            </Select>
            <div className={styles.actions}>
              {editingId && (
                <Button type="button" variant="ghost" icon={<FaTimes />} onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button type="submit" loading={loading} icon={!loading && <FaPlus />}>
                {editingId ? "Update Bus" : "Add Bus"}
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Fleet" subtitle={`${buses.length} bus${buses.length === 1 ? "" : "es"}`} padded={false}>
          {fetching ? (
            <div className={styles.center}><Spinner size={24} color="var(--color-primary)" /></div>
          ) : (
            <div className={tableStyles.tableWrap}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Number Plate</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.length === 0 ? (
                    <tr><td colSpan="5" className={tableStyles.empty}>No buses yet</td></tr>
                  ) : (
                    buses.map((bus, index) => (
                      <tr key={bus._id}>
                        <td>{index + 1}</td>
                        <td className={styles.plate}>{bus.numberPlate}</td>
                        <td>{bus.capacity}</td>
                        <td><StatusBadge status={bus.status} /></td>
                        <td>
                          <div className={tableStyles.actions}>
                            <button className={tableStyles.iconBtn} onClick={() => handleEdit(bus)} aria-label="Edit"><FaEdit /></button>
                            <button className={`${tableStyles.iconBtn} ${tableStyles.danger}`} onClick={() => handleDelete(bus._id)} aria-label="Delete"><FaTrash /></button>
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
    </div>
  );
}

export default Buses;
