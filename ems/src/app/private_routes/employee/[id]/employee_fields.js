import styles from "./employee.module.css";

function DoctorDetails({ user }) {
  return (
    <>
      <li><strong>Initial Consultation Price:</strong> {user.initial_consultation_price} EGP</li>
      <li><strong>Follow-up Consultation Price:</strong> {user.followup_consultation_price} EGP</li>
      <li><strong>Years of Experience:</strong> {user.years_of_exp} years</li>
      <li><strong>Role:</strong> {user.role_name}</li>
      
    </>
  );
}




 function SurgeonDetails({ user }) {
  return (
    <>
      <li><strong>Initial Consultation Price:</strong> {user.initial_consultation_price} EGP</li>
      <li><strong>Follow-up Consultation Price:</strong> {user.followup_consultation_price} EGP</li>
      <li><strong>Surgery Price:</strong> {user.surgery_price} EGP</li>
      <li><strong>Years of Experience:</strong> {user.years_of_exp} years</li>
      <li><strong>Role:</strong> {user.role_name}</li>
      
    </>
  );
}




function NurseDetails({ user }) {
  return (
    <>
      <li><strong>Assigned Floor Number:</strong> {user.floor_number !== -1 ? user.floor_number : "Not Assigned"}</li>
      
    </>
  );
}


const MapToEmployeeDetails = {
    "Doctor":DoctorDetails,
    "Surgeon":SurgeonDetails,
    "Nurse":NurseDetails

}

export default MapToEmployeeDetails