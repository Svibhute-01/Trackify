import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Login = () => {
  const navigate = useNavigate();

  // ✅ State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 prevent page reload

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      // ✅ Redirect
      navigate("/admin");

    } catch (err) {
     console.error(err.response?.data);
  alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Trackify 🚍</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {/* ✅ Form */}
        <form style={styles.form} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            style={styles.button}
            disabled={!email || !password}
          >
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} style={styles.link}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

// ✅ Styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center" },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  footer: { marginTop: "15px", textAlign: "center" },
  link: { color: "#007bff", cursor: "pointer" },
};