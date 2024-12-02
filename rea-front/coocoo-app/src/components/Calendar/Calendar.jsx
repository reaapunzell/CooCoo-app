import React, { useState } from "react";
import DateSelector from "./DateSelector";
import TaskList from "./TaskList";
import './Calendar.css'
import TaskForm from "./TaskForm";
import AddTaskButton from "./AddTask";

const Calendar = () => {
    const today = new Date().toISOString().split('T')[0];  
    const [selectedDate, setSelectedDate] = useState(today);;

  const [tasks, setTasks] = useState({
    '2024-12-01': [
      { id: 1, name: 'Refill feed and water', time: '06:00 AM', completed: false },
      { id: 2, name: 'Refill feed and water', time: '12:00 PM', completed: false },
      { id: 3, name: 'Refill feed and water', time: '16:00 PM', completed: false },
      { id: 4, name: 'Refill feed and water', time: '20:00 PM', completed: false },
    ],
  });

  const [isFormVisible, setIsFormVisible] = useState(false);


  const handleTaskCompletion = (date, taskId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [date]: prevTasks[date].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const handleAddTask = (newTask) => {
    setTasks(prevTasks => ({
        ...prevTasks,
        [selectedDate]: [...(prevTasks[selectedDate] || []), newTask],
    }));
};

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
};

  return (
    <div className="calendar">
      <h1>Today's Schedule</h1>
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <TaskList
        tasks={tasks[selectedDate] || []} // Ensure tasks fallback to an empty array if none found
        onCompleteTask={(taskId) => handleTaskCompletion(selectedDate, taskId)}
      />
      <AddTaskButton onAddTask={handleToggleForm}/>
      {isFormVisible && (
        <TaskForm
        onAddTask={handleAddTask}
        closeForm={handleToggleForm}
        />
      )}
    </div>
  );
};

export default Calendar;
