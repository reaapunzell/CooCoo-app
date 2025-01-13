import React from "react";
import "./Settings.css";

const Personalization = () => {
  return (
    <section className="settings-section">
      <h2>Personalization</h2>
      <form>
        <div className="form-row">
          <div className="input-box">
            <label>Theme</label>
            <select>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>Language</label>
            <select>
              <option value="en">English</option>
              <option value="af">Afrikaans</option>
              <option value="zu">Zulu</option>
            </select>
          </div>
        </div>
      </form>
      <button>Save Preferences</button>
    </section>
  );
};

export default Personalization;

