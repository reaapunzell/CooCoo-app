import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors



    try {
      const response = await axios.post("/api/login/", { email, password });
      if (response.status === 200) {
        // Redirect or perform further actions on successful login
        alert("Login successful!");
        window.location.href = "/dashboard"; // Change '/dashboard' to your target route
      }
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

      //navigate to signup page
      const signUpNav = () => {
        e.preventDefault();
        navigate("/signup")
      };
      
  return (
    <div className="login-container">
        <img src="/CooCoo Main logo.svg"/>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <div className="signup-footer">
        <span> Don't have an account? </span>
        <button className="signup-btn" type='button' onClick={signUpNav} > Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
