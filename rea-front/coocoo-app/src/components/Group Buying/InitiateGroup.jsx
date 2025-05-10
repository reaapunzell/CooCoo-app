import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css"; 
import Navigation from "../Navigation";

const InitiateGroup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const isGuest = localStorage.getItem("isGuest") === "true";

  useEffect(() => {
    if (isGuest) {
      // Fake products for guest mode
      setProducts([
        {
          id: "1",
          brand: "AgriFeeds",
          total_price: 1000,
          price_per_user: 100,
          users_needed: 10,
          end_date: "2025-06-30"
        },
        {
          id: "2",
          brand: "FarmGro",
          total_price: 1200,
          price_per_user: 150,
          users_needed: 8,
          end_date: "2025-07-15"
        },
        {
          id: "3",
          brand: "PoultryPlus",
          total_price: 800,
          price_per_user: 80,
          users_needed: 10,
          end_date: "2025-07-01"
        },
      ]);
    } else {
      // Real product fetch
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
    }
  }, [isGuest, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId);

    if (!product) {
      setError("Please select a product.");
      return;
    }

    if (isGuest) {
      const fakeGroup = {
        id: "guest-demo-group-1",
        name,
        product,
      };

      localStorage.setItem("guestGroup", JSON.stringify(fakeGroup));
      navigate(`/group/${fakeGroup.id}`);
      return;
    }

    try {
      const response = await fetch("https://coocoo-app.onrender.com/api/groups/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          product: product.id,
        }),
      });

      const group = await response.json();

      if (!response.ok) {
        throw new Error(group.message || "Failed to create group");
      }

      navigate(`/group/${group.id}`);
    } catch (error) {
      console.error("Group creation error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="app-container"> 
      <Navigation />
      <div className="create-group-container">
        <h2>Create a Group</h2>
        {isGuest && (
          <p className="guest-banner">You are viewing a demo as a guest user.</p>
        )}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Group Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Select Product Package:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="">-- Select a Product --</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.brand} – R{prod.total_price} total, R{prod.price_per_user}/user, 
                {prod.users_needed} users – Ends {prod.end_date}
              </option>
            ))}
          </select>

          <button type="submit">Create Group</button>
        </form>
      </div>
    </div>
  );
};

export default InitiateGroup;
