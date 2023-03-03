import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient, useQuery} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import styles from './css/card.module.css'
import Loader from './components/Loader';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Collapse from "@mui/material/Collapse";
import Alert from '@mui/material/Alert';
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
let client = new QueryClient();
function PollingStation() {
    let section = localStorage.getItem('section');
    let [check, setCheck] = React.useState(null);
    let [info , setInfo] = React.useState(null);
    let [loading, setLoading] = React.useState(false);
    let [infoContent, setInfocontent] = React.useState(null);
    let [open, setOpen] = React.useState(false);

    let handleClick = (e) => {
        setCheck(e.currentTarget.dataset.id);
        setInfo({id: e.currentTarget.id, candidate: e.currentTarget.dataset.candidate, formula: e.currentTarget.dataset.formula})
    }
    let handlerSend = () => {
            if  (!info) {
                setInfocontent({infoType: 'warning', title: '', message: 'Por favor, selecciona una de las opciones.'});
                setOpen(true)
                return
            }
            setLoading(true);
            let formData = new FormData();
            formData.set('id', info.id)
            formData.set('candidate', info.candidate)
            formData.set('formula', info.formula)
            formData.set('section', section)
            fetch('/save-vote', {
                method: 'POST',
                body: formData
            })
            .then(res => (
                res.json()
            ))
            .then( data => {
                if (data.success) {
                    window.location.href = `${window.origin}/success`
                }
                setLoading(false);
                setInfocontent({infoType: 'error', title: '', message: 'Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo.'});
                setOpen(true)
            })
            .catch(e => {
                setLoading(false);
                setInfocontent({infoType: 'error', title: '', message: 'Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo.'});
                setOpen(true)
            })
    }
    let getData = async ({queryKey}) => {
        let res = await fetch(`/get-candidates?section=${queryKey[1]}`)
        return res.json()
    }
    let {data, isLoading, error} = useQuery(['candidates', section], getData);
    if ( !data || loading ) {
        return (
            <Loader />
        )
    }
    return (
        <div className={styles["main-container"]}>
            <div className={styles['container-box']}>
                {
                    data.length != 0 ? data.map((val, index) => (
                        <div style={{backgroundImage: `url("/uploads/${val.image}")`}} key={index} id={val.id} className={`${styles["box"]} ${styles["box-one"]} box`} data-candidate={val.candidate} data-formula={val.formula} data-id={val.id} onLoad={() => console.log(val.id)} onClick={handleClick}>
                            {
                                check == val.id ? <div className={`${styles['over']} checkbox`}><FontAwesomeIcon icon={faCheck} /></div> : null
                            }
                        </div>
                    )) : <h5>Aún no existen candidatos en esta sección.</h5>
                }
            </div>
            <div className={styles['info-content']}>
                <div className={styles['logo-container']}>
                        <img src='/media/Blanco.png'/>
                </div>  
                <form>
                    <div>
                        <p><b>Número/Id: </b>{info ? info.id: null}</p>
                        <p><b>Personero: </b></p>
                        &nbsp;&nbsp;&nbsp;&nbsp;{info ? info.candidate: null}
                        <p><b>Fórmula: </b></p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;{info ? info.formula: null}</p>
                    </div>
                    <div className={styles["alert-container"]} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {
                            infoContent ? <Collapse in={open}>
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
                            </Collapse>: null
                        }
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <Button variant="contained" endIcon={<SendIcon />} onClick={handlerSend}>
                            Send
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

let root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={client}>
        <PollingStation />
        <ReactQueryDevtools />
    </QueryClientProvider>
);