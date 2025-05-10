import React, {useState, useEffect} from 'react';
import Navigation from "../Navigation";
import "./Onboarding.css"; 
import { useNavigate } from "react-router-dom";

const Payment = () => {
    const guestGroup = JSON.parse(localStorage.getItem("guestGroup"));
    const product = guestGroup?.product;
    const navigate = useNavigate();
     const token = localStorage.getItem("token");
  const isGuest = localStorage.getItem("isGuest") === "true";
      const [formData , setFormData] = useState({
        firstName: '',
        surname: "",
    province: "",
    city: "",
    zip: "",
    street: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    });

    useEffect(() => {
        if (isGuest) {

            setFormData({
                firstName: "Guest",
                surname: "Coocoo",
                province: "G0auteng",
                city: "Johannesburg",
                zip: "1624",
                street: "123 Guest St",
                cardNumber:  "******************123",
                expiry: "12/25",
                cvv: "111",
            })
            // Retrieve guest group from localStorage
            const guestGroup = JSON.parse(localStorage.getItem("guestGroup"));
            if (guestGroup && guestGroup.id === id) {
                setGroup(guestGroup);
            } else {
                setError("Guest group not found.");
            }
            return;
    }} 
    ),[isGuest];

       //to insert actual api call - 


    const shippingCost = 100;
    const total = product?.price_per_user + shippingCost;

    const handleChange = (e) => {
        setFormData({...formData, [e.target.firstName]: e.target.value});
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        alert("Payment successful!" );

        const guestGroup = JSON.parse(localStorage.getItem("guestGroup"));

        navigate(`/group/${guestGroup}`);
    };

     if (!guestGroup || !product) {
    return <p className="loading">No group/product found.</p>;
  }

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
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
              <input type="text" name="surname" placeholder="Surname" onChange={handleChange} required />
              <input type="text" name="province" placeholder="Province" onChange={handleChange} required />
              <input type="text" name="city" placeholder="City" onChange={handleChange} required />
              <input type="text" name="zip" placeholder="Zip Code" onChange={handleChange} required />
              <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
            </div>

            <h4>Shipping</h4>
            <div className="shipping-option">
              <label>Standard Shipping</label>
              <span>R{shippingCost},00</span>
            </div>

            <h4>Payment Method</h4>
            <div className="input-grid">
              <input type="text" name="cardNumber" placeholder="Card Number" onChange={handleChange} required />
              <input type="text" name="expiry" placeholder="Expiry Date" onChange={handleChange} required />
              <input type="text" name="cvv" placeholder="CVV" onChange={handleChange} required />
            </div>

            <button type="submit" className="checkout-button">Checkout</button>
          </form>
        </div>
      </main>
        </div>

  )
}

export default Payment;