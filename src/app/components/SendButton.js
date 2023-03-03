import React from "react"

export default function SendButton({icon}){
    return(
        <div className="contain-button">
            <span className="button-send">
                {icon}
            </span>
        </div>  
    )
}