import styles from "./usercard.module.css"
function PatientCard({ selectedUser }){
    return (
        <>
          <div className={styles.infoRow}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{selectedUser.user_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>ID:</span>
            <span className={styles.value}>{selectedUser.user_id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{selectedUser.user_email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Phone:</span>
            <span className={styles.value}>{selectedUser.patient_phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Gender:</span>
            <span className={styles.value}>{selectedUser.patient_gender}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Floor Number:</span>
            <span className={styles.value}>{ !selectedUser.floor_number || parseInt(selectedUser.floor_number) < 1 ? "N/A":selectedUser.floor_number}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Room Number:</span>
            <span className={styles.value}>{  !selectedUser.room_number  || parseInt(selectedUser.room_number) < 1 ? "N/A":selectedUser.room_number}</span>
          </div>
        </>
    )
}

const cardMapping = {
  patient: PatientCard,

};

export default cardMapping;