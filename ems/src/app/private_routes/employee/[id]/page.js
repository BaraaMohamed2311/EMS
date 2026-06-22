"use client";
import styles from "./employee.module.css";
import private_routes from "../../page";
import { useEmployeesCache } from "@/hooks/useEmployeesCache";
import {  useParams } from "next/navigation";

import { useUserDataContext } from "@/contexts/user_data";
import { useRouter } from "next/navigation";
import UpdateUserForm from "@/components/UpdateUserForm/UpdateUserForm";
import { useState ,useEffect , useRef ,useMemo} from "react";
import MoneyShortner from "@/utils/MoneyShortner";
import pickRoleIcon from "@/utils/pickRoleIcon"
import Image from "next/image";
import { inputs_info , select_def , check_box , getFieldsForTitle } from "./data";
import updateUserFetch from "@/utils/updateUserFetch";
import EditableSection from "@/components/EditableSection/EditableSection";
import statusNotification from "@/utils/statusNotification";
import userNotification from "@/utils/userNotification";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import MapToEmployeeDetails from "./employee_fields"
import AvailabilityList from "@/components/AvailabilityList/AvailabilityList";

function EmployeeDetailsPage() {

  let [blobURL , setBlobURL] = useState("/avatar.jpg");
  const { id :user_id ,currPage} = useParams(); // Get user_id from URL
  const { cached_employees , setCached_Employees,isIndexedDBLoaded , deleteEmployeeFromStore } = useEmployeesCache();
  const { user_data } = useUserDataContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const router = useRouter();

  
   // Efficiently find the employee from cache
const originalEmployee = cached_employees?.find(
  e => e.user_id === parseInt(user_id) || e.user_id === user_id || String(e.user_id) === user_id
);

  // Recalculate employee whenever originalEmployee changes
  const employee = useMemo(() => {
    if (!originalEmployee) return null;
    
    return {
      ...originalEmployee,
      emp_perms: new Set(originalEmployee?.emp_perms?.split(", ") ?? ["None"])
    };
  }, [originalEmployee]);


  // Get fields based on employee title
  const allInputFields = useMemo(() => {
    if (!employee?.emp_title) return inputs_info;
    return getFieldsForTitle(employee.emp_title);
  }, [employee?.emp_title]);


    
     // Define references at page level
  const inputsBoxsRef = useRef({});
  const checkBoxsRef = useRef({});
  const selectBoxsRef = useRef({});

  

  // Combine all references into one object
  const references = {
    inputsBoxsRef,
    checkBoxsRef,
    selectBoxsRef
  };

  
  useEffect(() => {
  if (!isIndexedDBLoaded || originalEmployee) return;
    
  fetch(`${process.env.APIKEY}/details/employee/${user_id}`, {
    mode: "cors",
    method: "GET",
    headers: {
      authorization: `BEARER ${user_data.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      statusNotification(res.status);
      return res.json();
    })
    .then((data) => {
      if (data && data.success && data.body) {
        setCached_Employees((prev) => {
  const updated = [...prev, data.body];

  return updated;
});
        userNotification("success", "Employee loaded successfully");
      } else {
        userNotification("error", "Employee not found");
      }
    })
    .catch((err) => {
      console.error("Error Fetching Employee", err);
      userNotification("error", "Error Fetching Employee");
    });
}, [isIndexedDBLoaded, originalEmployee, user_id, user_data.token]);



  /***************************************update_handler***************************************/
     function update_handler(e, url, token , fieldDefinitions) {
        e.preventDefault();
        // get updated user data and actions that were made
        let {updatedEmployeeData , actionString} = checkActionsMade(fieldDefinitions);


        const reqBody = {
                      modifier_id: user_data.user_id,
                      modifier_email:user_data.user_email,
                      other_user_email:employee.user_email,
                      ...updatedEmployeeData
                    }

          updateUserFetch( url, token, reqBody ,actionString );
        

        
      }
/***************************************checkActionsMade***************************************/
      function checkActionsMade(fieldDefinitions){
        const {inputs_info , select_def , check_box} = fieldDefinitions || {};
        let actions = [];
        let updatedEmployeeData = {};

        const employee_displayed_perms = employee.emp_perms;

    // ====================================================== Modify Employee Data ======================================================

       // === 1. Check for changes in general input fields

        // dynamic fields instead of static inputs_info
        if(inputs_info && inputs_info.length > 0){
          inputs_info.forEach((input_info) => {
            if (inputsBoxsRef.current[input_info.name] && !inputsBoxsRef.current[input_info.name].value) {
              userNotification("error", "Input fields cannot be empty");
              return;
            }
            
            else if (inputsBoxsRef.current[input_info.name] && 
                    (inputsBoxsRef.current[input_info.name].value !== employee[input_info.name])) {
              updatedEmployeeData[input_info.name] = inputsBoxsRef.current[input_info.name].value;
              if (!actions.includes("Modify Employee Data")) {
                actions.push("Modify Employee Data");
              }
            }
          });
        }
        

        

      //  ====================================================== Modify Employee Role ======================================================
        
        

          const roleName = select_def?.select_role_options?.name;
          const roleRef = selectBoxsRef?.current?.[roleName];
          const currentValue = employee?.[roleName];

          if (roleRef?.value !== undefined && roleRef.value !== currentValue) {
            updatedEmployeeData.other_user_new_role = roleRef.value;

            if (!actions.includes("Modify Employee Role")) {
              actions.push("Modify Employee Role");
            }
          }

      
      // ====================================================== Modify Permissions ======================================================
        
        let updated_emp_perms = [];
        let permModified = false; // Track if any permission was modified
          console.log("check_box",check_box)

        if(check_box && Object.keys(check_box).length > 0){
            check_box.perms_check_box.forEach((check_box_info) => {
              const isCurrentlyChecked = checkBoxsRef.current[check_box_info.name].checked;
              const wasPreviouslyChecked = employee_displayed_perms.has(check_box_info.value);
              
              // Check if permission state changed
              if (isCurrentlyChecked !== wasPreviouslyChecked) {
                  permModified = true; // Mark that permissions were modified
              }
              
              // Add to updated array if currently checked (scenarios 1 and 2)
              if (isCurrentlyChecked) {
                  updated_emp_perms.push(check_box_info.value);
              }
          });

          // Scenario 3: If all permissions were unchecked but some existed before
          // OR if any permission was changed in any way
          if (permModified || (updated_emp_perms.length === 0 && employee_displayed_perms.size > 0)) {
              if (!actions.includes("Modify Employee Perms")) {
                  actions.push("Modify Employee Perms");
              }
          }

          updatedEmployeeData.other_user_new_perms = updated_emp_perms.join(", ");
        }
        

      
        // Join actions array to form the action string
        let actionString = actions.join("-");

        return {
          updatedEmployeeData,
          actionString,
          
        };

    }

    async function confirmDeleteAccount() {
    setIsDeletingAccount(true);

    try {
      const query = new URLSearchParams({
        modifier_email: user_data.user_email,
        modifier_id: user_data.user_id,
        modifier_name: user_data.user_name,
        other_user_email: employee.user_email
      }).toString();
      const res = await fetch(
        `${process.env.APIKEY}/list/other/employee?${query}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user_data.token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        setIsDeletingAccount(false);
        deleteEmployeeFromStore(employee.user_id);
        return userNotification("error", data.message);
      }

      userNotification("success", "Account deleted successfully");
      router.replace("/");
    } catch (err) {
      console.error(err);
      userNotification("error", "Error deleting account");
      setIsDeletingAccount(false);
    }
  }
     

// Update your early returns:

const SpecificContentFields = MapToEmployeeDetails[employee?.emp_title] || (() => <></>)
if (!isIndexedDBLoaded) return <p>Loading cache...</p>;
if (!employee) return <p>Loading employee...</p>; // Better loading message

    


  const isAuthorizedToEdit = user_data.emp_perms && user_data.emp_perms.has("Modify Employee Data");
  const isAuthorizedToSeeSalary = user_data.emp_perms && (user_data.emp_perms.has("Modify Salary") || user_data.emp_perms.has("Display Salary"));
  const isAuthorizedToEditSalary = user_data.emp_perms && user_data.emp_perms.has("Modify Salary");


  return (
    <main className={styles["page-main"]}>
      
        <div className={"page-container"}>
          {/* --- Header --- */}
          <div className={"main-content"}>
            <div className={"avatar-wrapper"}>
              <Image
                priority={false}
                src={blobURL || "/avatar.jpg"}
                className={"avatar"}
                width="192"
                height="192"
                alt="User Profile Image"
              />
            </div>

            <div className={"user-info"}>
              <h1 className={"user-name"} id="user_name">{employee.user_name}</h1>
              <p className={styles["employee-position"]}>
                {`${employee.emp_title} | ${employee.emp_specialty}`}
              </p>
              <p><strong>Email:</strong> {employee.user_email}</p>
              <p><strong>Location:</strong> {employee.emp_address || "Not Specified"}</p>
              
            </div>
          </div>

          {/* --- Role-specific details --- */}
          <div className={"user-details"}>
            <ul className={styles["role-details"]}>
              <SpecificContentFields  user={employee}/>
              { isAuthorizedToSeeSalary && <> 
              <li><strong>Salary:</strong> {employee.emp_salary || 'N/A'}</li>
              <li><strong>Bonus:</strong> {employee.emp_bonus}</li> 
              </>}
              <li><strong>Absence:</strong> {employee.emp_abscence || 'N/A'}</li>
              <li><strong>Rating:</strong> {employee.emp_rate}</li>
               {/* Availability Schedule */}
              <li className={styles.availability_box}>
                <AvailabilityList availability_schedule={employee.availability_schedule}/>
              </li>
              <li><strong>Role:</strong> {employee.role_name || "NormalUser"}</li>
              <li className={styles.perms_box}><strong className={styles.perms_header}>Permissions </strong>
                        <div className={styles.perms_wrapper}>
                            {employee.emp_perms && employee.emp_perms[0] !== "None" ?(Array.from(employee.emp_perms).map((perm)=>{

                                return <span key={perm} className="perm">{perm}</span>
                                })) : "None"
                                  }
                          </div>
                </li>

              </ul>

            {/* --- Action Buttons --- */}
            <div className={styles["buttons-wrapper"]}>
             {isAuthorizedToEdit &&  <EditableSection buttonText="Edit Employee" buttonClassName="grey-button">
                <UpdateUserForm
                  url={`list/other/employee`}
                  user_displayed={employee}
                  currPage={currPage}
                  userData={user_data}
                  modifier_data={user_data}
                  references={references}
                  update_handler={update_handler}
                  fieldDefinitions={{select_def, inputs_info : allInputFields, check_box}}
                  token={user_data.token}
                />
              </EditableSection>}

              <ConfirmModal
                  open={showDeleteModal}
                  title="Delete Account"
                  message="This action will permanently delete your account and all associated data. This cannot be undone."
                  confirmText="Yes, delete"
                  cancelText="Cancel"
                  danger
                  isLoading={isDeletingAccount}
                  onConfirm={confirmDeleteAccount}
                  onCancel={() => setShowDeleteModal(false)}
                />
            </div>
          </div>
        </div>
      
    </main>
            
  );
  
}

export default private_routes(EmployeeDetailsPage);
