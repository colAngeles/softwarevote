import React from "react";
import styles from '../css/card.module.css'
import SendButton from "./SendButton"
export default function Card(){
        const $buttonin = document.querySelector('.button-send')
        window.onload = () => {
            const $buttonin = document.querySelector('.contain-button')
            const $card = document.querySelectorAll('.box')
            const formData = new FormData()
            $buttonin.addEventListener('click', () => {
                if(formData.get('id') == null || formData.get('answer') == null){
                    alert('Hay un error con el envío del formualrio, la página se recargará una vez más')
                    window.location.href = window.origin
                }
                fetch('/procesar', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if(data.refused){
                        alert(data.error)
                        alert('Hay un error con el envío del formualrio, la página se recargará una vez más')
                        window.location.href = window.origin
                    }
                    else{
                        window.location.href = `${window.origin}/${data.url}`
                    }
                })
            })
            for(let i in $card){
                    $card[i].addEventListener('click', () => {
                        formData.set('id', $card[i].dataset.value)
                        formData.set('answer', $card[i].dataset.id)
                        if(i == 0){
                            let $checkbox1 = $card[0].querySelector('.checkbox')
                            $checkbox1.classList.remove(`${styles['hidden']}`)
                            let $checkbox2 = $card[1].querySelector('.checkbox')
                            $checkbox2.classList.add(`${styles['hidden']}`)
                            let $checkbox3 = $card[2].querySelector('.checkbox')
                            $checkbox3.classList.add(`${styles['hidden']}`)
                            let $checkbox4 = $card[3].querySelector('.checkbox')
                            $checkbox4.classList.add(`${styles['hidden']}`)
                            let $checkbox5 = $card[4].querySelector('.checkbox')
                            $checkbox5.classList.add(`${styles['hidden']}`)
                            let $checkbox6 = $card[5].querySelector('.checkbox')
                            $checkbox6.classList.add(`${styles['hidden']}`)
                        }
                        else if(i == 1){
                            let $checkbox1 = $card[1].querySelector('.checkbox')
                            $checkbox1.classList.remove(`${styles['hidden']}`)
                            let $checkbox2 = $card[0].querySelector('.checkbox')
                            $checkbox2.classList.add(`${styles['hidden']}`)
                            let $checkbox3 = $card[2].querySelector('.checkbox')
                            $checkbox3.classList.add(`${styles['hidden']}`)
                            let $checkbox4 = $card[3].querySelector('.checkbox')
                            $checkbox4.classList.add(`${styles['hidden']}`)
                            let $checkbox5 = $card[4].querySelector('.checkbox')
                            $checkbox5.classList.add(`${styles['hidden']}`)
                            let $checkbox6 = $card[5].querySelector('.checkbox')
                            $checkbox6.classList.add(`${styles['hidden']}`)
                        }
                        else if(i == 2){
                            let $checkbox1 = $card[2].querySelector('.checkbox')
                            $checkbox1.classList.remove(`${styles['hidden']}`)
                            let $checkbox2 = $card[0].querySelector('.checkbox')
                            $checkbox2.classList.add(`${styles['hidden']}`)
                            let $checkbox3 = $card[1].querySelector('.checkbox')
                            $checkbox3.classList.add(`${styles['hidden']}`)
                            let $checkbox4 = $card[3].querySelector('.checkbox')
                            $checkbox4.classList.add(`${styles['hidden']}`)
                            let $checkbox5 = $card[4].querySelector('.checkbox')
                            $checkbox5.classList.add(`${styles['hidden']}`)
                            let $checkbox6 = $card[5].querySelector('.checkbox')
                            $checkbox6.classList.add(`${styles['hidden']}`)
                        }
                        else if(i == 3){
                            let $checkbox1 = $card[3].querySelector('.checkbox')
                            $checkbox1.classList.remove(`${styles['hidden']}`)
                            let $checkbox2 = $card[0].querySelector('.checkbox')
                            $checkbox2.classList.add(`${styles['hidden']}`)
                            let $checkbox3 = $card[1].querySelector('.checkbox')
                            $checkbox3.classList.add(`${styles['hidden']}`)
                            let $checkbox4 = $card[2].querySelector('.checkbox')
                            $checkbox4.classList.add(`${styles['hidden']}`)
                            let $checkbox5 = $card[4].querySelector('.checkbox')
                            $checkbox5.classList.add(`${styles['hidden']}`)
                            let $checkbox6 = $card[5].querySelector('.checkbox')
                            $checkbox6.classList.add(`${styles['hidden']}`)
                        }
                        else if(i == 4){
                            let $checkbox1 = $card[4].querySelector('.checkbox')
                            $checkbox1.classList.remove(`${styles['hidden']}`)
                            let $checkbox2 = $card[1].querySelector('.checkbox')
                            $checkbox2.classList.add(`${styles['hidden']}`)
                            let $checkbox3 = $card[2].querySelector('.checkbox')
                            $checkbox3.classList.add(`${styles['hidden']}`)
                            let $checkbox4 = $card[3].querySelector('.checkbox')
                            $checkbox4.classList.add(`${styles['hidden']}`)
                            let $checkbox5 = $card[0].querySelector('.checkbox')
                            $checkbox5.classList.add(`${styles['hidden']}`)
                            let $checkbox6 = $card[5].querySelector('.checkbox')
                            $checkbox6.classList.add(`${styles['hidden']}`)
                        }
                        else if(i == 5){
                            let $checkbox1 = $card[5].querySelector('.checkbox')
                            $checkbox1.classList.remove(`${styles['hidden']}`)
                            let $checkbox2 = $card[1].querySelector('.checkbox')
                            $checkbox2.classList.add(`${styles['hidden']}`)
                            let $checkbox3 = $card[2].querySelector('.checkbox')
                            $checkbox3.classList.add(`${styles['hidden']}`)
                            let $checkbox4 = $card[3].querySelector('.checkbox')
                            $checkbox4.classList.add(`${styles['hidden']}`)
                            let $checkbox5 = $card[0].querySelector('.checkbox')
                            $checkbox5.classList.add(`${styles['hidden']}`)
                            let $checkbox6 = $card[4].querySelector('.checkbox')
                            $checkbox6.classList.add(`${styles['hidden']}`)
                        }
                    
                })
                
            }
            $form.addEventListener('submit', (event) => {
                event.preventDefault()
            })
        }
        
    return(
        <>      
            <div className={styles["main-container"]}>
                <form>
                        <div className={`${styles["container-box"]} ${styles["box-one"]} box`} data-name="answer" data-id="choice_1" data-value="1">
                             <div className={`${styles['over']} checkbox ${styles['hidden']}`}><i class="fa fa-check" aria-hidden="true"></i></div>
                        </div>
                        <div className={`${styles["container-box"]} ${styles["box-two"]} box`} data-name="answer" data-id="choice_2" data-value="2">
                             <div className={`${styles['over']} checkbox ${styles['hidden']}`}><i class="fa fa-check" aria-hidden="true"></i></div>
                        </div>
                        <div className={`${styles["container-box"]} ${styles["box-three"]} box`} data-name="answer" data-id="choice_3" data-value="3">
                            <div className={`${styles['over']} checkbox ${styles['hidden']}`}><i class="fa fa-check" aria-hidden="true"></i></div>
                        </div>
                        <div className={`${styles["container-box"]} ${styles["box-four"]} box`} data-name="answer" data-id="choice_4" data-value="4">
                        <div className={`${styles['over']} checkbox ${styles['hidden']}`}><i class="fa fa-check" aria-hidden="true"></i></div>
                        </div>
                        <div className={`${styles["container-box"]} ${styles["box-five"]} box`} data-name="answer" data-id="choice_5" data-value="5">
                             <div className={`${styles['over']} checkbox ${styles['hidden']}`}><i class="fa fa-check" aria-hidden="true"></i></div>
                        </div>
                        <div className={`${styles["container-box"]} ${styles["box-six"]} box`} data-name="answer" data-id="choice_6" data-value="0">
                             <div className={`${styles['over']} checkbox ${styles['hidden']}`}><i class="fa fa-check" aria-hidden="true"></i></div>
                        </div>
                </form>
                <button id={styles["send"]}>
                    <SendButton icon={<i className="fa fa-paper-plane" aria-hidden="true"></i>} msg=""/>
                </button>
                </div>
        </>
    )
}