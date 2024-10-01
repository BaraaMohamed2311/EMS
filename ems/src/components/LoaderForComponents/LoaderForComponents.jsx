import styles from "./loader.module.css"

export default function LoaderForComponents({styling}) {
    return (
        <div className={styling}>
            <div className={styles.loader}></div>
        </div>
       
    )
}