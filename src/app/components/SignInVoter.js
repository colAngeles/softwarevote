import React, { useEffect, useState } from "react";
import InputItem from "./InputItem";
import SendButton from './SendButton';
import Alert from '@mui/material/Alert';
import Collapse from "@mui/material/Collapse";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Loader from './Loader';

export default function Voters(){
    let [infoContent, setInfocontent] = useState('');
    let [open, setOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    useEffect(() =>  {
        const $form = document.getElementById('formdata')
        const $buttonin = document.querySelector('.button-send')
        const $alert = document.querySelector('.alert')
        let load = document.querySelector(`.${document.body.classLoad}`)
        $buttonin.addEventListener('click', () => {
            const formData = new FormData($form)
            const username = formData.get('username')
            if(username == ''){
                        $alert.textContent = 'Por favor, ingresa tu nombre de usuario'
                        $alert.style.color = 'red'
                        $alert.classList.remove('hidden')
                        setTimeout(() => {
                            $alert.classList.add('hidden')
                        }, 10000);
            }
            else {
                setLoading(true);
                fetch('/signin-voter', {
                    method: 'POST',
                    body: formData,
                })
                .then(res => res.json())
                .then(data => {
                    if(data.refused){
                        setLoading(false);
                        setInfocontent({infoType: 'error', title: '', message: data.error});
                        setOpen(true);
                    }
                    else if (data.success) {
                        window.location.href = `${window.origin}/virtual-polling-station`
                    }
                    else if (data.redirect) {
                        window.location.href = `${window.origin}/${data.url}`
                    }
                })
                .catch(e => {
                    setLoading(false);
                    setInfocontent({infoType: 'error', title: '', message: 'No se ha podido contactar al servidor, por favor intentalo de nuevo'});
                    setOpen(true);
                })
            }
        })
        $form.addEventListener('submit', (event) => {
            event.preventDefault()
        })
    }, [])
    if (loading) {
        return <Loader />
    }
    return(
        <>
            <div className="main-container">
                <form id="formdata" method="post" action='/login'>
                    <input type="hidden" value="{{token}}"/>
                    <p className="alert hidden">Por favor completa todos los campos</p>
                    <InputItem name="username" id="username" placeholder="Nombre del usuario"/>
                    <div>
                        <Collapse in={open}>
                            <Alert severity={infoContent.infoType} action={<IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 1 }}
                            >
                                <AlertTitle><strong>{infoContent.title}</strong> </AlertTitle>
                                {infoContent.message}
                            </Alert>
                        </Collapse>
                        <button>
                            <SendButton icon={<FontAwesomeIcon icon={faPaperPlane} />} msg=""/>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}