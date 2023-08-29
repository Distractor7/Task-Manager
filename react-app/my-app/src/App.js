// React library imported with axios and css file.
// Hook imported too.
import React, { useState } from "react";
import axios from "axios";
// Components imported to main app.
import Login from "../src/components/login";
import Register from "../src/components/register";
import ToDoList from "./components/toDoList";

import "bootstrap/dist/css/bootstrap.min.css";

// Below is main app component.
function App() {
  // Below is state and set function for user being logged in or not.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Below is asyncronous function used to make axios request to back end passing the username and password in as arguments.
  const handleLogin = async (username, password) => {
    // Try block makes axios post request to login endpoint with username and password. If the request is successful, the setIsLoggedIn function is called with the value returned by the server in the userIsLoggedIn property of the response data.
    try {
      const res = await axios.post("/login", { username, password });
      setIsLoggedIn(res.data.userIsLoggedIn);
    } catch (err) {
      console.error(err);
    }
  };

  // If the user is not logged in (isLoggedIn is false), the login and registration forms are displayed side-by-side.
  return (
    <div className="app">
      {!isLoggedIn ? (
        <>
          <div className="app-column">
            <Login handleLogin={handleLogin} />
          </div>
          <div className="app-column">
            <Register />
          </div>
        </>
      ) : (
        // If the user is logged in (isLoggedIn is true), the ToDoList component is displayed instead, with the setIsLoggedIn function passed as a prop.
        <ToDoList setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
