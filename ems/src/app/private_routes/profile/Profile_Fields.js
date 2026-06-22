import pickRoleIcon  from "@/utils/pickRoleIcon";
import Link from "next/link";
import MoneyShortner from "@/utils/MoneyShortner"
import styles from "./profile.module.css"
import Image from "next/image";
import { useRef, useState } from "react";
import ProfileEditManager from "@/components/ProfileEditManager/ProfileEditManager";
import PermsList from "@/components/PermsList/PermsList"
import { selfEditableFields , approvalRequiredFields } from "./data";
// ==================================================
//            Rendering helpers
// ==================================================

const AvailabilityList = ({availability_schedule})=>{

  return (<>
  {/* Availability Schedule */}

                <strong className={styles.availability_header}>Availability</strong>
                <div className={styles.availability_wrapper}>
                  {availability_schedule ? (
                    availability_schedule.split("; ").map((schedule) => {
                      const [dayIndex, timeRange] = schedule.split(": ");
                      const [startTime, endTime] = timeRange.split("-");
                      const days = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 0: "Sun"};
                      
                      return (
                        <div key={dayIndex} className={styles.schedule_item}>
                          <span className={styles.day}>{days[dayIndex] || `Day ${dayIndex}`}</span>
                          <span className={styles.time}>{startTime} - {endTime}</span>
                        </div>
                      );
                    })
                  ) : "No schedule available"}
                </div>

  </>)
}


// ===================================================
//            Specific Fields Components
// ===================================================
// ===================================================
//            Doctor
const DoctorProfile = ({ user_data, permissions }) => {
  const inputsBoxsRef = useRef({})

  return (
    <>
      <div className={"user-info"}>
        <h1 className={"user-name"} id="user_name">{user_data.user_name}</h1>
        <p className={styles["profile-position"]}>
          {`${user_data.emp_title} | ${user_data.emp_specialty}`}
        </p>
        <p><strong>Email:</strong> {user_data.user_email}</p>
        <p><strong>Consultation Price:</strong> {MoneyShortner(user_data.initial_consultation_price)}</p>
        <p><strong>Follow-up Price:</strong> {MoneyShortner(user_data.followup_consultation_price)}</p>
        <p><strong>Experience:</strong> {user_data.years_of_exp} years</p>
      </div>

    <div className="further-info-wrapper">
      <div className={"details-card"}>
        <ul className={"clean-list"}>
          <li><strong>Salary:</strong> {MoneyShortner(user_data.emp_salary)}</li>
          <li><strong>This Month Bonus:</strong> {MoneyShortner(user_data.emp_bonus)}</li>
          <li><strong>This Month Absence:</strong> {user_data.emp_abscence}</li>

          <li className={styles.role_box}>
            <strong>Role:</strong> {user_data.role_name}
            <Image src={pickRoleIcon(user_data.role_name)} width={30} height={30} alt="doctor role" />
          </li>

          <li className={styles.availability_box}>
            <AvailabilityList availability_schedule={user_data.availability_schedule} />
          </li>

          <li className={styles.perms_box}>
            <PermsList permissions={permissions} />
          </li>
        </ul>
      </div>

      <ProfileEditManager
        role="doctor"
        userData={user_data}
        references={{ inputsBoxsRef }}
        selfEditableFields={selfEditableFields} 
        approvalRequiredFields={approvalRequiredFields}
        
      />
      </div>
    </>
  );
};

// ===================================================
//            Surgeon
const SurgeonProfile = ({ user_data, permissions }) => {
  const inputsBoxsRef = useRef({})
  return (
    <>
      <div className={"user-info"}>
        <h1 className={"user-name"} id="user_name">{user_data.user_name}</h1>
        <p className={styles["profile-position"]}>
          {`${user_data.emp_title} | ${user_data.emp_specialty}`}
        </p>
        <p><strong>Email:</strong> {user_data.user_email}</p>
        <p><strong>Surgery Price:</strong> {MoneyShortner(user_data.surgery_price)}</p>
        <p><strong>Follow-up Price:</strong> {MoneyShortner(user_data.followup_consultation_price)}</p>
        <p><strong>Experience:</strong> {user_data.years_of_exp} years</p>
      </div>

    <div className="further-info-wrapper">
      <div className={"details-card"}>
          <ul className={"clean-list"}>
            <li><strong>Salary:</strong> {MoneyShortner(user_data.emp_salary)}</li>
            <li><strong>This Month Bonus:</strong> {MoneyShortner(user_data.emp_bonus)}</li>
            <li><strong>This Month Absence:</strong> {user_data.emp_abscence}</li>

            <li className={styles.role_box}>
              <strong>Role:</strong> {user_data.role_name}
              <Image src={pickRoleIcon(user_data.role_name)} width={30} height={30} alt="surgeon role" />
            </li>

            <li className={styles.availability_box}>
              <AvailabilityList availability_schedule={user_data.availability_schedule} />
            </li>

            <li className={styles.perms_box}>
              <PermsList permissions={permissions} />
            </li>
          </ul>
        </div>

        <ProfileEditManager
          role="surgeon"
          userData={user_data}
          references={{ inputsBoxsRef }}
          selfEditableFields={selfEditableFields} 
          approvalRequiredFields={approvalRequiredFields}
        />
      </div>
    </>
  );
};

// ===================================================
//            Nurse
const NurseProfile = ({ user_data, permissions }) => {
  const inputsBoxsRef = useRef({})
  return (
    <>
      <div className={"user-info"}>
        <h1 className={"user-name"} id="user_name">{user_data.user_name}</h1>
        <p className={styles["profile-position"]}>
          {`${user_data.emp_title} | ${user_data.emp_specialty}`}
        </p>
        <p><strong>Email:</strong> {user_data.user_email}</p>
        <p><strong>Shift:</strong> {user_data.shift_type}</p>
        <p><strong>Department:</strong> {user_data.department}</p>
        <p><strong>Experience:</strong> {user_data.years_of_exp} years</p>
      </div>

    <div className="further-info-wrapper">
      <div className={"details-card"}>
        <ul className={"clean-list"}>
          <li><strong>Salary:</strong> {MoneyShortner(user_data.emp_salary)}</li>
          <li><strong>This Month Bonus:</strong> {MoneyShortner(user_data.emp_bonus)}</li>
          <li><strong>This Month Absence:</strong> {user_data.emp_abscence}</li>

          <li className={styles.role_box}>
            <strong>Role:</strong> {user_data.role_name}
            <Image src={pickRoleIcon(user_data.role_name)} width={30} height={30} alt="nurse role" />
          </li>

          <li className={styles.availability_box}>
            <AvailabilityList availability_schedule={user_data.availability_schedule} />
          </li>

          <li className={styles.perms_box}>
            <PermsList permissions={permissions} />
          </li>
        </ul>
      </div>

      <ProfileEditManager
        role="nurse"
        userData={user_data}
        references={{ inputsBoxsRef }}
        selfEditableFields={selfEditableFields} 
        approvalRequiredFields={approvalRequiredFields}
      />
    </div>
    </>
  );
};

// ===================================================
//            Employee (Default)
// ===================================================
const EmployeeProfile = ({ user_data, permissions }) => {
  const inputsBoxsRef = useRef({});

  return (
    <>
      <div className={"user-info"}>
        <h1 className={"user-name"} id="user_name">{user_data.user_name}</h1>
        <p className={styles["profile-position"]}>
          {`${user_data.emp_title || "Employee"} | ${user_data.emp_specialty || "General"}`}
        </p>
        <p><strong>Email:</strong> {user_data.user_email}</p>
        <p><strong>Location:</strong> {user_data.emp_address || "Not Specified"}</p>
        <p><strong>Member Since:</strong> {user_data.emp_joined || "Not Specified"}</p>
      </div>

      <div className="further-info-wrapper">
        <div className={"details-card"}>
          <ul className={"clean-list"}>
            <li><strong>Salary:</strong> {MoneyShortner(user_data.emp_salary)}</li>
            <li><strong>This Month Bonus:</strong> {MoneyShortner(user_data.emp_bonus)}</li>
            <li><strong>This Month Absence:</strong> {user_data.emp_abscence}</li>

            <li className={styles.role_box}>
              <strong>Role:</strong> {user_data.role_name}
              <Image
                src={pickRoleIcon(user_data.role_name)}
                width={30}
                height={30}
                alt="employee role"
              />
            </li>

            <li className={styles.availability_box}>
              <AvailabilityList availability_schedule={user_data.availability_schedule} />
            </li>

            <li className={styles.perms_box}>
              <PermsList permissions={permissions} />
            </li>
          </ul>
        </div>

        <ProfileEditManager
          role="employee"
          userData={user_data}
          references={{ inputsBoxsRef }}
          selfEditableFields={selfEditableFields}
          approvalRequiredFields={approvalRequiredFields}
        />
      </div>
    </>
  );
};



// Role mapping object
export const profileComponents = {
  doctor: DoctorProfile,
  surgeon: SurgeonProfile,
  nurse: NurseProfile,
  employee: EmployeeProfile, // default

};