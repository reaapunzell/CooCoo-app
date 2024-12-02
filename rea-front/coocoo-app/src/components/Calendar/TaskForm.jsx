import React, {useState} from "react";
import './Calendar.css'

const TaskForm = ({ onAddTask, closeForm }) => {
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName || !taskTime) return;
  };

  const newTask = {
    id: Date.now(),
    name: taskName,
    time: taskTime,
    completed: false,
  };

  onAddTask(newTask);
  closeForm();

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h2>Add New Task </h2>
        <form onSubmit={handleSubmit}>
          <label>
            Task Name :{" "}
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </label>
          <label>
            Task Time :
            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              required
            />
          </label>
          <div className="form-actions">
            <button type='submit'>Add Task </button>
            <button type="button" onClick={closeForm}> Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
