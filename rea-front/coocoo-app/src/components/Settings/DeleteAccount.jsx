import React from "react";
import { useNavigate } from "react-router-dom";

const DeleteAccountButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try{
      const response = await fetch (`https://coocoo-app.onrender.com/auth/profile/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type" : "application/json",

        },
        body: JSON.stringify({
          is_active: false,
        }),
      });

      if(!response.ok){
        throw new Error("Failed to delete account");
      }

      alert("Your account has been deactivated");

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/");
    }catch (error){
      console.error("error deleting account:", error);
      alert("Something went wrong while deleting your account.");
    }
  };

  return (
    <div>
      <p>Are you sure you would like to delete your account?</p>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default DeleteAccountButton;
