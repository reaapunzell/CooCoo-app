import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import "./Settings.css";

const AccountForm = () => {
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    emailVerified: false,
    isActive: false,
    isStaff: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("token");
  const { id } = useParams();

  useEffect(() => {
    console.log("Token:", localStorage.getItem("token"));

    if (!token) return; 
  
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://coocoo-app.onrender.com/auth/profile/`, {
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
          id: data.id || "",
          email: data.email || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          emailVerified: data.email_verified || false,
          isActive: data.is_active || false,
          isStaff: data.is_staff || false,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [token]); 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://coocoo-app.onrender.com/auth/profile/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          email_verified: userData.emailVerified,
          is_active: userData.isActive,
          is_staff: userData.isStaff,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      alert("Account information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  

  return (
    <section className="account-info">
      <h2>Account Information</h2>
      <form>
        <div className="form-row">
          <div className="input-box">
            <label>ID</label>
            <input type="text" name="id" value={userData.id} readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="input-box">
            <label>Email</label>
            <input type="email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
          </div>
        </div>

        <div className="form-row">
          <div className="input-box">
            <label>First Name</label>
            <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="input-box">
            <label>Last Name</label>
            <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} disabled={!isEditing} />
          </div>
        </div>
      </form>

      {isEditing ? (
        <button onClick={handleUpdate}>Save Changes</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
    </section>
  );
};

export default AccountForm;
