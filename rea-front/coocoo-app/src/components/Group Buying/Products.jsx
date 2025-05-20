import React from "react";
import "./Onboarding.css";

const Products = ({ products, selectedProductId, onSelect }) => {
  return (
    <div className="products-selection">
      <label>Select Product Package:</label>
      <select
        value={selectedProductId}
        onChange={(e) => onSelect(e.target.value)}
        required
      >
        <option value="">-- Select a Product --</option>
        {products.map((prod) => (
          <option key={prod.id} value={prod.id}>
            {prod.brand} – R{prod.total_price} total, R{prod.price_per_user}
            /user,
            {prod.users_needed} users – Ends {prod.end_date}
          </option>
        ))}
      </select>
    </div>
  );
};

export const fakeProducts = [
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
];

export default Products;
