import React from "react";
import "./Settings.css";

const ChangePassword = () => {
  return (
    <section className="settings-section">
      <h2>Change Password</h2>
      <form>
        <div className="form-row">
          <div className="input-box">
            <label>Current Password</label>
            <input type="password" />
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>New Password</label>
            <input type="password" />
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>Confirm New Password</label>
            <input type="password" />
          </div>
        </div>
      </form>
      <button>Update Password</button>
    </section>
  );
};

export default ChangePassword;
