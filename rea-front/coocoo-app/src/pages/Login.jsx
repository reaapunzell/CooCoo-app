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
  const [showResendOTP, setShowResendOTP] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://coocoo-app.onrender.com/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
  
      setToken(data.token);
      localStorage.setItem("token", data.token);
  
      setResponseMessage("Login successful");
      navigate(`/groupbuying`);
    } catch (error) {
      console.error("Error response:", error.message);
  
      if (error.message.includes("Email not verified")) {
        setErrorMessage("Email not verified. Please verify your email.");
        setShowResendOTP(true);
      } else {
        setErrorMessage(error.message);
      }
    }
  };
  

  //Resend otp to email
  const handleResendOTP = async () => {
    try {
      const response = await fetch(
        "https://coocoo-app.onrender.com/auth/resend-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend OTP. Please try again.");
      }

      setResponseMessage("OTP has been resent to your email.");
      setShowResendOTP(false); // Hide the button after resending

      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      setErrorMessage(error.message);
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {showResendOTP && (
          <button
            className="resend-otp-btn"
            type="button"
            onClick={handleResendOTP}
          >
            Resend OTP Verification
          </button>
        )}

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

<div className="forgot-password">
        <a href="/forgot-password">Forgot your Password?</a>
</div>

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
