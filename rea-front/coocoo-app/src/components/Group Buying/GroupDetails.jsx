import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Onboarding.css";

const GroupDetails = () => {
  const { id } = useParams(); // Get the group ID from the URL
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch the group details from the API
    const fetchGroupDetails = async () => {
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
  }, [id, token]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group-details-container">
      <h2>Group Details</h2>
      <p><strong>Group Name:</strong> {group.name}</p>
      <p><strong>Product:</strong> {group.product.name} - R{group.product.price_per_unit}</p>
      <p><strong>Target Goal:</strong> R{group.target_goal}</p>
      <p><strong>End Date:</strong> {group.end_date}</p>
    </div>
  );
};

export default GroupDetails;
