import React from "react";
import styles from "../css/input.module.css";

export default function Input({ sx={color: '#fff'}, type='text', variant='', name='text', placeholder, defaultValue='C.C.', bkLab}) {
    if (variant == 'doc') {
        return (
            <span className={`${styles["input-container"]} ${styles["identification"]}`} style={{...sx}}>
                <input id={name} type={type} name={name}  required />
                <select id={`${name}type`} name={`${name}type`} defaultValue={defaultValue}>
                    <option value="C.C.">C.C.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="NUIP">NUIP</option>
                    <option value="PASAPORTE">PASAPORTE</option>
                    <option value="R.C.">R.C.</option>
                    <option value="T.I.">T.I.</option>
                </select>
                <label  htmlFor={name} style={{backgroundColor: bkLab ? bkLab : 'rgb(11, 15, 25)'}}>{placeholder}</label>
            </span>
        )
    }
    
    return (
        <span className={styles["input-container"]} style={{...sx}}>
            <input id={name} type={type} name={name}  required />
            <label  htmlFor={name} style={{backgroundColor: bkLab ? bkLab : 'rgb(11, 15, 25)'}}>{placeholder}</label>
        </span>
    )
}