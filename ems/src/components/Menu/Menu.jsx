"use client";
import Link from 'next/link';
import styles from './menu.module.css';
import { menu } from '../../data';


function Menu(){
    return (
        <div className={styles['menu']}>
            { menu.map(function(item){
                return (
                <div className={styles["item"]} key={item.id}>
                <span className={styles['title']}>{item.title}</span>
                {item.listItems.map(function(list){
                    return (
                    <Link href={list.url} className = {styles["link"]} key={list.id}>
                    <ion-icon className={styles["list-icon"]} name={list.icon}></ion-icon>
                    <span className={styles["list-title"]}>{list.title}</span>
                    </Link>
                    )
                })
            }
            </div>
                )
            })
            }
        </div>
        
    )
}

export default Menu;