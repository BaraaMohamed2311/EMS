import cardMapping from './SelectUserCard_Fields';
import styles from './usercard.module.css';
function UserCard({ selectedUser, target = 'patient' }){
    // Get the appropriate card component based on target
    const CardComponent = cardMapping[target];
    
    // Fallback component if target not found
    if (!CardComponent) {
        console.warn(`No card component found for target: ${target}`);
        return (
            <div className={styles.selectedUserCard}>
                <div className={styles.noUser}>
                    <p>No card configuration found for {target}</p>
                </div>
            </div>
        );
    }
    
    return (
        <>
        {/* Display Selected User Card */}
        <div className={styles.selectedUserCard}>
          <div className={styles.userInfo}>
            {selectedUser ? (
              <CardComponent selectedUser={selectedUser} />
            ) : (
              <div className={styles.noUser}>
                <p>No {target} Found</p>
              </div>
            )}
          </div>
        </div>
        </>
    )
}

export default UserCard;