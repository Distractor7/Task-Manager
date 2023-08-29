//Imports for use state, button, form, modal, and axios
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

// Edit function that takes in the task id, task content, set tasks, and set message functions as props.
function Edit({ taskId, taskContent, setTasks, setMessage }) {
  // State variables for show and new task content
  const [show, setShow] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState(taskContent);

  // Handle close function that sets show to false and calls the update task function
  const handleClose = async () => {
    setShow(false);
    // Trys to update the task
    try {
      await updateTask(taskId, newTaskContent);
      // Catches any errors and sets the message to the error
    } catch (error) {
      setMessage("Error updating task: " + error.response.data.error);
      console.error("Error updating task", error);
    }
  };

  // Handle show function that sets the new task content to the current task content and sets show to true
  const handleShow = () => {
    setNewTaskContent(taskContent); // reset the new task content to the current task content when the modal is shown
    setShow(true);
  };

  //Sets new task content to the value of the input
  const handleInputChange = (event) => {
    setNewTaskContent(event.target.value);
  };

  // Update task function that takes in the task id and updated task content
  const updateTask = async (taskId, updatedTaskContent) => {
    try {
      // Trys to update the task
      await axios.put(
        `http://localhost:8080/updateTasks/${taskId}`, // corrected URL string
        { task: updatedTaskContent },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      //Maps through the tasks and updates the task if the task id matches the task id passed in
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { id: taskId, task: updatedTaskContent } : task
        )
      );
      // Sets the message to an empty string
      setMessage("");
      // Catches any errors and sets the message to the error
    } catch (error) {
      throw error;
    }
  };

  // Below is the Modal form jsx that displays the edit component when the edit button of a to do list item is clicked.
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>New To Do Item</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new to do item"
                autoFocus
                value={newTaskContent}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Edit;
