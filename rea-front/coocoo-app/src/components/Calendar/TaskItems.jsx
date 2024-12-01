import React from 'react';
import './Calendar.css';

const TaskItem = ({ task, onComplete }) => {
    return (
    <div
      onClick={onComplete}
      className={`task-item ${task.completed ? 'completed': ''}`}
    >
      <span>{task.name}</span>
      <span>{task.time}</span>
    </div>
  );
};

export default TaskItem;
