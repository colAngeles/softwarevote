import React, { useEffect, useState, useRef } from "react";
import styles from '../css/uploadusers.module.css';
import Button from '@mui/material/Button';
import NavigationIcon from '@mui/icons-material/Navigation';
import Fab from '@mui/material/Fab';
import Toolbar from '@mui/material/Toolbar';
import Alert from '@mui/material/Alert';
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomizedProgressBars from './CustomizedProgressBars';
export default function Uploadusers({ socket }) {
    let [open, setOpen] = useState(false);
    let [infoContent, setInfocontent] = useState("");
    let [fileName, setFileName] = useState('Seleccionar archivo csv');
    let [enUpload, setEnUpload] = useState(true);
    let [enClick, setClick] = useState(true);
    let amountData = useRef(1);
    let [progress, setProgress] = useState(0.01);
    let sendHandler = () => {
        if(!enClick) return;
        setClick(false);
        let $form = document.getElementById('upload-form');
        let formData = new FormData($form);
        if(!formData.get('csvfile').name) {
            setInfocontent({infoType: 'warning', title: '', message: 'Por favor, seleccione un archivo.'});
            setOpen(true);
            setClick(true);
            return
        }
        
        fetch('/upload-users', {
            method: 'PUT',
            body: formData,
        })
        .then(res => {
            if(res.status == 500) {
                setInfocontent({infoType: 'error', title: '', message: 'Error al tratar de guardar el archivo. Por favor, inténtelo más tarde.'});
                setOpen(true);
                setClick(true);
                return
            }
            return res.json();
        })
        .then( ({ fileName }) => {
            if (fileName) {
                setEnUpload(false);
                socket.emit('upload', fileName); // I can send a object
            }
        })
        .catch(e => {
            setInfocontent({infoType: 'error', title: '', message: 'Error de comunicación. Por favor, inténtelo más tarde.'});
            setOpen(true);
            setClick(true);
        })
    }
    useEffect(() => {
        if (enUpload) {
            let file = document.getElementById('csv-file');
            file.onchange = (e) => {
                let reader = new FileReader();
                reader.readAsText(file.files[0]);
                reader.onload = (e) => {
                    let list = reader.result.split('\r');
                    amountData.current = list.length - 2;
                }
                setFileName(file.files[0].name);
            }
        }
        
    })
    useEffect(() => {
        let userLoaded = ({ success, count }) => {
            if (success) {
                let current = count / amountData.current * 100;
                setProgress(current);
                return
            }
            setInfocontent({infoType: 'error', title: '', message: 'Se produjo un error al tratar de guardar los usuarios. Por favor, inténtelo más tarde.'});
            setOpen(true);
            amountData.current = 1;
            setProgress(0.01);
            setFileName('Seleccionar archivo csv');
            setEnUpload(true);
            setClick(true);
        }

        socket.on('user:loaded', userLoaded);

        return () => {
            socket.off('user:loaded', userLoaded);
        }
    }, [])
    useEffect(() => {
        if (progress == 100) {
            setTimeout(()=>{
                amountData.current = 1;
                setProgress(0.01);
                setFileName('Seleccionar archivo csv');
                setInfocontent({infoType: 'success', title: '', message: 'Usuarios guardados exitosamente!'});
                setOpen(true);
                setEnUpload(true);
                setClick(true);
            }, 500)
        }
    }, [progress])
    return (
        <>
            <Toolbar />
                {
                   enUpload ? (
                    <>
                        <div className={styles['main-container']}>
                            <form id="upload-form">
                                <Button variant="contained" component="label">
                                    {
                                        fileName
                                    }
                                    <input name='csvfile' id='csv-file' hidden accept=".csv" type="file" />
                                </Button>
                            </form>
                            <div className={styles["alert-container"]} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                            </div>
                            <div className={styles['send-button-container']}>
                                <Fab variant="extended" onClick={sendHandler}>
                                    <NavigationIcon sx={{ mr: 1 }} />
                                    Subir usuarios
                                </Fab>
                            </div>
                        </div>
                    </>
                        
                   ) : (
                        <div className={styles['progress-container']}>
                            <CustomizedProgressBars value={progress}/>
                        </div>
                   )
                }
        </>
        

    )
}
