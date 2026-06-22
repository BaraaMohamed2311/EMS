// ===================================================
//        Profile Edit Manager (Reusable)
// ===================================================
import { useState } from "react";
import UpdateUserForm from "@/components/UpdateUserForm/UpdateUserForm";
import userNotification from "@/utils/userNotification";
import statusNotification from "@/utils/statusNotification";
import { useUserDataContext } from "@/contexts/user_data";

const ProfileEditManager = ({
  role,
  userData,
  references,
  selfEditableFields, 
  approvalRequiredFields,
  
}) => {
  const [isSelfEditing, setIsSelfEditing] = useState(false);
  const [isApprovalEditing, setIsApprovalEditing] = useState(false);
  const userToken = userData.token;
  const {setUser_Data} = useUserDataContext();
  
  // Function to check if there are any renderable fields
  const hasRenderableFields = (fields = {}) => {
  return (
    (fields.inputs_info && fields.inputs_info.length > 0) ||
    (fields.select_def && Object.keys(fields.select_def).length > 0) ||
    (fields.check_box && Object.keys(fields.check_box).length > 0)
  );
};

// Helper function to build field definitions
const mergeFieldDefinitions = (shared = {}, role = {}) => ({
  inputs_info: [
    ...(shared.inputs_info || []),
    ...(role.inputs_info || []),
  ],
  select_def: {
    ...(shared.select_def || {}),
    ...(role.select_def || {}),
  },
  check_box: {
    ...(shared.check_box || {}),
    ...(role.check_box || {}),
  },
});

function patchUserData(e, url, fieldDefinitions) {

  e.preventDefault();

  let updatedData;

    updatedData = buildUpdatedPatientDataOnly(
      fieldDefinitions,
      references,
      userData
    );
  

  if (Object.keys(updatedData).length === 0) {
    userNotification("error", "No changes detected");
    return;
  }
  
  fetch(`${process.env.APIKEY}${url}`, {
    mode: "cors",
    method: "PATCH",
    headers: {
      authorization: `BEARER ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({user_id:userData.user_id,...updatedData}), 
  })
    .then((res) => {
      statusNotification(res.status);
      return res.json();
    })
    .then((data) => {
      if(data && data.success){
        if(isSelfEditing) setIsSelfEditing(false);
        if(isApprovalEditing) setIsApprovalEditing(false);
        setUser_Data((prevData)=> ({...prevData , ...updatedData}))

      }
      userNotification(data.success ? "success" : "error", data.message);
    })
    .catch((err) => {
      console.error("Error Updating User Fetch", err);
      userNotification("error", "Error Updating User Fetch");
    });
}


  function buildUpdatedPatientDataOnly(
  fieldDefinitions,
  references,
  currentData 
) {
  let updatedData = {};

  // ======================================================
  // 1️⃣ Inputs (text, email, date, tel, ...)
  // ======================================================
  fieldDefinitions.inputs_info?.forEach((field) => {
    const ref = references.inputsBoxsRef?.current[field.name];

    if (!ref) return;

    if (!ref.value) {
      userNotification("error", "Input fields cannot be empty");
      throw new Error("Empty input");
    }

    if (ref.value !== currentData[field.name]) {
      updatedData[field.name] = ref.value;
    }
  });

  // ======================================================
  // 2️⃣ Select fields
  // ======================================================
  if (fieldDefinitions.select_def) {
    Object.values(fieldDefinitions.select_def).forEach((field) => {
      const ref = references.selectBoxsRef?.current[field.name];
      
      if (!ref) return;

      if (!ref.value) {
        userNotification("error", "Input fields cannot be empty");
        throw new Error("Empty select");
      }

      if (ref.value !== currentData[field.name]) {
        updatedData[field.name] = ref.value;
      }
    });
  }

  // ======================================================
  // 3️⃣ Checkbox fields
  // ======================================================
  if (fieldDefinitions.check_box) {
    Object.values(fieldDefinitions.check_box).forEach((field) => {
      const ref = references.checkBoxsRef?.current[field.name];
      if (!ref) return;

      if (ref.checked !== currentData[field.name]) {
        updatedData[field.name] = ref.checked;
      }
    });
  }

  return updatedData;
}



const selfShared = selfEditableFields.shared || {};
const selfRole = selfEditableFields[role] || {};

const approvalShared = approvalRequiredFields.shared || {};
const approvalRole = approvalRequiredFields[role] || {};

const selfFields = mergeFieldDefinitions(selfShared, selfRole);
const approvalFields = mergeFieldDefinitions(approvalShared, approvalRole);

const showSelfEditBtn = hasRenderableFields(selfFields);
const showApprovalEditBtn = hasRenderableFields(approvalFields);




  return (
    <>
      {/* Buttons */}
      <div className="buttons-wrapper">
        {showSelfEditBtn && (
          <button className="grey-button" onClick={() => setIsSelfEditing(true)}>
            Edit Data
          </button>
        )}

        {showApprovalEditBtn && (
          <button
            className="grey-button"
            onClick={() => setIsApprovalEditing(true)}
          >
            Request Edit Data
          </button>
        )}
      </div>

      {/* Self editable form */}
      {isSelfEditing && (
        
        <UpdateUserForm
          url={'/details/self'}
          isEditing={isSelfEditing}
          setIsEditing={setIsSelfEditing}
          user_displayed={userData}
          references={references}
          update_handler={(e, url) => patchUserData(e, url, selfFields)}
          fieldDefinitions={selfFields}
          isUpdatingSelf={true}
          token={userToken}
          
        />
      )}

      {/* Approval required form */}
      {isApprovalEditing && (
        <UpdateUserForm
          url={'/details/self'}
          isEditing={isApprovalEditing}
          setIsEditing={setIsApprovalEditing}
          user_displayed={userData}
          references={references}
          update_handler={(e, url) => patchUserData(e, url, approvalFields)}
          fieldDefinitions={approvalFields}
          isUpdatingSelf={true}
          token={userToken}
        />
      )}
    </>
  );
};

export default ProfileEditManager;