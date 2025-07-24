"use client";
import Image from "next/image";
import styles from "./home.module.css";
import Footer from "@/components/Footer/Footer";
import { useEffect } from "react";

export default function Home() {
  // useClosure to create debouncer to limit number of execution
    function debounce(callback, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                callback.apply(this, args);
            }, delay);
        };
    }

    useEffect(() => {
        const roles_cards = document.querySelectorAll(".role-cards");
        const debouncedHandleMouseMoveGlow = debounce(handleMouseMoveCircle, 200);

        roles_cards.forEach((role_card) => {
            role_card.addEventListener("pointermove", debouncedHandleMouseMoveGlow);
        });

        return () => {
            roles_cards.forEach((role_card) => {
                role_card.removeEventListener("pointermove", debouncedHandleMouseMoveGlow);
            });
        };
    }, []);

    function handleMouseMoveCircle(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.target.style.setProperty("--x", `${x}px`);
        e.target.style.setProperty("--y", `${y}px`);
    }

    return (
        <>
            <main className={styles["home-main"]}>
                <div className={styles["wrapper"]}>
                    <div className={styles["left-box"]}>
                        <h2 className="home-main-h1">Employees Management System</h2>
                        <p className="home-main-p">
                            Made to let you manage everything smoothly & easily, but also efficiently.
                        </p>
                        <p className="home-main-p">
                            It&apos;s a management system where Super Admin can assign suitable roles for the others,
                            <br /> to get the job done and track the progress of his employees.
                        </p>
                    </div>
                    <div className={styles["right-box"]}>
                        <Image
                            className="home-main-img"
                            priority={true}
                            src={"/busunessman2.svg"}
                            width={600}
                            height={500}
                            alt="Main Section Home Page Image"
                        />
                    </div>
                </div>
            </main>

            <section className={styles["roles-section"]}>
                <div className={styles["wrapper"]}>
                    <div className={`${styles["role-box"]} role-cards`}>
                        <Image
                            priority={false}
                            className={styles["role-image"]}
                            src={"/Admin.svg"}
                            width={100}
                            height={100}
                            alt="EMS Role Image"
                        />
                        <div className={styles["role-text"]}>
                            <h2 className={styles["role-text-h2"]}>Admin Role</h2>
                        </div>
                        <ul className={styles["role-perms"]}>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Track His Progress
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Edit Users Data With Same Role Or Lower
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Access Dashboard
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="close-outline"></ion-icon> Cannot Modify Other Users Roles
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="close-outline"></ion-icon> Cannot Modify Other Users Perms
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="close-outline"></ion-icon> Cannot Access nor Modify Other Users Salary
                            </li>
                        </ul>
                    </div>

                    <div className={`${styles["role-box"]} role-cards role-box_long-left`}>
                        <Image
                            priority={false}
                            className={styles["role-image"]}
                            src={"/SuperAdmin.svg"}
                            width={100}
                            height={100}
                            alt="EMS Role Image"
                        />
                        <div className={styles["role-text"]}>
                            <h2 className={styles["role-text-h2"]}>Super Admin Role</h2>
                        </div>
                        <ul className={styles["role-perms"]}>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Track His Progress
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Edit All Users Data
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Access Dashboard
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Modify Other Users Roles
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Modify Other Users Permissions
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Can Access & Modify Other Users Salary
                            </li>
                        </ul>
                    </div>

                    <div className={`${styles["role-box"]} role-cards role-box_long-right`}>
                        <Image
                            priority={false}
                            className={styles["role-image"]}
                            src={"/Employee.svg"}
                            width={100}
                            height={100}
                            alt="EMS Role Image"
                        />
                        <div className={styles["role-text"]}>
                            <h2 className={styles["role-text-h2"]}>Employee Role</h2>
                        </div>
                        <ul className={styles["role-perms"]}>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="checkmark-outline"></ion-icon> Only Can Track His Progress
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="close-outline"></ion-icon> Cannot Access nor Modify Other Users
                            </li>
                            <li className={`role-box_opacity`}>
                                <ion-icon name="close-outline"></ion-icon> Cannot Access Dashboard
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
