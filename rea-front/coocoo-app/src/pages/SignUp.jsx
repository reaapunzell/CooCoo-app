import React, { useState, useEffect } from 'react';
import "../styles/SignUp.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    province: '',
    town: ''
  });

  const [provinces, setProvinces] = useState([
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
  ]);
  
  const [towns, setTowns] = useState({
    'Eastern Cape': ['Port Elizabeth', 'East London'],
    'Gauteng': ['Johannesburg', 'Pretoria'],
    'KwaZulu-Natal': ['Durban', 'Pietermaritzburg'],
    // Add other provinces with towns
  });
  
  const [availableTowns, setAvailableTowns] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'province') {
      // When province is selected, update the towns dropdown based on province
      setAvailableTowns(towns[value] || []);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    //  add more validation 
    console.log('Form submitted', formData);
  };

  return (
    <div className="signup-container">
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
              <option key={index} value={province}>{province}</option>
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
            {availableTowns.length > 0 ? (
              availableTowns.map((town, index) => (
                <option key={index} value={town}>{town}</option>
              ))
            ) : (
              <option value="">Please select a province first</option>
            )}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
