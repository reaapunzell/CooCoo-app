import React, { useState } from "react";
import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  console.log("page loading");
  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState("");

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setResponseMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://coocoo-app.onrender.com/auth/reset-password/",
        {
          otp: formData.otp,
          password: formData.password,
        }
      );
      setResponseMessage("Reset password successful! You can now log in.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Full error response:", error.response);

      if (error.response && error.response.data) {
        const errorData = error.response.data;

        // Extract all error messages and join them into a single string
        const errorMessages = Object.values(errorData)
          .flat() // Flatten arrays to handle multiple errors
          .join(" "); // Join messages with a space

        setResponseMessage(errorMessages);
      } else {
        setResponseMessage("Reset password failed. Please try again.");
      }
    }
  };

  return (
    <div className="reset-pass-container">
      <img src="/CooCoo Main logo.svg" alt="CooCoo Logo" />
      <h2>Reset your password</h2>
      <p>Please enter the OTP sent to your email.</p>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
        {responseMessage && (
          <div className="response-message">{responseMessage}</div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
