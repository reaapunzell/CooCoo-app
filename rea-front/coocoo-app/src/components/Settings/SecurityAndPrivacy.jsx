import React, {useState} from "react";
import "./Settings.css";

const SecurityAndPrivacy = () => {

  const [twoFactorAuth, setTwoFactorAuth] = useState("");
  const [locationTracking, setLocationTracking] = useState("");
  const [ dataSharing, setDataSharing] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateSecuritySettings = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch ("", {
        method: "POST",
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },
        body: JSON.stringify({
          twoFactorAuth,
          locationTracking,
          dataSharing,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to updated settings");
      }

      setMessage('Security settings updated successfully');
      setError("");
    }catch (err){
      setMessage("");
      setError(err.message);
    }
  };

  return (
    <section className="settings-section">
      <h2>Security and Privacy</h2>
      <form onSubmit={updateSecuritySettings}>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" 
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              />
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox" 
              checked={locationTracking}
              onChange={(e) => setLocationTracking(e.target.checked)}

              />
              Allow location tracking for feed delivery
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-box">
            <label>
              <input type="checkbox"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.chacked)} />
              Share data with trusted partners for group buying
            </label>
          </div>
        </div>
        <button type="submit">Update Security Settings</button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </section>
  );
};

export default SecurityAndPrivacy;
