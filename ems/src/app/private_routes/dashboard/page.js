"use client";
import { useEffect, useRef, useState } from "react";
import private_routes from "../page";
import styles from "./dashboard.module.css";
import { useUserDataContext } from "@/contexts/user_data";
import userNotification from "@/utils/userNotification";
import statusNotification from "@/utils/statusNotification";
import MoneyShortner from "@/utils/MoneyShortner";


function DashboardPage() {
    const { user_data } = useUserDataContext();
    const [displayedData, setDisplayedData] = useState({});
    let chart = useRef(null);
    // Set up dynamic import inside useEffect
    useEffect(() => {
        chart.current = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title:{
                text: "Yearly Profit"
            },
            axisX:{
                valueFormatString: "DD MMM",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY: {
                title: "Closing Price (in M$)",
                valueFormatString: "$##0.00",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    labelFormatter: function(e) {
                        return "$" + CanvasJS.formatNumber(e.value, "##0.00");
                    }
                }
            },
            data: [{
                type: "area",
                xValueFormatString: "DD MMM",
                yValueFormatString: "$##0.00",
                dataPoints: [
                    { x: new Date(2016, 6, 2), y: 75.459999 },
                    { x: new Date(2016, 6, 3), y: 76.011002 },
                    { x: new Date(2016, 6, 4), y: 75.751999 },
                    { x: new Date(2016, 6, 5), y: 77.500000 },
                    { x: new Date(2016, 6, 8), y: 77.436996 },
                    { x: new Date(2016, 6, 9), y: 79.650002 },
                    { x: new Date(2016, 6, 10), y: 79.750999 },
                    { x: new Date(2016, 6, 11), y: 80.169998 },
                    { x: new Date(2016, 6, 12), y: 79.570000 },
                    { x: new Date(2016, 6, 15), y: 80.699997 },
                    { x: new Date(2016, 6, 16), y: 79.686996 },
                    { x: new Date(2016, 6, 17), y: 78.996002 },
                    { x: new Date(2016, 6, 18), y: 78.899002 },
                    { x: new Date(2016, 6, 19), y: 77.127998 },
                    { x: new Date(2016, 6, 22), y: 76.759003 },
                    { x: new Date(2016, 6, 23), y: 77.480003 },
                    { x: new Date(2016, 6, 24), y: 77.623001 },
                    { x: new Date(2016, 6, 25), y: 76.408997 },
                    { x: new Date(2016, 6, 26), y: 76.041000 },
                    { x: new Date(2016, 6, 29), y: 76.778999 },
                    { x: new Date(2016, 6, 30), y: 78.654999 },
                    { x: new Date(2016, 6, 31), y: 77.667000 }
                ]
            }]
        });
        chart.current.render();
        
    }, []);

    

    useEffect(() => {
        fetch(`${process.env.APIKEY}/dashboard/main`, {
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `BEARER ${user_data.token}`
            }
        })
        .then((res) => {
            statusNotification(res.status);
            return res.json();
        })
        .then((data) => {
            if (data && data.success) {
                setDisplayedData(data.body);
            } else {
                userNotification("error", "Failed To Fetch Dashboard Data");
            }
        })
        .catch((err) => {
            userNotification("error", "Error Fetching Dashboard Data");
            console.error("Error Fetching Dashboard Data: ", err);
        });
    }, [user_data.token]);

    

    return (
        <main className={`${styles.dashboardContainer} wrapper`}>
            <div className={styles.analyticsGrid}>
                <div className={styles.analyticsBox}>
                    <h2>Total Users</h2>
                    <p className={styles.analyticsValue}>{displayedData.numOfEmployees}</p>
                </div>
                <div className={styles.analyticsBox}>
                    <h2>Super Admins</h2>
                    <p className={styles.analyticsValue}>{displayedData.numOfSuperAdmins}</p>
                </div>
                <div className={styles.analyticsBox}>
                    <h2>Admins</h2>
                    <p className={styles.analyticsValue}>{displayedData.numOfAdmins}</p>
                </div>
                <div className={styles.analyticsBox}>
                    <h2>Absence Rate</h2>
                    <p className={styles.analyticsValue}>{displayedData.totalAbscence}</p>
                </div>
                <div className={styles.analyticsBox}>
                    <h2>Total Salaries Paid</h2>
                    <p className={styles.analyticsValue}>{MoneyShortner(displayedData.totalSalariesPaid)}</p>
                </div>
                <div className={styles.analyticsBox}>
                    <h2>Total Bonus</h2>
                    <p className={styles.analyticsValue}>{MoneyShortner(displayedData.totalBonusPaid)}</p>
                </div>
                
                <div id="chartContainer" className={styles.chartContainer}></div>
            </div>
        </main>
    );
}

export default private_routes(DashboardPage);
