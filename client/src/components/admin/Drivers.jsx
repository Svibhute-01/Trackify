import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
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
import styles from "./Drivers.module.css";

const initialForm = {
  name: "", license: "", contact: "", email: "", password: "", status: "Available",
};

function Drivers() {
  const toast = useToast();
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDrivers = async () => {
    try {
      setFetching(true);
      const res = await API.get("/drivers");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setDrivers(data || []);
    } catch {
      toast.error("Could not fetch drivers");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const resetForm = () => { setForm(initialForm); setEditingId(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.license.trim()) e.license = "License is required";
    if (!form.contact.trim()) e.contact = "Contact is required";
    else if (!/^\d{10,15}$/.test(form.contact.replace(/\D/g, "")))
      e.contact = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!editingId && !form.password) e.password = "Password is required";
    else if (form.password && form.password.length < 6)
      e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/drivers/${editingId}`, {
          ...form,
          password: form.password || undefined,
        });
        toast.success("Driver updated");
      } else {
        await API.post("/drivers/add", form);
        toast.success("Driver added");
      }
      resetForm();
      fetchDrivers();
    } catch (err) {
      toast.error(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (driver) => {
    setForm({
      name: driver.name,
      license: driver.license,
      contact: driver.contact,
      email: driver.email || "",
      password: "",
      status: driver.status,
    });
    setEditingId(driver._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await API.delete(`/drivers/${id}`);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
      toast.success("Driver deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <PageHeader title="Drivers" subtitle="Manage your driver roster" />

      <div className={styles.grid}>
        <Card title={editingId ? "Edit Driver" : "Add New Driver"}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Full name" />
            <Input label="License Number" name="license" value={form.license} onChange={handleChange} error={errors.license} placeholder="e.g. DL12345" />
            <Input label="Contact" name="contact" value={form.contact} onChange={handleChange} error={errors.contact} placeholder="10-digit number" />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="driver@example.com" />
            <Input
              label={editingId ? "New Password (optional)" : "Password"}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••"
              hint={editingId ? "Leave blank to keep current password" : undefined}
            />
            <Select label="Status" name="status" value={form.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
            </Select>
            <div className={styles.actions}>
              {editingId && (
                <Button type="button" variant="ghost" icon={<FaTimes />} onClick={resetForm}>Cancel</Button>
              )}
              <Button type="submit" loading={loading} icon={!loading && <FaPlus />}>
                {editingId ? "Update Driver" : "Add Driver"}
              </Button>
            </div>
          </form>
        </Card>

        <Card title="All Drivers" subtitle={`${drivers.length} driver${drivers.length === 1 ? "" : "s"}`} padded={false}>
          {fetching ? (
            <div className={styles.center}><Spinner size={24} color="var(--color-primary)" /></div>
          ) : (
            <div className={tableStyles.tableWrap}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>License</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length === 0 ? (
                    <tr><td colSpan="7" className={tableStyles.empty}>No drivers yet</td></tr>
                  ) : (
                    drivers.map((d, i) => (
                      <tr key={d._id}>
                        <td>{i + 1}</td>
                        <td>{d.name}</td>
                        <td>{d.license}</td>
                        <td>{d.contact}</td>
                        <td>{d.email}</td>
                        <td><StatusBadge status={d.status} /></td>
                        <td>
                          <div className={tableStyles.actions}>
                            <button className={tableStyles.iconBtn} onClick={() => handleEdit(d)} aria-label="Edit"><FaEdit /></button>
                            <button className={`${tableStyles.iconBtn} ${tableStyles.danger}`} onClick={() => handleDelete(d._id)} aria-label="Delete"><FaTrash /></button>
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

export default Drivers;
