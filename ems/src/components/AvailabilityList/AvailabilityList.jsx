
import styles from "./AvailabilityList.module.css"
import { to12Hour , convertTimeUTCToLocal} from '@/utils/Date/timeHelpers';

const AvailabilityList = ({availability_schedule})=>{
  return (<>
  {/* Availability Schedule */}

                <strong className={styles.availability_header}>Availability</strong>
                <div className={styles.availability_wrapper}>
                  {availability_schedule && availability_schedule !== "None" ? (
                    availability_schedule.split("; ").map((schedule) => {
                      const [dayIndex, timeRange] = schedule.split(": ");
                      const [startTime, endTime] = timeRange.split("-");
                      const days = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 0: "Sun"};
                      const startTime_local = to12Hour(convertTimeUTCToLocal(startTime));
                      const endTime_local = to12Hour(convertTimeUTCToLocal(endTime));
                      return (
                        <div key={dayIndex} className={styles.schedule_item}>
                          <span className={styles.day}>{days[dayIndex] || `Day ${dayIndex}`}</span>
                          <span className={styles.time}>{startTime_local} - {endTime_local}</span>
                        </div>
                      );
                    })
                  ) : "No schedule available"}
                </div>

  </>)
}

export default AvailabilityList;