import React, { useState } from "react";
import "../dist/register.css"; // Import the enhanced CSS file

function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    contact: "",
    agreeTerms: false,
  });
  const [err, setErr] = useState({
    userName: "",
    email: "",
    password: "",
    contact: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userName) {
      newErrors.userName = "UserName is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.contact) {
      newErrors.contact = "Contact is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits";
    }
    if (!formData.password) {
      newErrors.password = "Password is required for safety";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form data: ", formData);
      setFormData({
        userName: "",
        email: "",
        password: "",
        contact: "", 
      })
    }
  };

  return (
    <div className="register-container">
      <h2>Register to book or host</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="userName">UserName</label>
          <input
            type="text"
            placeholder="Name"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={err.userName ? "error-input" : ""}
          />
          {err.userName && (
            <span className="error-message">{err.userName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={err.email ? "error-input" : ""}
          />
          {err.email && <span className="error-message">{err.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={err.password ? "error-input" : ""}
          />
          {err.password && (
            <span className="error-message">{err.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            placeholder="Contact Number"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className={err.contact ? "error-input" : ""}
          />
          {err.contact && <span className="error-message">{err.contact}</span>}
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
          <label htmlFor="agreeTerms">
            I agree to the terms and conditions
          </label>
        </div>

        <div className="form-group">
          <button type="submit" className="register-button">
            Register
          </button>
        </div>
      </form>
      <div className="register-link">
        Already have an account? <a href="/login">Login here</a>
      </div>
    </div>
  );
}

export default Register;
