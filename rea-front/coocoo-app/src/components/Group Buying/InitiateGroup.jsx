import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css"; 
import Navigation from "../Navigation";

const InitiateGroup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [endDate, setEndDate] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://coocoo-app.onrender.com/api/products/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products.");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load products.");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://coocoo-app.onrender.com/api/groups/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          product,
          target_goal: parseInt(targetGoal),
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create group");
      }

      navigate(`/group/${group.id}`);
    } catch (error) {
      console.error("Group creation error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="app-container"> 
    <Navigation/>
    <div className="create-group-container">
      <h2>Create a Group</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Group Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Select Product:</label>
        <select value={product} onChange={(e) => setProduct(e.target.value)} required>
          <option value="">-- Select a Product --</option>
          {products.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.name} - R{prod.price_per_unit}
            </option>
          ))}
        </select>

        <label>Target Goal:</label>
        <input type="number" value={targetGoal} onChange={(e) => setTargetGoal(e.target.value)} required />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <button type="submit">Create Group</button>
      </form>
    </div>
    
    </div>
  );
};

export default InitiateGroup;
