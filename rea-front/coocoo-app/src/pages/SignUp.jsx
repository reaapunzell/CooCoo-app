import React, { useState } from "react";
import "../styles/SignUp.css";
import provinces from "../components/data/Provinces.jsx";
import townsData from "../components/data/Towns.jsx";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    province: "",
    town: "",
  });

  const [filteredTowns, setFilteredTowns] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update towns when province changes
    if (name === "province") {
      setFilteredTowns(townsData[value] || []);
      setFormData({ ...formData, province: value, town: "" }); // Reset town when province changes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/signup/", {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.surname,
        password: formData.password,
      });
      setResponseMessage(
        "Signup successful. Please check your email to verify your account."
      );
      setIsVerificationSent(true);
    } catch (error) {
      setResponseMessage("Signup failed: " + error.response.data.detail);
    }
  };

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

        {/* Province */}
        <div className="form-group">
          <label htmlFor="province">Province</label>
          <select
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option value="">Select Province</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Town */}
        <div className="form-group">
          <label htmlFor="town">Town/Area</label>
          <select
            id="town"
            name="town"
            value={formData.town}
            onChange={handleChange}
            required
          >
            <option value="">Select Town/Area</option>
            {filteredTowns.map((town, index) => (
              <option key={index} value={town}>
                {town}
              </option>
            ))}
          </select>
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
