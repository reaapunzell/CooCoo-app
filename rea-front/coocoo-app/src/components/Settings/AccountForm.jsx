import React, { useEffect, useState } from "react";
import "./Settings.css";

const AccountForm = () => {
  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    surname: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    province: "",
    streetAddress: "",
    postalCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`http://localhost:8000/dashboard`, {
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
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateForm = () => {
    if (!userData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!userData.firstName || !userData.surname) {
      alert("First name and surname are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:8000/dashboard`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const data = await response.json();
      console.log("User data updated successfully:", data);
      alert("Account information updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update account information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="account-info">
      <h2>Account Information</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-box">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Surname</label>
              <input
                type="text"
                name="surname"
                value={userData.surname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={userData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="address-information">
            <h2>Address Information</h2>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>Province</label>
              <input
                type="text"
                name="province"
                value={userData.province}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Town</label>
              <input
                type="text"
                name="town"
                value={userData.town}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>Street Address</label>
              <input
                type="text"
                name="streetAddress"
                value={userData.streetAddress}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={userData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            Update Account Information
          </button>
        </form>
      )}
    </section>
  );
};

export default AccountForm;