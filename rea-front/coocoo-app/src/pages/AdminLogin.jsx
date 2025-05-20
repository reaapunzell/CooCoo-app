import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const AdminLogin = () => {
 const [errorMessage, setErrorMessage] = useState("");
  const [showResendOTP, setShowResendOTP] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  
  

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Request payload:", {
      email: formData.email,
      password: formData.password,
    });

    try {

      const response = await fetch("https://coocoo-app.onrender.com/auth/admin-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email : formData.email, password: formData.password }),
      });


      if (!response.ok) {
        throw new Error("Invalid credentials or unauthorized access");
      }

   

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Full error response:", err);

  if (err.message.includes("Email not verified")) {
    setErrorMessage("Email not verified. Please verify your email.");
    setShowResendOTP(true);
  } else {
    setErrorMessage(err.message);
  }
      
    }
  };

  
  const signUpNav = () => {
    navigate("/admin/signup");
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (


      <div className="login-container">
            <img src="/CooCoo Main logo.svg" alt="CooCoo Logo" />
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
  
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
  
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
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

export default AdminLogin;
