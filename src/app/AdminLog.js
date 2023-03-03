import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Input from "./dashboard-components/Input";
import { styled } from "@mui/material/styles";
import styles from "./css/adminlog.module.css";
import Alert from '@mui/material/Alert';
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Loader from "./components/Loader";

function AdminLog() {
        localStorage.clear();
        let [open, setOpen] = useState(false);
        let [infoContent, setInfocontent] = useState('');
        let [loading, setLoading] = useState(false);
        const SendButton = styled(Button)({
            boxShadow: "none",
            textTransform: "none",
            fontSize: 16,
            padding: "6px 12px",
            lineHeight: 1.5,
            backgroundColor: "#1B3764",
            borderColor: "#0063cc",
            fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
            ].join(","),
            "&:hover": {
            backgroundColor: "#162F54",
            borderColor: "#ffffff70",
            boxShadow: "none"
            },
            "&:active": {
            boxShadow: "none",
            backgroundColor: "#ffffff70",
            borderColor: "#ffffff70",
            color: "#fff"
            },
            "&:focus": {
            boxShadow: "0 0 0 0.2rem rgba(255, 255, 255, 0.438)"
            }
        });
        let sendHandler = () => {
            let $form = document.getElementById('form');
            let formData = new FormData($form);
            let user = formData.get('user');
            let pass = formData.get('pass');
            if (user == '' || pass == '') {
                setInfocontent({infoType: 'warning', title: '', message: 'Por favor, completa todos los campos'});
                setOpen(true);
                return
            }
            setLoading(true);
            fetch('/login', {
                method: 'POST',
                body: formData
            })
            .then(res => {        
                return res.json()
            })
            .then( ( data ) => {
                if (data.refused) {
                    setLoading(false);
                    setInfocontent({infoType: 'warning', title: '', message: data.error});
                    setOpen(true);
                }
                else if (data.success) {
                    localStorage.setItem('section', data.section);
                    window.location.href = `${window.origin}/voter`;
                }
                else if (data.admin) {
                    window.location.href = `${window.origin}/dashboard`;
                }
            })
            .catch(e => {
                setLoading(false);
                setInfocontent({infoType: 'error', title: '', message: 'No se ha obtenido una respuesta del servidor.'});
                setOpen(true);
            })
        }
        if (loading) {
            return (
                <Loader />
            )
        }
        return (
            <section>
                <main>
                    <form className={styles["form-container"]} id="form">
                        <h1>Colegio Los Ángeles</h1>
                        <Input sx={{color: '#162f54', margin: '1rem'}} name="user" placeholder='Usuario' bkLab="rgb(228, 228, 228)"/>
                        <Input sx={{color: '#162f54', margin: '1rem'}} name="pass" type='password' placeholder='Contraseña' bkLab="rgb(228, 228, 228)"/>
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
                                    sx={{ mb: 1}}
                                >
                                    <AlertTitle><strong>{infoContent.title}</strong> </AlertTitle>
                                    {infoContent.message}
                                </Alert>
                            </Collapse>
                        </div>
                        <SendButton variant="contained" component="label" sx={{marginTop: "10px"}} onClick={sendHandler}>Ingresar</SendButton>
                    </form>
                </main>
            </section>
            
        )
}
let root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminLog/>);