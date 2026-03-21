import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Trackify 🚍</h2>
        <p style={styles.subtitle}>Create your account</p>

        <form style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
          />

          <select style={styles.input}>
            <option>Driver</option>
          
          </select>

          <button type="button" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

// same styles as login
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  title: { textAlign: "center" },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px"
  },
  footer: { marginTop: "15px", textAlign: "center" },
  link: { color: "#007bff", cursor: "pointer" }
};