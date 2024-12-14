import './styles.css'
import {useState} from 'react';
import Calendar from './calendar';
import { CalendarDayHeader } from './calendar';

const App = () => {
  const [yearAndMonth,setYearAndMonth]=useState([2024,12])
  return (
    <div className="App">
       <Calendar
            yearAndMonth={yearAndMonth}
            onYearAndMonthChange={setYearAndMonth}
            renderDay={(calendarDayObject) => (
              <div>
                <CalendarDayHeader calendarDayObject={calendarDayObject} />
              </div>
            )}
       />
    </div>
  );
};

export default App;
