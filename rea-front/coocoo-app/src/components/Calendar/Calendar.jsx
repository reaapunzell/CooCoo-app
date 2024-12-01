import React, { useState } from "react";
import DateSelector from "./DateSelector";
import TaskList from "./TaskList";
import './Calendar.css'

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

  console.log('Selected Date:', selectedDate); // Debugging line
  console.log('Tasks for selected date:', tasks[selectedDate] || "no tasks for this date"); // Debugging line

  const handleTaskCompletion = (date, taskId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [date]: prevTasks[date].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  return (
    <div className="calendar">
      <h1>Today's Schedule</h1>
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <TaskList
        tasks={tasks[selectedDate] || []} // Ensure tasks fallback to an empty array if none found
        onCompleteTask={(taskId) => handleTaskCompletion(selectedDate, taskId)}
      />
    </div>
  );
};

export default Calendar;
