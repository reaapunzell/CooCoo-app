import React from "react";
import "./Settings.css";

const SecurityAndPrivacy = () => {
  return (
    <section className="settings-section">
      <h2>Security and Privacy</h2>
      <form>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" />
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" />
              Allow location tracking for feed delivery
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" />
              Share data with trusted partners for group buying
            </label>
          </div>
        </div>
      </form>
      <button>Update Security Settings</button>
    </section>
  );
};

export default SecurityAndPrivacy;
