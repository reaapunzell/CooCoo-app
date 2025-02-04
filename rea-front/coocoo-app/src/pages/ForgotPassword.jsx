import React, {useState} from "react";
import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const reponse = await axios.post(
        "https://coocoo-app.onrender.com/auth/forgot-password",
        {
          email,
        }
      );
      setResponseMessage("Instructions to reset your password have been sent to your email.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error:", error.response);

      if (error.response && error.response.data) {
        const errorData = error.response.data;

        // Extract all error messages and join them into a single string
        const errorMessages = Object.values(errorData)
          .flat() // Flatten arrays to handle multiple errors
          .join(" "); // Join messages with a space

        setResponseMessage(errorMessages);
      } else {
        setResponseMessage("Password reset failed. Please try again.");
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <img src="/CooCoo Main logo.svg" alt="CooCoo Logo" />
      <h2>Recover your Password</h2>
      <form onSubmit={handleResetPassword}>
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
        <button type="submit">Send Instructions</button>
        {responseMessage && (
          <div className="response-message">{responseMessage}</div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
