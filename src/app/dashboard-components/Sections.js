import * as React from 'react';
import 'reactjs-popup/dist/index.css';
import '../css/modal.css';
import { useQuery } from 'react-query';
import Section from './Section';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';
import Popup from 'reactjs-popup';
import styles from '../css/sections.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Loader from '../components/Loader';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

export default function Sections({ socket }) {
    let [open, setOpen] = React.useState(false);
    let [isLoading, setIsLoading] = React.useState(false);
    let [alertInfo, setAlertInfo] = React.useState(null);
    let [deleting, setDeleting] = React.useState(false);
    let [items, setItems] = React.useState([]);
    let showSections = () => {
        setItems([]);
        setDeleting(false);
    }
    let buttonHandler = (close) => {
        let name = document.getElementById('section-name').value;
        close();
        setIsLoading(true);
        fetch(`/create-section?name=${name}`)
        .then(res => {
            if (res.status == 200) {
                setIsLoading(false);
                setAlertInfo({message: 'Sección creada con éxito!', severity: "success"});
                setOpen(true);
            }
            else {
                setAlertInfo({message: 'Test no se ha podido crear la sección. Por favor, intentelo más tarde.', severity: 'error'});
                setIsLoading(false);
                setOpen(true);
            }
        })
        .catch( e => {
                setAlertInfo({message: 'No se ha podido crear la sección. Por favor, intentelo más tarde.', severity: 'error'});
                setIsLoading(false);
                setOpen(true);
        })
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };
    const fabStyle = {
        position: 'absolute',
        bottom: 16,
        right: 16,
        position: 'fixed',
        button: '2rem',
        right: '2rem'
    };
    let button = (
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab color="primary" aria-label="add" sx={fabStyle}>
                        <AddIcon />
                        
                    </Fab>
                </Box>
    )
    let enButton = React.useRef(false);
    let getData = async () => {
        let res = await fetch('/get-sections');
        return res.json()
      }
    let {data, isLoading:loadingData, error} = useQuery(['sections', open, deleting], getData);
    
    React.useEffect(() => {
        socket.on('error:deletesection', (sectionName) => {
            setAlertInfo({message: `No se ha podido borrar la sección ${sectionName}`, severity: "error"});
            setOpen(true);
            setDeleting(false);
        })
        socket.on('emptysection:deleted', (sectionName) => {
            setAlertInfo({message: `Sección ${sectionName} eliminada con éxito!`, severity: "success"});
            setOpen(true);
            setDeleting(false);
        })
        socket.on('candidate:deleted', ({ candidate }) => {
            setItems([<Item><b>ITEM ELIMINADO: </b><b>ID: {candidate.id}</b> <b>CANDIDATO: </b>{candidate.candidate}</Item>, ...items])
        })
        socket.on('section:deleted', ({ candidate }) => {
            setItems([<Item><b>ITEM ELIMINADO: </b><b>ID: {candidate.id}</b> <b>CANDIDATO: </b>{candidate.candidate}</Item>, ...items]);
            enButton.current = true;
        })
    }, [])
    if (loadingData) {
        return (
        <Loader />
        )
    }
    if (deleting) {
        return (
            <Box sx={{ width: '100%' }}>
                {
                    !enButton ? <LinearProgress /> : null
                }
                <Stack spacing={2}>
                    {
                        items.length == 0 ? null : 
                        items.map((val, index) => (
                            val
                        ))
                    }
                </Stack>
                {
                    enButton ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <Alert severity='success' sx={{ width: '100%' }}>
                                            Proceso completado con éxito!
                                    </Alert>
                                    <Button variant="contained" onClick={showSections} sx={{margin: '2rem auto'}}>
                                        Continuar
                                    </Button>
                               </div>: null
                }
            </Box>
        )
    }
    
    return (
        <>
            {
                isLoading ? (
                    <Box sx={{ display: 'flex', margin: 'auto'}}>
                        <CircularProgress />
                    </Box>
                ):
                !data ? (
                    <Skeleton variant="rounded" width='80%' height ='300px' sx={{margin: '0 auto'}}/>
                ):  data.conf == false ? 
                    <div className={styles['info-content']}>
                        <h2>No hay secciones disponibles.</h2>
                    </div>
                    : data.map((value, index) => (
                        <div style={{margin: '2rem 0'}}>
                            <Section key={index} blankVotes={value.blankVotes} sectionName={value.sectionName} socket={socket} setDeleting={(val) => setDeleting(val)}/>
                        </div>
                    ))
            }
            {
                <Popup modal contentStyle={{width: 'max-content', padding: '2rem', margin: 'auto'}} trigger={button} position="right center">
                    {
                        close => (
                            <form id='section-form' className={styles["section-form"]}>
                                <TextField id="section-name" label="Nombre" variant="outlined" name='name'/>
                                <Button variant="contained" onClick={buttonHandler.bind(null, close)}>
                                    Crear
                                </Button>
                            </form>
                        )
                    }
                </Popup>
            }
            {
                open ? (<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={alertInfo.severity} sx={{ width: '100%' }}>
                                {alertInfo.message}
                            </Alert>
                        </Snackbar>): null
            }
        </>
    )
}