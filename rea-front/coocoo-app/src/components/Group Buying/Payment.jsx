import React, { useState, useEffect } from "react";
import Navigation from "../Navigation";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("isGuest") === "true";
  const guestGroup = JSON.parse(localStorage.getItem("guestGroup"));

  if (!guestGroup || !guestGroup.product) {
    return <p className="loading">No group/product found.</p>;
  }

  const product = guestGroup.product;

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    province: "",
    city: "",
    zip: "",
    street: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Prefilled guest info
  useEffect(() => {
    if (isGuest) {
      setFormData({
        firstName: "Guest",
        surname: "Coocoo",
        province: "Gauteng",
        city: "Johannesburg",
        zip: "1624",
        street: "123 Guest St",
        cardNumber: "******************123",
        expiry: "12/25",
        cvv: "111",
      });
    }
  }, [isGuest]);

  const shippingCost = 100;
  const total = product.price_per_user + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (isGuest && guestGroup?.id){
      localStorage.setItem(`contributed-${guestGroup.id}`, "true");
    }
    alert("Payment successful!");
    navigate(`/group/${guestGroup.id}`);
  };

  return (
    <div className="app-container">
      <Navigation />
      <main className="pay-main">
        <div className="checkout-card">
          <div className="checkout-header">
            <span>&lt;</span>
            <span>1 Product</span>
            <span>Total R{total},00</span>
          </div>

          <div className="product-summary">
            <div className="product-box">📦</div>
            <div>
              <p>{product.name}</p>
              <p>R{product.price_per_user},00</p>
            </div>
          </div>

          <form onSubmit={handleCheckout}>
            <h4>Delivery Information</h4>
            <div className="input-grid">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="province"
                placeholder="Province"
                value={formData.province}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={formData.zip}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <h4>Shipping</h4>
            <div className="shipping-option">
              <label>Standard Shipping</label>
              <span>R{shippingCost},00</span>
            </div>

            <h4>Payment Method</h4>
            <div className="input-grid">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="expiry"
                placeholder="Expiry Date"
                value={formData.expiry}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="checkout-button">
              Checkout
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Payment;
