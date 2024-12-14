import {range} from 'ramda'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekday)
dayjs.extend(weekOfYear)

export const daysOfWeek=[
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thur",
    "Fri",
    "Sat"
]

// Based on the given date string, returns the day of the week corresponding to the date (expressed as a number, starting from Monday)
export function getWeekday(dateString) {
    return dayjs(dateString).weekday();
}

// Determines whether a given date is a weekend (Saturday or Sunday)
export function isWeekendDay(dateString){
    return [6,0].includes(getWeekday(dateString))
}


// dynamic generate possible months for ueser
export function getYearDropdownOptions(currentYear) {
    let minYear=currentYear-4;
    let maxYear=currentYear+5;
    return range(minYear,maxYear+1).map((y)=>({label:`${y}`,value:y}))
}

// dynamic generate every months from Jan till Dec
export function getMonthDropdownOptions(){
     return range(1,13).map((m)=>({
          value:m,
          label:dayjs()
        // The .month() method of dayjs accepts an index value from 0 (January) to 11 (December), so m - 1 is used here to convert the numeric format of m (1 to 12) into a 0-based index value.
              .month(m-1)
              .format('MM')
     }))
}

// Calculate the number of days in the specified year and month
export function getNumberOfDaysInMonth(year,month){
    return dayjs(`${year}-${month}-01`).daysInMonth();
}

// Create an array for the specified year and month, each array item contains specific day information for that month
export function createDaysForCurrentMonth(year, month) {
    return [...Array(getNumberOfDaysInMonth(year, month))].map((_, index) => {
      return {
        dateString: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
        dayOfMonth: index + 1,
        isCurrentMonth: true
      };
    });
}

// Calculate and generate the visible last month's date based on the first day of the current month
export function createDaysForPreviousMonth(year, month, currentMonthDays) {
    // Get the day of the week that the first day of the current month is
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].dateString);
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");
    // The number of dates that need to be displayed in the previous month is exactly equal to the number corresponding to 
    // the "day of the week" on the first day of the month.
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday;
    // Displays the last date that appears in the current month's calendar
    const previousMonthLastMondayDayOfMonth = dayjs(
      currentMonthDays[0].dateString
    )
      .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
      .date();
    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((_, index) => {
      return {
        dateString: dayjs(
          `${previousMonth.year()}-${previousMonth.month() + 1}-${
            previousMonthLastMondayDayOfMonth + index
          }`
        ).format("YYYY-MM-DD"),
        dayOfMonth: previousMonthLastMondayDayOfMonth + index,
        isCurrentMonth: false,
        isPreviousMonth: true
      };
    });
}

// Based on the currently displayed date range, generate the date information for the next month that needs to be displayed
export function createDaysForNextMonth(year, month, currentMonthDays) {
    const lastDayOfTheMonthWeekday = getWeekday(
      `${year}-${month}-${currentMonthDays.length}`
    );
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
    // Calculate the "number of days visible" starting from next month
    const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;
  
    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        dateString: dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
        ).format("YYYY-MM-DD"),
        dayOfMonth: index + 1,
        isCurrentMonth: false,
        isNextMonth: true
      };
    });
  }