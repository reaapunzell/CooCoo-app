import React, { useState } from "react";
import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [responseMessage, setResponseMessage] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);


  // Handle input change
  const handleChange = (e) => {
  const {name, value} = e.target;
  setFormData({...formData, [name]: value});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setResponseMessage("Passwords do not match.");
      return;
    }
    console.log("Request payload:", {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.surname,
      password: formData.password,
    });



    try {
      const response = await axios.post("https://coocoo-app.onrender.com/auth/signup/", { 
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      });


      //Send OTP to email
      await axios.post("https://coocoo-app.onrender.com/auth/resend-otp/", {
        email: formData.email,
        otp,
      });

        // Navigate to OTP verification page
        navigate("/verify-email", { state: { email: formData.email } });


      setResponseMessage(
        "Signup successful. Please check your email to verify your account."
      );
      setIsVerificationSent(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }  catch (error) {
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


  //Handle OTP verification
  const handleVerifyOtp = async (e) => { 
    try{
      const response = await axios.post("'https://coocoo-app.onrender.com/auth/resend-otp/", {
        email: formData.email,
        otp,
      })
      setResponseMessage("response.data.message");
      setIsVerified(true);
    } catch (error){
      console.error("Full error response:", error.response);
      
      setResponseMessage("Verification failed: " + (error.response.body));
    }
  };

  //navigate to login page
  const loginNav = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <img src="/CooCoo Main logo.svg" alt="CooCoo Logo" />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Surname */}
        <div className="form-group">
          <label htmlFor="surname">Surname</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
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

        {/* Submit Button */}
        <button type="submit">Sign Up</button>

        {/* Response Message */}
        {responseMessage && (
          <div
            className={`response-message ${
              responseMessage.includes("failed") ? "error" : "success"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </form>
      <div className="signup-footer">
        <span>Already have an account?</span>
        <button className="signup-btn" type="button" onClick={loginNav}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default Signup;
