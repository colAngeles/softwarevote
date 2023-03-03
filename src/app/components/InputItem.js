import React from 'react'
// import PropTypes from "prop-types"

export default function InputItem(props){
    return(
        <div className="content-input">
            <textarea className='input-item' name={props.name} id={props.id} cols="1" rows="1" placeholder={props.placeholder} spellCheck="false"></textarea>
        </div>
    )
}
// InputItem.propTypes = {
//     name: PropTypes.string
// }
