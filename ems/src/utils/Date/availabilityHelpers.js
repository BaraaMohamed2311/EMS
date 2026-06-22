import { minutesTo12Hour , convertTimeUTCToLocal } from "./timeHelpers";

// ==========================================
//  Converts availability data string into a structured object
// ==========================================
export const parseAvailabilityData = (availabilityData) => {
  if (!availabilityData) return {};
  const parsedAvailability = {};
  // days = ["day: start-end", ...]
  const days = availabilityData.split(';').filter(day => day.trim());

  days.forEach(day => {
    // since day = "1: 09:00-17:00" we slice only first ":" 
    const colonIndex = day.indexOf(":");
    const dayIndex = day.slice(0, colonIndex).trim();
    const timeRange = day.slice(colonIndex + 1).trim();
    if (timeRange && !isNaN(dayIndex)) {
      const [start, end] = timeRange.split('-').map(time => time.trim());
      // convert them to local time
      parsedAvailability[dayIndex] = { start:convertTimeUTCToLocal(start), end:convertTimeUTCToLocal(end) };
    }
  });
  // parsedAvailability = {"day_indx": {start:"00:00",end:"00:00"}"}
  
  return parsedAvailability;
};

// ==========================================
//  Returns true if the date is available based on availability object, if it has key for that day of week index
// ==========================================
export const isDateAvailable = (date, availability) => {
  if (!availability || Object.keys(availability).length === 0) return true;
  
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  return availability.hasOwnProperty(dayOfWeek);
};

// ==========================================
//  Time/Minutes conversion helpers
// ==========================================
export const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};


export const convertMinutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// ==========================================
//  Slots generation within available range
// ==========================================
export const generateTimeSlotsInRange = (availableStart, availableEnd, interval = 60) => {
  if (!availableStart || !availableEnd) return [];
  if(availableStart === availableEnd) return generateAllTimeSlots(interval); // full day available
  const slots = [];

  // Convert time strings to minutes since midnight using helper
  const startMinutes = convertTimeToMinutes(availableStart);
  const endMinutes = convertTimeToMinutes(availableEnd);

  // Generate time slots
  let currentMinutes = startMinutes;
  
  while (currentMinutes < endMinutes) {
    // Convert back to "HH:MM" format in 12-hour format using helper
    const timeSlot = minutesTo12Hour(currentMinutes);
    slots.push(timeSlot);
    currentMinutes += interval;
  }
 
  
  return slots;
};

// ==========================================
//  Generate available time slots within a given range
// ==========================================
export const getAvailableTimeSlots = ( selectedDayIndx,parsedAvailability, consultationDuration = 60) => {
  // if it's not available at all, return empty array (no slots)
  if (!parsedAvailability || Object.keys(parsedAvailability).length === 0 || selectedDayIndx == null) {
    return [];
  }
  
  const { start: availableStart, end: availableEnd } = parsedAvailability[selectedDayIndx] || {};
  // uses other helper to generate slots textually
  return generateTimeSlotsInRange(availableStart, availableEnd, consultationDuration);
};

// ==========================================
//  Generate all possible time slots (60-minute intervals)
// ==========================================

export const generateAllTimeSlots = (interval=60) => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

// ==========================================
//  
// ==========================================

// Get first available time slot for a date
export const getFirstAvailableTimeSlot = (selectedDate, availability, consultationDuration = 60) => {
  const availableSlots = getAvailableTimeSlots(selectedDate, availability, consultationDuration);
  return availableSlots.length > 0 ? availableSlots[0] : null;
};

// Enhanced date selection helper that considers availability
export const isDateSelectableWithAvailability = (day, availability) => {
  // First check if the date is selectable based on past dates
  const baseSelectable = day.isCurrentMonth && !day.isDisabled;
  
  if (!baseSelectable) return false;
  
  // Then check availability
  return isDateAvailable(day.date, availability);
};