import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/ui/Toast";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import styles from "./auth.module.css";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ username: "", email: "", password: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.mobile && !/^\d{10,15}$/.test(form.mobile.replace(/\D/g, "")))
      e.mobile = "Invalid number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created. Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardWrap}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🚍</span>
          <span className={styles.brandName}>Trackify</span>
        </div>
        <Card>
          <h2 className={styles.title}>Create account</h2>
          <p className={styles.subtitle}>Join Trackify to manage and track your fleet.</p>

          <form onSubmit={handleRegister} className={styles.form}>
            <Input label="Full name" name="username" placeholder="Jane Doe"
              value={form.username} onChange={handleChange} error={errors.username} />
            <Input label="Email" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Mobile (optional)" name="mobile" placeholder="10-digit number"
              value={form.mobile} onChange={handleChange} error={errors.mobile} />
            <Input label="Password" name="password" type="password" placeholder="At least 6 characters"
              value={form.password} onChange={handleChange} error={errors.password} />
            <Button type="submit" loading={loading} fullWidth>Create account</Button>
          </form>

          <p className={styles.footer}>
            Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
