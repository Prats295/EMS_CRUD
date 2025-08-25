import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register user in users table
      await axios.post("http://localhost:5000/register", {
        email: formData.email,
        password: formData.password,
      });

      // 2️⃣ Add the same user to employees table
      await axios.post("http://localhost:5000/employees", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        department: formData.department,
      });

      alert("Registration successful!");
      // Redirect to EmployeeList page
      navigate("/EmployeeList");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ marginTop: "10px" }}>Register</button>
      </form>
    </div>
  );
}

export default Register;
