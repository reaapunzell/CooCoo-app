import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://coocoo-app.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      setToken(data.token); // Corrected token handling
      localStorage.setItem("token", data.token);

      setResponseMessage("Login successful");
      navigate(`/groupbuying`);
    } catch (error) {
      console.error("login error", error);
      setError(error.message);
     
    }
  };

  // Navigate to signup page
  const signUpNav = () => {
    navigate("/signup");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <img src="/CooCoo Main logo.svg" alt="CooCoo Logo" />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email" // Added name attribute
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password" // Added name attribute
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>

      <div className="signup-footer">
        <span> Don't have an account? </span>
        <button className="signup-btn" type="button" onClick={signUpNav}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
