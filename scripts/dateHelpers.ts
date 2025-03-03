// src/utils/dateHelpers.ts

/**
 * Merge the date part from one Date with the time part from another.
 * Forces seconds and milliseconds to zero.
 */
export const mergeDateAndTime = (datePart: Date, timePart: Date): Date => {
    return new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      timePart.getHours(),
      timePart.getMinutes(),
      0, // force seconds to 0
      0  // force milliseconds to 0
    );
  };
  
  /**
   * Round a date to the nearest 15 minutes.
   * Also resets seconds and milliseconds to zero.
   */
  export const roundDateTo15Min = (date: Date): Date => {
    date.setSeconds(0, 0);
    const interval = 15 * 60 * 1000; // 15 minutes in ms
    return new Date(Math.round(date.getTime() / interval) * interval);
  };
  
  /**
   * Enforce that the given date is at least 2 hours in the future.
   * If not, returns a new date set to now + 2 hours.
   */
  export const enforceTwoHourBuffer = (date: Date): Date => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return date < minTime ? minTime : date;
  };