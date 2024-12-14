import React from 'react';
import './Calendar.css';

const DateSelector = ({ selectedDate, setSelectedDate }) => {
  const getDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // Ensures format is 'YYYY-MM-DD'
    }

    return dates;
  };

  return (
    <div className="date-selector">
      {getDates().map((date) => (
        <button
          key={date}
          onClick={() => setSelectedDate(date)}
          className={selectedDate === date ? 'selected' : ''}
        >
          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
        </button>
      ))}
    </div>
  );
};

export default DateSelector;
