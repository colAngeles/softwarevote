import React from "react"
import styles from '../css/load.module.css'
export default function Loading(){
    document.body.classLoad = styles['content-load']
    return(
        <div class={styles['content-load']}>
            <div class={`${styles['circule']} ${styles['circule-one']}`}>
                Loading
                <b>.</b>
                <b>.</b> 
                <b>.</b>
            </div>
            <div class={`${styles['circule']} ${styles['circule-two']}`}> 
        </div>
    </div>
    )
}