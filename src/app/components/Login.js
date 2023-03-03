import React, { useState } from "react";
import InputItem from './InputItem'
import SendButton from './SendButton'

export default function Login(){
    const [section, setSection] = useState('12')
    
    window.addEventListener('DOMContentLoaded', () => {
        console.log("start")
        fetch('/sections')
        .then(res => res.json())
        .then(data => {
            if(data.refused){
            console.log(data.error) 
            }
            else{
                setSection(data.data)
            }
            
        })   
        const $form = document.getElementById('formdata')
        const $eye = document.getElementById('showText')
        const $buttonin = document.querySelector('.button-send')
        const $alert = document.querySelector('.alert')
        const $choice1 = document.getElementById("section_1")
        const $choice2 = document.getElementById("section_2")
        const $labelChoice1 = document.querySelectorAll(".input-choice + label")[0]
        const $labelChoice2 = document.querySelectorAll(".input-choice + label")[1]
        
        $choice1.addEventListener('focus', () => {
            $labelChoice1.style.color = "#F7901E"
            $labelChoice2.style.color = "white"
        })
        $choice2.addEventListener('focus', () => {
            $labelChoice1.style.color = "white"
            $labelChoice2.style.color = "#F7901E"
        })

        $eye.addEventListener('click', () => {
            $eye.classList.toggle('show-text')
        })
        $buttonin.addEventListener('click', () => {
            const formData = new FormData($form)
            const username = formData.get('username')
            const pass = formData.get('userpass')
            let conf = formData.get('section') || null
            if(username == '' || pass == '' || conf == null){
                        $alert.textContent = 'Por favor completa todos los campos'
                        $alert.style.color = 'red'
                        $alert.classList.remove('hidden')
                        setTimeout(() => {
                            $alert.classList.add('hidden')
                        }, 10000);
            }
            else {
                fetch('/login', {
                    method: 'POST',
                    body: formData,
                })
                .then(res => res.json())
                .then(data => {
                    if(data.refused){
                        $alert.textContent = data.error
                        $alert.classList.remove('hidden')
                        setTimeout(() => {
                            $alert.classList.add('hidden')
                        }, 5000);
                    }
                    else{
                        window.location.href = `${window.origin}/${data.url}`
                    }
                })
            }
        })
            

        $form.addEventListener('submit', (event) => {
            event.preventDefault()
        })
    })
    window.onload = () => {
        let load = document.querySelector(`.${document.body.classLoad}`)
        load.classList.add('hide-load')
    }
     
    return(
        <div className="main-container">
            <form id="formdata" method="post" action='/login'>
                <input type="hidden" value="{{token}}"/>
                <p className="alert hidden">Por favor completa todos los campos</p>
                <InputItem name="username" id="username" placeholder="Nombre del usuario"/>
                <div className="content-input">
                    <input className='input-item password' type="password" name="userpass" placeholder="Ingresa tu PIN"/>
                    <span className="unmask-eye show-text" id="showText" style={{display: "inline-block"}}></span>
                </div>
                <div className="section">
                    <input className="input-choice" type="radio" name="section" id="section_1" value={section[0].sectionname}/>
                    <label htmlFor="section_1">&nbsp;{section[0].sectionname}</label>
                    <br/>
                    <input className="input-choice" type="radio" name="section" id="section_2" value={section[1].sectionname}/>
                    <label htmlFor="section_1">&nbsp;{section[1].sectionname}</label>
                </div>
                <div>
                <button>
                  <SendButton icon={<i className="fa fa-paper-plane" aria-hidden="true"></i>} msg=""/>
                </button>
                </div>
                
            </form>
        </div>
    )}
