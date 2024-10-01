"use client";
import styles from "./nav.module.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useLogOut from "@/hooks/useLogOut";
import { useIsLoginContext } from "@/contexts/isLogin";

export default function Nav() {
    const [displayed, setDisplayed] = useState(false);
    const { isLogin } = useIsLoginContext();
    const logOut = useLogOut();
    const NAV_UL_REF = useRef();

    function handleBurger() {
        setDisplayed(prev => !prev);
    }

    // Add logic to show/hide nav based on screen width
    useEffect(() => {
        function resizeHandler() {
            if (window.innerWidth > 800) {
                setDisplayed(true); // Display full nav on larger screens
            } else {
                setDisplayed(false); // Hide full nav on smaller screens by default
            }
        }

        // Initial check
        resizeHandler();
        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);



 

    function handleLogOut() {
        logOut();
    }

    return (
        <nav className={styles.nav}>
            <div className={`wrapper ${styles["nav-wrapper"]}`}>
                <h1><Link   className={styles.logo} href="/">EMS</Link></h1>
                <ul
                    ref={NAV_UL_REF}
                    className={`${styles["nav-ul"]} ${displayed ? styles.displayed : ""}`}
                    style={{
                        opacity: displayed ? '1' : '0',
                        pointerEvents: displayed ? 'all' : 'none'
                    }}
                >
                
                    <li className={styles["nav-li"]}><Link href="/private_routes/registered-approve"><ion-icon name="add-outline"></ion-icon></Link></li>
                    <li className={styles["nav-li"]}><Link href="/private_routes/list"><ion-icon name="list-outline"></ion-icon></Link></li>
                    <li className={styles["nav-li"]}><Link href="/private_routes/mailer"><ion-icon name="mail-outline"></ion-icon></Link></li>
                    <li className={styles["nav-li"]}><Link href="/private_routes/dashboard"><ion-icon name="analytics-outline"></ion-icon></Link></li>
                    {isLogin ? (
                        <li className={styles["nav-li"]}><Link href="/private_routes/profile"><ion-icon name="person-outline"></ion-icon></Link></li>
                    ) : (
                        <li className="pink-button"><Link href="/login">Sign In</Link></li>
                    )}
                    {isLogin ? (
                        <li onClick={handleLogOut} className={`grey-button ${styles.logout}`}>Logout</li>
                    ) : (
                        <li className={`grey-button ${styles.logout}`}><Link href="/register">Sign Up</Link></li>
                    )}
                </ul>

                <div onClick={handleBurger} className={styles.burger}>
                    <span className={styles.bars}></span>
                    <span className={styles.bars}></span>
                    <span className={styles.bars}></span>
                </div>
            </div>
        </nav>
    );
}
