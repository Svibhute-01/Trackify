import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/ui/Toast";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import styles from "./auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      const role = res.data.user?.role || res.data.role;
      toast.success("Welcome back!");
      navigate(role === "driver" ? "/driver/dashboard" : "/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <h2 className={styles.title}>Sign in</h2>
          <p className={styles.subtitle}>Welcome back. Please enter your details.</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <Input label="Email" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
            <Input label="Password" name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
            <Button type="submit" loading={loading} fullWidth>Sign in</Button>
          </form>

          <p className={styles.footer}>
            Don't have an account? <Link to="/register" className={styles.link}>Create one</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
