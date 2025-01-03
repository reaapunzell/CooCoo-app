import React, {useEffect, useState} from "react";
import "./Settings.css"

const AccountForm = () => {

  const [userData, setUserData] = useState({
    username:"",
  firstName: "",
      surname: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    province: "",
    streetAddress: "",
    postalCode: "",
  })
  
  //fetch user data from  backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Assuming the token is stored in localStorage
        const response = await fetch(`http://localhost:8000/dashboard/${username}`,
         {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData({
          username: data.username || "",
          firstName: data.firstName || "",
          surname: data.surname || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth || "",
          province: data.province || "",
          streetAddress: data.streetAddress || "",
          postalCode: data.postalCode || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <section className="account-info">
      <h2>Account Information</h2>
      <div className="form-container">
      </div>
      <form>
        
      <div className="form-row">
            <div className="input-box">
          <label>Username</label>
          <input type="text"
          name="username"
          value={userData.username}
          onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
            <div className="input-box">
          <label>First Name</label>
          <input type="text" 
          name="firstName"
          value={userData.firstName}
          onChange={handleChange}/>
          </div>

<div className="input-box">
          <label>Surname</label>
          <input type="text"
          name="surname"
          value={userData.surname}
          onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
            <div className="input-box">
          <label>Email</label>
          <input type="email" 
            name="email"
            value={userData.email}
            onChange={handleChange}/>
          </div>

        <div className="input-box">
          <label>Phone Number</label>
          <input type="text"
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
            <div className="input-box">
          <label>Date of birth</label>
          <input type="date" 
          name="dateOfBirth"
          value={userData.dateOfBirth}
          onChange={handleChange}/>
          </div>
        </div>

        <div className="address-information" >
          <h2>Address Information</h2>
        </div>

        <div className="form-row">
            <div className="input-box">
          <label>Province</label>
          <input type="text"
           name="province"
           value={userData.province}
           onChange={handleChange} />
          </div>

          <div className="input-box">
          <label>Town</label>
          <input type="text"
           name="town"
           value={userData.town}
           onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="input-box">
          <label>Street Address</label>
          <input type="text" 
           name="street address"
           value={userData.streetAddress}
           onChange={handleChange}/>
          </div>

          <div className="input-box">
          <label>Postal Code</label>
          <input type="text" 
          name="postal code"
          value={userData.postalCode}
          onChange={handleChange}/>
          </div>
        </div>
      </form>

      <button> Update Account Information</button>
    </section>
  );
};

export default AccountForm;
