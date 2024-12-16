import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault();
    try{

    
   const response = await fetch ("http://localhost:8000/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    const {token} = data;

    //save token to localstorage
    localStorage.setItem("token", token)

    navigate(`/dashboard/${username}`);
  } catch(error){
    console.error("login error", err);
    setError(error.message);
  }
};

      //navigate to signup page
      const signUpNav = () => {
        navigate("/signup")
      };
      
  return (
    <div className="login-container">
        <img src="/CooCoo Main logo.svg"/>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          type="string"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button  className="login-btn" type='button' onClick={handleLogin}>Login</button>
      </form>

      <div className="signup-footer">
        <span> Don't have an account? </span>
        <button className="signup-btn" type='button' onClick={signUpNav}> Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
