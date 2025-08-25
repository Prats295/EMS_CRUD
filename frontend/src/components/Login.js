import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    try {
      const res = await axios.post("http://localhost:5000/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Check backend response
      if (res.data?.message === "Login successful") {
        navigate("/EmployeeList"); // Redirect after successful login
      } else {
        setError(res.data?.error || "Invalid email or password");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ marginTop: "10px" }}>Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
