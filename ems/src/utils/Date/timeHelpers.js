
// Calculate end time (always 1 hour after start time)
export const calculateEndTime12Hour = (start12h, duration = 60) => {
  // Split: "02:30 PM" → ["02:30", "PM"]
  const [time, modifier] = start12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24h format
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  // Add duration (minutes)
  let totalMinutes = hours * 60 + minutes + duration;

  // Wrap around 24h
  totalMinutes %= 24 * 60;

  // Convert back to hours/minutes
  let endHours = Math.floor(totalMinutes / 60);
  let endMinutes = totalMinutes % 60;

  // Determine AM/PM
  const newModifier = endHours >= 12 ? "PM" : "AM";

  // Convert back to 12h display format
  let displayHours = endHours % 12;
  if (displayHours === 0) displayHours = 12;

  return `${displayHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")} ${newModifier}`;
};



// Validate time format
export const isValidTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Get default start time (9:00 AM)
export const getDefaultStartTime = () => {
  return '09:00';
};

export const minutesTo12Hour = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
    
    // Format minutes with leading zero if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${formattedMinutes} ${period}`;
  };

  export function to24Hour(time12h) {
  // time12h example: "02:00 PM"
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  // Convert to numbers
  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  // Return in 24-hour format (always 2 digits)
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

export function to12Hour(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12, 13 to 1, etc.
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}


// Get current time in HH:MM format
export const getCurrentTime24 = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Convert a UTC time ("HH:MM") to local time ("HH:MM")
export const convertTimeUTCToLocal = (utc_time) => {
  const [hours, minutes] = utc_time.split(':').map(Number);

  // Create a Date object for today at the given UTC time
  const now = new Date();
  const dateUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes));

  // Extract local hours and minutes
  const localHours = String(dateUTC.getHours()).padStart(2, '0');
  const localMinutes = String(dateUTC.getMinutes()).padStart(2, '0');

  return `${localHours}:${localMinutes}`;
}

// Convert a local time ("HH:MM") to UTC time ("HH:MM")
export const convertTimeLocalToUTC = (local_time) => {
  const [hours, minutes] = local_time.split(':').map(Number);

  // Create a Date object for today at the given local time
  const now = new Date();
  const dateLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  // Extract UTC hours and minutes
  const utcHours = String(dateLocal.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(dateLocal.getUTCMinutes()).padStart(2, '0');

  return `${utcHours}:${utcMinutes}`;
}
