import styles from "./PermsList.module.css"
const PermsList = ({permissions})=>{
  
  return (<>
    {/* Perms List */}
    <strong className={styles.perms_header}>Permissions</strong>
          <div className={styles.perms_wrapper}>
            {permissions && permissions[0] !== "None" ? permissions.map((perm) => (
              <span key={perm} className={styles.perm}>{perm}</span>
            )) : "None"}
          </div>
  </>)
}

export default PermsList;