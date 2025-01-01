import React from "react";
import "./Settings.css"

const AccountForm = () => {

  console.log("loading account form");
  
  return (
    <section className="account-info">
      <h2>Account Information</h2>
      <div className="form-container">
        <div className="profile-picture">
          <img src="" alt="profile-picture" />
        </div>
      </div>
      <form>
        
        <div className="form-row">
            <div className="input-box">
          <label>First Name</label>
          <input type="text" />
          </div>

<div className="input-box">
          <label>Surname</label>
          <input type="text" />
          </div>
        </div>
        <div className="form-row">
            <div className="input-box">
          <label>Email</label>
          <input type="email" />
          </div>

        <div className="input-box">
          <label>Phone Number</label>
          <input type="text" />
          </div>
        </div>

        <div className="form-row">
            <div className="input-box">
          <label>Date of birth</label>
          <input type="date" />
          </div>

          <div className="input-box">
          <label>Country</label>
          <input type="text" />
          </div>
        </div>

        <div className="form-row">
            <div className="input-box">
          <label>Province</label>
          <input type="text" />
          </div>
          <div className="input-box">
          <label>Address</label>
          <input type="text" />
          </div>
        </div>
      </form>

      <button> Update Account Information</button>
    </section>
  );
};

export default AccountForm;
