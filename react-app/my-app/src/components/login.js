// React library imported with axios and css file.
import React, { useState } from "react";
import axios from "axios";
import "../App.css";

// Below the login component is defined and passed handLogin as props from parent app.
function Login({ handleLogin }) {
  // Below the state variables stores the username, password, message to user and the status of the user being logged in or not.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  // Below a function is created to handle the submitting of the form.
  const handleSubmit = (event) => {
    // Prevents page reload.
    event.preventDefault();
    // handleLogin function makes post request to the back end with login details.
    handleLogin(username, password);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">Username:</label>
        {/* The input of this field is tracked by setting userName state to the content of this input field when submitted. */}
        <input
          type="text"
          placeholder="Enter your username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="login-label">Password:</label>
        {/* The input of this field is tracked by setting password state to the content of this input field using onchange, when submitted. */}
        <input
          type="password"
          placeholder="Enter your password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* button is used to submit login details to be checked in registry file in back end. */}
        <button type="submit" className="login-button">
          Login
        </button>
        {/* The contents of message are displayed to the user to explain process of login. */}
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
