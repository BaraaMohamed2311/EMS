// Validate booking data before submission
import userNotification from "../userNotification";

export const validateBookingData = (bookingData) => {

  
  if (!bookingData.consultationType) {
    userNotification('Consultation type is required');
  }
  
  if (!bookingData.date) {
    userNotification('Date is required');
  }
  
  if (!bookingData.startTime) {
    userNotification('Start time is required');
  }
  
  // Remove past date validation since we're blocking them in the UI
  if (bookingData.date && new Date(bookingData.date) < new Date().setHours(0, 0, 0, 0)) {
     userNotification('Cannot book appointments in the past');
   }
  
  return ;
};

// Format booking data for API submission
export const formatBookingForAPI = (bookingData) => {
  return {
    consultation_type: bookingData.consultationType,
    appointment_date: bookingData.date.toISOString().split('T')[0],
    start_time: bookingData.startTime,
    end_time: bookingData.endTime,
    duration_minutes: 60
  };
};

// Check if booking can be submitted
export const canSubmitBooking = (selectedDate, isSubmitting) => {
  return selectedDate && !isSubmitting;
};

// Get consultation type display name
export const getConsultationTypeDisplay = (consultationType) => {
  return consultationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};