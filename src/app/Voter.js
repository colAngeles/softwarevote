import React from "react";
import ReactDOM from "react-dom/client";
import SliderBar from   "./components/SliderBar";
import styles from "./css/voter.module.css"
import Signinvoter from "./components/SignInVoter"
export default function MainSection(){
    return (
        <>
            <div className={styles["slider-container"]}>
                <SliderBar />
            </div>
            <div className={styles['main-section-container']}>
                <Signinvoter />
            </div>
        </>
        
    )
} 
let root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainSection />);