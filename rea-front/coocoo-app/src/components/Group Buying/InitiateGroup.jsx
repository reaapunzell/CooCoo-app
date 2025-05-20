import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css"; 
import Navigation from "../Navigation";
import Products, {fakeProducts} from "./Products";

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
      setProducts(fakeProducts);
      return
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
       
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Group Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

         <Products
  products={products}
  selectedProductId={selectedProductId}
  onSelect={setSelectedProductId}
/>

          <button type="submit">Create Group</button>
        </form>
      </div>
    </div>
  );
};

export default InitiateGroup;
