// Below express, cors and other middleware is imported to the app.
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

// Custom middleware is imported to the app file.
const checkUsername = require("../express-app/middleware/checkUsername");
const checkTaskLength = require("../express-app/middleware/checkTaskLength");
const checkContentType = require("../express-app/middleware/checkContentType");

// App uses cors and json body parser.
app.use(express.json());
app.use(cors());

// The users registry file is imported.
const usersJson = require("../express-app/users.json");

// Register Endpoint and Middleware
app.post("/register", checkUsername, checkContentType, (req, res) => {
  console.log("success");
  const { username, password } = req.body;

  // Create a new user object
  const user = {
    username: username,
    password: password,
  };

  // The users file is imported.
  const allUsers = fs.readFileSync("../express-app/users.json", "UTF-8");

  // The users file is parsed.
  const parsedUsers = JSON.parse(allUsers);

  // The new created user object is added to the file.
  parsedUsers.push(user);

  // The users are turned into string again.
  let stringJson = JSON.stringify(parsedUsers);

  // The new user is users file is then written to the file.
  fs.writeFileSync("../express-app/users.json", stringJson);

  // A success message is logged.
  res.status(200).json({
    message: "User registered successfully",
  });
});

// LOGIN ENDPOINT and MiddleWare.
app.post("/login", checkUsername, checkContentType, (req, res) => {
  // Variables store username and password from req body.
  const { username, password } = req.body;

  // Read the contents of the JSON file
  const allUsers = fs.readFileSync("../express-app/users.json", "UTF-8");
  // Users parsed.
  const parsedUsers = JSON.parse(allUsers);

  // Check if the provided username and password match any entry in the file
  const userFound = parsedUsers.find(
    (user) => user.username === username && user.password === password
  );

  // If found userIsLogged in set to true.
  if (userFound) {
    // Set a state variable userIsLoggedIn to true if the credentials match
    userFound.userIsLoggedIn = true;

    // A success message is returned.
    res.status(200).json({
      message: "Login successful",
      userIsLoggedIn: userFound.userIsLoggedIn,
    });
    // If its not another error message is logged.
  } else {
    res.status(401).json({
      message: "Invalid username or password",
    });
  }
});

// End point for adding task
app.get("/readTasks", (req, res) => {
  // The info in fiel is read and if statement logs results if they are success of failire in retrieving info.
  fs.readFile("tasks.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading tasks file" });
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

// End point for adding task. Middlware checks content type and task length.
app.post("/addTask", checkTaskLength, checkContentType, (req, res) => {
  // New task variable stores task content.
  const newTask = req.body.task;
  //
  fs.readFile("tasks.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading tasks file" });
    } else {
      // Tasks data is parsed.
      const tasks = JSON.parse(data);
      // These lines generate a new ID for the task and create a new object that includes the ID and the new task content.
      const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
      const newTaskWithId = { id: newId, task: newTask };
      // The new task with its id is pushed to the tasks array.
      tasks.push(newTaskWithId);
      // Then the new tasks that are converted to string before being written to the tasks.json file.
      fs.writeFile("tasks.json", JSON.stringify(tasks), (err) => {
        // Below is an if statement to monitor the outcome of the adding of the tasks to the file.
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error writing to tasks file" });
        } else {
          res.status(200).json(newTaskWithId);
        }
      });
    }
  });
});

// Delete task route endpoint. This deletes a task by its id. Makes use of the check content type middlware.
app.delete("/deleteTasks/:id", checkContentType, (req, res) => {
  //converts entered id to an integer.
  const id = parseInt(req.params.id, 10);
  // Reads content of json file.
  fs.readFile("tasks.json", (err, data) => {
    // If there is an error reading the tasks.json file then there is a response status sent with message to be shown to the user.
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading tasks file" });
    } else {
      //If the reading of the file was a success the results are passed to the data object.
      // Then below the data is parsed.
      const tasks = JSON.parse(data);
      // These lines generate a new task list that excludes the task with the specified ID, and write the updated task list back to the "tasks.json" file.
      const updatedTasks = tasks.filter((task) => task.id !== id);
      fs.writeFile("tasks.json", JSON.stringify(updatedTasks), (err) => {
        // If there was an error in re-writing the file error message is logged.
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error writing to tasks file" });
        } else {
          // Or else a success message is sent.
          res.status(200).json({ message: "Task deleted" });
        }
      });
    }
  });
});

// Here is the end point for updating a task by its id. It makes use of middlware checks on the content type being passed and the task content length being passed.
app.put("/updateTasks/:id", checkContentType, checkTaskLength, (req, res) => {
  //  Below the id passed by the user is parsed.
  const id = parseInt(req.params.id);
  // Below is the new task content from the request body.
  const updatedTask = req.body;
  // Below the tasks file is read. If an error occurs a message is sent. If no error, the response is sent as data in string form.
  fs.readFile("tasks.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading tasks file" });
    } else {
      // variable parses the response data string to an object.
      const tasks = JSON.parse(data);
      //This line finds the index of the relevant id number.
      const taskIndex = tasks.findIndex((task) => task.id === id);
      //If task index was not found then message sent to the user.
      if (taskIndex === -1) {
        res.status(404).json({ message: "Task not found" });
      } else {
        // Then task with particular index is overwritten with the new task content.
        tasks[taskIndex].task = updatedTask.task;
        // Then the new tasks.json file is overwritten with new task included.
        fs.writeFile("tasks.json", JSON.stringify(tasks), (err) => {
          // If there is an error in writing to the file a message is sent.
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Error writing to tasks file" });
          } else {
            res.status(200).json(tasks[taskIndex]);
          }
        });
      }
    }
  });
});

// Port variable is on 8080
let PORT = process.env.PORT || 8080;
// App is listening on port 8080.
app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});
