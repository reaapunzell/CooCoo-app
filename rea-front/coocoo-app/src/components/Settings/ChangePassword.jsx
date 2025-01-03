import React, {useState} from "react";
import "./Settings.css";

const ChangePassword = () => {
  const [message, setMessage] = useState("");

  const updatePassword = (e) => {
    e.preventDefault();
    setMessage("Password updated successfully");
  }

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
      <button className="update-pass-btn" type="button" onClick={updatePassword} >Update Password</button>
    {message && <p className="success-msg">{message}</p>  }
    </section>
  );
};

export default ChangePassword;
