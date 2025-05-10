import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const isGuest = localStorage.getItem("isGuest") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (isGuest) {
        // Retrieve guest group from localStorage
        const guestGroup = JSON.parse(localStorage.getItem("guestGroup"));
        if (guestGroup && guestGroup.id === id) {
          setGroup(guestGroup);
        } else {
          setError("Guest group not found.");
        }
        return;
      }

      try {
        const response = await fetch(`https://coocoo-app.onrender.com/api/groups/${id}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch group details.");
        }

        const data = await response.json();
        setGroup(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load group details.");
      }
    };

    fetchGroupDetails();
  }, [id, token, isGuest]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!group) {
    return <div>Loading...</div>;
  }

  const product = group.product;

  const handlePayPartBtn = (e) => {
    e.preventDefault();
    navigate('/payment');
  }

  return (
    <div className="app-container">
      <Navigation />
      <main className="group-details-main">
        <div className="group-header">
          <h3>{group.name}'s Group Purchase</h3>
          <p className="contribution-progress">
            <strong>{group.users_joined}/{product?.users_needed} Farmers</strong> have contributed
          </p>
          
        </div>
<p className="expiry-note">
            This group purchase is going to expire in <span className="red-text">5 days</span>
          </p>
        <div className="product-card">
          <div className="product-image-placeholder">📦</div>
          <div className="product-details">
            <p><strong>{product?.brand}</strong></p>
            <p>{product?.name}</p>
            <p><strong>R{product?.price_per_user}</strong> as group purchase</p>
          </div>
        </div>
<div className="pay-part">
        <button className="pay-part-btn" onClick={handlePayPartBtn} >Pay your part</button>
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;
