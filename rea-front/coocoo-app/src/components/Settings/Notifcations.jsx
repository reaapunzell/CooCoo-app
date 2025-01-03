import React from "react";
import "./Settings.css";

const Notifications = () => {
  return (
    <section className="settings-section">
      <h2>Notifications</h2>
      <form>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" />
              Receive notifications about group buy discounts
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" />
              Receive updates about farm management tips
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" />
              Notify me about feed delivery status
            </label>
          </div>
        </div>
      </form>
      <button>Save Notification Preferences</button>
    </section>
  );
};

export default Notifications;
