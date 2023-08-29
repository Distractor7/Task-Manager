// Imports for use state, button, form, modal, and axios
import React, { useState } from "react";
import axios from "axios";
import Edit from "../components/editModal.js";
import "../App.css";

// ToDoList function that takes in the set is logged in function as a prop
function ToDoList({ setIsLoggedIn }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("");

  // Handle logout function that sets is logged in to false
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Fetch tasks function that gets the tasks from the database
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/readTasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error retrieving tasks.", error);
    }
  };

  // Add task function that adds a task to the database
  const addTask = async () => {
    try {
      const response = await axios.post("http://localhost:8080/addTask");
      setNewTask(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Handle submit function that takes in a new task and adds it to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTaskData = {
      task: newTask,
    };

    // Trys to add the new task
    try {
      const response = await axios.post(
        "http://localhost:8080/addTask",
        newTaskData
      );
      // Adds the new task to the tasks array, resets the new task, and sets the task id counter to the task id counter plus one
      setTasks([...tasks, response.data]);
      setNewTask("");
      setMessage("");
    } catch (error) {
      setMessage("Error adding new task: " + error.response.data.error);
      console.error("Error adding new task", error);
    }
  };

  // Delete task function that takes in a task id and deletes the task from the database
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/deleteTasks/${taskId}`, {
        headers: { "Content-Type": "application/json" },
        data: { id: taskId },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  // Update task function that takes in a task id and updated task content and updates the task in the database
  const updateTask = async (taskId, updatedTaskContent) => {
    try {
      await axios.put(
        `http://localhost:8080/updateTasks/${taskId}`,
        { task: updatedTaskContent },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { id: taskId, task: updatedTaskContent } : task
        )
      );
      setMessage("");
    } catch (error) {
      setMessage("Error updating task: " + error.response.data.error);
      console.error("Error updating task", error);
    }
  };

  //
  return (
    <div>
      <h1 className="toDoList">To-Do List</h1>
      {message && <p className="register-message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="task">Add Task:</label>
        <input
          id="task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="addBtn" type="submit">
          Add Task
        </button>
      </form>

      <div className="tasks-container">
        {tasks.map((task) => (
          <div key={task.id}>
            <span>Task: {task.task}</span> <br />
            {/* Add delete and edit buttons for each task */}
            <button
              className="button-style"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
            {/* Edit modal is rendered with props. */}
            <Edit
              className="button-style"
              taskId={task.id}
              taskContent={task.task}
              setTasks={setTasks}
              setMessage={setMessage} // pass setMessage as a prop
            />{" "}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <button onClick={fetchTasks}>See Tasks</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ToDoList;
