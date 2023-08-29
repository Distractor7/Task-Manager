// React library imported with axios and css file.
import React, { useState } from "react";
import axios from "axios";
import "../App.css";

// Below the register component is created.
const Register = () => {
  // Below the state variables and their functions for this component are.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Below is a register function.
  const register = async (e) => {
    e.preventDefault();

    // Check if password is empty before sending post request
    if (password === "") {
      setMessage("Password is empty. Please enter a password.");
      return;
    }

    // try block sends axios post request to the back end endpoint, passing username and password.
    try {
      await axios.post("http://localhost:8080/register", {
        username,
        password,
      });
      // Message is set to success if user registered.
      setMessage("User registered successfully!");
      // State variables cleared.
      setUsername("");
      setPassword("");
      // If error occurs, setMessage to error.
    } catch (error) {
      setMessage("Error registering user: " + error.response.data);
    }
  };

  // Below is the jsx that defines a register component with input fields and a button.
  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {/* Form takes register function as onSubmit value. */}
      <form className="register-form" onSubmit={register}>
        <div>
          <label className="register-label" htmlFor="username">
            Username:
          </label>
          {/* The input of this field is tracked by setting userName state to the content of this input field when submitted. */}
          <input
            className="register-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="register-label" htmlFor="password">
            Password:
          </label>
          {/* The input of this field is tracked by setting password state to the content of this input field when submitted. */}
          <input
            className="register-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="register-button" type="submit">
          Register
        </button>
      </form>
      {/* Message shown if issues or success with registering a new user. */}
      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

// Register component exported.
export default Register;
