import React, { useState } from 'react';
import styles from './EditableSection.module.css';

const EditableSection = ({ 
  buttonText = "Edit", 
  buttonClassName = "grey-button",
  children,
  onClose // Optional callback when section is closed
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    setIsEditing(false);
    if (onClose) {
      onClose();
    }
  };

  const handleToggle = () => {
    setIsEditing(prev => !prev);
  };

  return (
    <>
      {!isEditing && (
        <button onClick={handleToggle} className={buttonClassName}>
          {buttonText}
        </button>
      )}

      {isEditing && (
        <div className={styles.editing_box_wrapper}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close"
          >
            ✖
          </button>
          
          {/* Clone children and pass setIsEditing if needed */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                isEditing,
                setIsEditing,
                onClose: handleClose
              });
            }
            return child;
          })}
        </div>
      )}
    </>
  );
};

export default EditableSection;