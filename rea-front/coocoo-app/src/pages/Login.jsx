import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState("")

  const handleLogin = () => {
    fetch ("http:http://127.0.0.1:8000/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => setToken(data.token))
    .then((err) => console.warn(err))
  }

      //navigate to signup page
      const signUpNav = () => {
        e.preventDefault();
        navigate("/signup")
      };
      
  return (
    <div className="login-container">
        <img src="/CooCoo Main logo.svg"/>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button className="signup-btn" type='button' onClick={signUpNav} > Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
