import PropTypes from "prop-types";
import classNames from "classnames";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import { useState } from "react";
dayjs.extend(isBetween)
import {
  daysOfWeek,
  createDaysForCurrentMonth,
  createDaysForNextMonth,
  createDaysForPreviousMonth,
  isWeekendDay,
  getMonthDropdownOptions,
  getYearDropdownOptions
} from "./helpers";

Calendar.propTypes = {
  className: PropTypes.string,
  yearAndMonth: PropTypes.arrayOf(PropTypes.number).isRequired, // e.g. [2021, 6] for June 2021
  onYearAndMonthChange: PropTypes.func.isRequired,
  renderDay: PropTypes.func
};
export default function Calendar({
  className = "",
  yearAndMonth = [2024, 12],
  onYearAndMonthChange,
  renderDay = () => null
}) {
  const [year, month] = yearAndMonth;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  let currentMonthDays = createDaysForCurrentMonth(year, month);
  let previousMonthDays = createDaysForPreviousMonth(
    year,
    month,
    currentMonthDays
  );
  let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);
  let calendarGridDayObjects = [
    ...previousMonthDays,
    ...currentMonthDays,
    ...nextMonthDays
  ];

  const handleDayClick = (dateString) => {
    if (startDate === dateString) {
      // If the clicked date is the same as the start date reset select state 
      setStartDate(null);
      setEndDate(null);
    } else if (!startDate || dayjs(dateString).isBefore(dayjs(startDate))) {
      // If there is no start date or the selected date is earlier than the start date, reset the start date
      setStartDate(dateString);
      setEndDate(null); // Reset end date
    } else if (!endDate || dayjs(dateString).isAfter(dayjs(startDate))) {
      // If there is no end date or the selected date is later than the start date, set as the end date
      setEndDate(dateString);
    } else if (dateString === endDate) {
      // If the clicked date is the same as the end date, reset both
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleMonthNavBackButtonClick = () => {
    let nextYear = year;
    let nextMonth = month - 1;
    if (nextMonth === 0) {
      nextMonth = 12;
      nextYear = year - 1;
    }
    onYearAndMonthChange([nextYear, nextMonth]);
  };

  const handleMonthNavForwardButtonClick = () => {
    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear = year + 1;
    }
    onYearAndMonthChange([nextYear, nextMonth]);
  };

const currentMonthLabel = getMonthDropdownOptions().find(option => option.value === month).label;
const currentYearLabel = getYearDropdownOptions(year).find(option => option.value === year).label;
return (
    <div className="calendar-root">
      <div className="navigation-header"> 
          <button onClick={handleMonthNavBackButtonClick}
            className='clickButton'
          > ⭠ </button>
          <div className='headerContainer'>
            <label>{currentYearLabel}年{currentMonthLabel}月</label>
          </div>     
          <button onClick={handleMonthNavForwardButtonClick}
           className='clickButton'
          >⭢</button>  
      </div>
      <div className="days-of-week">
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={classNames("day-of-week-header-cell", {
              "weekend-day": [6, 0].includes(index)
            })}
          >
            {day}
          </div>
        ))}
      </div> 
      <div className="days-grid">
        {calendarGridDayObjects.map((day) => (
          <div
            key={day.dateString}
            className={classNames("day-grid-item-container", {
              "weekend-day": isWeekendDay(day.dateString),
              "current-month": day.isCurrentMonth,
              today: day.dateString === dayjs().format("YYYY-MM-DD"),
              "start-date": day.dateString === startDate, // start date style
              "end-date": day.dateString === endDate, //end date style
              "selected-range":
                startDate &&
                endDate &&
                dayjs(day.dateString).isBetween(startDate, endDate, null, "[]"), //Select range style
            })}
            onClick={() => handleDayClick(day.dateString)}
          >
            <div className="day-content-wrapper">{renderDay(day)}</div>
          </div>
        ))}
      </div>
    </div>
  );
 
}

CalendarDayHeader.propTypes = {
  calendarDayObject: PropTypes.object.isRequired
};
export function CalendarDayHeader({ calendarDayObject }) {
  return (
    <div className="day-grid-item-header">{calendarDayObject.dayOfMonth}</div>
  );
}
