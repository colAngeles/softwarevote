import React from "react"
import styles from '../css/loader.module.css'
export default function Loader(){
    return(
        <div className={styles['background-load']}>
            <div className={styles['content-load']}>
                <div className={`${styles['circule']} ${styles['circule-one']}`}>
                    Loading
                    <b>.</b>
                    <b>.</b> 
                    <b>.</b>
                </div>
                <div className={`${styles['circule']} ${styles['circule-two']}`}> 
                </div>
            </div>
        </div>
    )
}