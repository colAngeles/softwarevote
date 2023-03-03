import React from 'react'
import styles from '../css/card.module.css'
export default function ExitButton(){
    const exit = ()=>{
        const conf = confirm('¿Estás seguro que deseas terminar el juego?')
        if(conf){
            alert('Tu puntaje será guardado')
            let $gameScore = document.getElementById('gameScore').value.split(':')[1]
            let $globalScore = document.getElementById('globalScore').value.split(':')[1]
            let score = parseInt($gameScore) + parseInt($globalScore)
            let formData = new FormData()
            formData.set('score', score)
            fetch('/savedata', {
                method: 'POST',
                body: formData,
            })
            .then((data) => data.json())
            .then(data => {
                if(data.conf){
                    window.location.href = `${window.origin}`
                }
                else{
                    console.log(data)
                }
            })

            
        }
    }
    return(
        <>
            <div className={styles['contain-exit']}>
                <i className="fa fa-sign-out" aria-hidden="true" onClick={exit}></i>
            </div>
        </>
    )
}