import React, { useState } from "react";
import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://coocoo-app.onrender.com/auth/verify-email/", {
        email,
        otp,
      });
      setResponseMessage("Verification successful! You can now log in.");
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
          setResponseMessage("Signup failed. Please try again.");
        }
    }
  };

  return (
    <div className="verify-otp-container">
      <img src="/CooCoo Main logo.svg" alt="CooCoo Logo" />
      <h2>Verification Sent</h2>
      <p>Please enter the OTP sent to your email.</p>
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Verify</button>
        {responseMessage && <div className="response-message">{responseMessage}</div>}
      </form>
    </div>
  );
};

export default VerifyOTP;