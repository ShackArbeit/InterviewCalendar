import React, { useState } from 'react';
import { format, isBefore, addMonths, subMonths } from 'date-fns';

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const daysInMonth = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i - currentMonth.getDay() + 1
    );
    return date;
  });

  const handleDateClick = (date) => {
    if (!startDate || isBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (!endDate || isBefore(startDate, date)) {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const isSelected = (date) =>
    (startDate && format(date, 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd')) ||
    (endDate && format(date, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) ||
    (startDate &&
      endDate &&
      isBefore(startDate, date) &&
      isBefore(date, endDate));

  return (
    <div>
      <div>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{'<'}</button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{'>'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
        {daysInMonth.map((date) => (
          <button
            key={date}
            onClick={() => handleDateClick(date)}
            style={{
              padding: '10px',
              backgroundColor: isSelected(date) ? 'blue' : 'white',
              color: isSelected(date) ? 'white' : 'black',
              cursor: 'pointer',
            }}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
