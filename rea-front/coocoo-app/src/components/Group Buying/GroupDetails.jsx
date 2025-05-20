import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");
  const [daysLeft, setDaysLeft] = useState(null);
  const token = localStorage.getItem("token");
  const isGuest = localStorage.getItem("isGuest") === "true";
  const navigate = useNavigate();

  // Determine if guest has contributed
  const guestGroup = JSON.parse(localStorage.getItem("guestGroup"));
  const guestContributed = guestGroup && localStorage.getItem(`contributed-${guestGroup.id}`);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (isGuest) {
        if (guestGroup  ) {
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

  // Countdown logic
  useEffect(() => {
    if (group?.expiration_date) {
      const today = new Date();
      const expiration = new Date(group.expiration_date);
      const timeDiff = expiration - today;
      const remaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDaysLeft(remaining > 0 ? remaining : 0);
    }
  }, [group]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!group) {
    return <div>Loading...</div>;
  }

  const product = group.product;

  // Adjust contribution count for guest view
  const contributionCount = isGuest && guestContributed
    ? group.users_joined + 1
    : group.users_joined;

  const handlePayPartBtn = (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  return (
    <div className="app-container">
      <Navigation />
      <main className="group-details-main">
        <div className="group-header">
          <h3>{group.name}'s Group Purchase</h3>
          <p className="contribution-progress">
            <strong>{contributionCount}/{product?.users_needed} Farmers</strong> have contributed
          </p>
        </div>

        <p className="expiry-note">
          {daysLeft !== null && (
            <>
              This group purchase is going to expire in{" "}
              <span className="red-text">{daysLeft} {daysLeft === 1 ? "day" : "days"}</span>
            </>
          )}
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
          {guestContributed ? (
            <>
              <div className="success-message">
                <p className="contributed-message">
                  You have already contributed to {group.name}'s group purchase.
                </p>
              </div>
              <button className="pay-part-btn" disabled>
                You have already contributed
              </button>
            </>
          ) : (
            <button className="pay-part-btn" onClick={handlePayPartBtn}>
              Pay your part
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;
