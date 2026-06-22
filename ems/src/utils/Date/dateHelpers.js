export const getDayIndexInWeek = (date) => {
  if(!date) return null;
  // If date is a string, convert to Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Get day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayIndex = dateObj.getDay();
  
  return dayIndex;
};

// =====================================
// Generates 42 days for calendar view (6 weeks)
// =====================================
// First week may include days from previous month, So by default isDisabled: true
// Last week may include days from next month, So by default isDisabled: true
// Days in current month have isCurrentMonth: true, isDisabled: isPastDate checks if days of current month are in the past
// isPastDate: true for days before today

export const getDaysInMonth = (currentDate) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  // month + 1 - The next month index, (0 = last day of previous month)
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  
  // getDay() returns 0 (Sun) to 6 (Sat)
  const firstDayOfWeek = firstDay.getDay();
  // Add days from previous month to fill the first week
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({
      date: prevDate,
      isCurrentMonth: false,
      isPastDate:true,
      isDisabled: true
    });
  }
  
  // Add current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const isPastDate = 
      year < currentYear ||
      (year === currentYear && month < currentMonth) ||
      (year === currentYear && month === currentMonth && day < currentDay);
    
    days.push({
      date,
      isCurrentMonth: true,
      isPastDate: isPastDate,
      isDisabled: isPastDate
    });
  }
  
  // Add days from next month to fill the last week
  const totalCells = 42; // 6 weeks
  while (days.length < totalCells) {
    const nextDate = new Date(year, month + 1, days.length - lastDay.getDate() - firstDayOfWeek + 1);
    days.push({
      date: nextDate,
      isCurrentMonth: false,
      isPastDate:false,
      isDisabled: true
    });
  }
  
  return days;
};

// Navigate to previous month - disable if it's before current month
export const getPrevMonth = (currentDate) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Don't allow navigation to months before current month
  if (year < currentYear || (year === currentYear && month <= currentMonth)) {
    return currentDate; // Return current date to prevent navigation
  }
  
  return new Date(year, month - 1, 1);
};

// Navigate to next month
export const getNextMonth = (currentDate) => {
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
};

// Check if previous month navigation is allowed
export const canNavigateToPrevMonth = (currentDate) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Allow navigation if current month is after the current real month
  return year > currentYear || (year === currentYear && month > currentMonth);
};

// =====================================
// Check if a date is selectable
// =====================================
// For it to be selectable, it must not be disabled and must belong to the current month and be available (availability depends on employee's schedule)
export const isDateSelectable = (day, isAvailable = true) => { 
  return !day.isDisabled && day.isCurrentMonth && isAvailable ; 
};

// Get initial current date (current month)
export const getInitialCurrentDate = () => {
  return new Date();
};

// Month names for display
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Day names for display
export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Format date for display
export const formatDateDisplay = (date) => {
  return date.toDateString();
};

// Check if a date is in the past
export const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};


export function getYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Convert a Date object to UTC string: "YYYY-MM-DD HH:MM:SS" we can use new Date and pass it as parameter
// ================================
// Convert Local Date → UTC string
// ================================
export const convertLocalToUTC = (dateObj) => {
  try {
    // Reject null, undefined, numbers, strings, etc.
    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
      console.warn("convertLocalToUTC: Invalid date object:", dateObj);
      return null;
    }

    // Returns "YYYY-MM-DD HH:MM:SS" in UTC
    return dateObj.toISOString().slice(0, 19).replace("T", " ");
  } catch (err) {
    console.error("convertLocalToUTC error:", err);
    return null;
  }
};


export const convertUTCToLocal = (dateTimeUTC) => {
  try {
    if (typeof dateTimeUTC !== "string") {
      console.warn("convertUTCToLocal: Expected string but got:", dateTimeUTC);
      return null;
    }

    let normalized = dateTimeUTC;

    // Normalize only if it has a space instead of 'T'
    if (dateTimeUTC.includes(" ") && !dateTimeUTC.includes("T")) {
      normalized = dateTimeUTC.replace(" ", "T");
    }

    // Ensure it is treated as UTC
    if (!normalized.endsWith("Z")) {
      normalized += "Z";
    }

    const dateObj = new Date(normalized);

    if (isNaN(dateObj)) {
      console.warn("convertUTCToLocal: Invalid date string:", dateTimeUTC);
      return null;
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (err) {
    console.error("convertUTCToLocal error:", err);
    return null;
  }
};

