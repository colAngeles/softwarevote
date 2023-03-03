import * as React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '../css/candidates.module.css';
import Input from '../components/Input';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from 'react-query';
import Loader from '../components/Loader';

export default function Candidates({ setLoadingPage, setOpenAlert }){
    let imageBlob = React.useRef(null);
    let deleteCandidate = async (section, id, filename) => {
        setLoadingPage(true);
        fetch(`/delete-candidate?section=${section}&id=${id}&filename=${filename}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setOpenAlert(true, {message: 'Candidato eliminado con éxito!', severity: "success"});
                setLoadingPage(false);
            }
            else if (data.fileError) {
                setOpenAlert(true, {message: `No ha sido posible eliminar el archivo. ${filename}`, severity: "warning"});
                setLoadingPage(false);
            }
            else {
                setOpenAlert(true, {message: 'No ha sido posible eliminar el elmento.', severity: "error"});
                setLoadingPage(false);
            }
        })
        .catch(_ => {
            setOpenAlert(true, {message: 'No ha sido posible eliminar el elmento.', severity: "error"});
            setLoadingPage(false);
        })
    }
    let buttonHandler = (close) => {
        let $form = document.getElementById('candidate_form');
        let formData = new FormData($form);
        if (!imageBlob.current) {
            alert('Por favor, adjunta una imagen.')
            return
        }
        if (!formData.get('id') || !formData.get('candidate') || !formData.get('formula')) {
            alert('Por favor, completa todos los campos.');
            return
        }
        setLoadingPage(true);
        let typeList = imageBlob.current.type.split('/');
        formData.set('image', imageBlob.current, `image.${typeList[1]}`);
        fetch('/save-candidate', {
            method: 'POST',
            body: formData
        })
        .then(data => data.json())
        .then(res => {
            setLoadingPage(false);
            if (res.success) {
                setOpenAlert(true, {message: 'Candidato creado con éxito!', severity: "success"});
            }
            if (res.result) {
                alert(`Ya existe un candidato con el ID: ${result}. Desea actualizarlo?`);
            }
        })
        .catch(e => {
            console.log('This is a test from error')
            setLoadingPage(false);
            setOpenAlert(true, {message: 'Se ha producido un error. Por favor, inténtelo más tarde.', severity: "error"});
        })
        

    }
    let changeHandler = (e) => {
        if (!e.currentTarget.files[0].type.includes('image')) {
            alert('El formato del archivo no corresponde.')
            return
        }
        let imageContainer = document.getElementById('candidate_image');
        imageBlob.current = e.currentTarget.files[0];
        let url = URL.createObjectURL(e.currentTarget.files[0])
        imageContainer.style.backgroundImage = `url(${url})`;
        imageContainer.style.border = '1px solid #162f54'
    }
    let setListener = () => {
        let input = document.getElementById('image_input');
        input.click();
    }
    const fabStyle = {
        position: 'absolute',
        bottom: 16,
        right: 16,
        position: 'fixed',
        button: '2rem',
        right: '2rem'
      };
    let button = (
            <Fab sx={fabStyle} aria-label='Add' color='primary'>
                <AddIcon />
            </Fab>
    )
    let getData = async () => {
        let res = await fetch('/get-sections');
        return res.json()
      }
    let {data, isLoading:loadingData, error:errorData} = useQuery(['sections', open], getData);

    let getCandidates = async () => {
        let res = await fetch('/get-candidates');
        return res.json()
    }
    let {data: candidates, isLoading, error} = useQuery('candidates', getCandidates)
    if(!data || !candidates) {
        return (
            <Loader/>
        )
    }
    return (
        <>
            {
                data.conf == false ? 
                    <h2 style={{margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}><b>Aún no hay secciones disponibles. </b><b>Por favor agregue una sección para habilitar esta opción.</b></h2>
                    : 
                    (
                        data.map((val, index) => (
                            <div key={index}>
                                <h3  style={{fontFamily: 'FuturaBT', color: '#162f54'}}>{val.sectionName.toUpperCase()}:</h3>
                                <Divider />
                                {
                                    candidates.length != 0 ?
                                    <div key={index} style={{display: 'grid',  gridTemplateColumns: '1fr 1fr 1fr', width: '100%', gap: '10px', padding: '2rem'}}>
                                        {
                                            candidates.map((value, index) => {
                                                if (value.section == val.sectionName) {
                                                    return (
                                                        <Card key={index} sx={{ maxWidth: 345, minWidth: 345, flexShrink: 0, position: 'relative'}}>
                                                            <div className={styles['icons-container']}>
                                                                <IconButton aria-label="delete" onClick={deleteCandidate.bind(null, value.section, value.id, value.image)}>
                                                                    <DeleteIcon sx={{color: '#fff'}}/>
                                                                </IconButton>
                                                            </div>
                                                            <CardActionArea>
                                                                <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={`/uploads/` + value.image}
                                                                alt="image"
                                                                />
                                                                <CardContent sx={{backgroundColor: 'rgb(35, 48, 68)'}}>
                                                                    <h5 style={{fontSize: '1.5rem', margin: '1rem 0', color: 'rgb(178, 186, 194)'}}>
                                                                        {value.id}
                                                                    </h5>
                                                                    <Typography variant="body2" color="text.secondary" sx={{color: 'rgb(178, 186, 194)'} }>
                                                                        <b>CANDIDATO:</b> {value.candidate} <br/>
                                                                        <b>FÓRMULA:</b> {value.formula}
                                                                    </Typography>
                                                                </CardContent>
                                                            </CardActionArea>
                                                        </Card>
                                                    )
                                                }
                                            })
                                        }
                                    </div> : <p style={{margin: '0 auto', textAlign: 'center'}}>Sección Vacía.</p>
                                    
                                }
                                <Divider />
                            </div>
                        ))
                    )
            }
            {
                data.conf == false ? null : (
                <Popup modal contentStyle={{width: 'max-content', padding: '2rem', margin: 'auto'}} trigger={button} position="right center">
                    {
                        close => (
                            <form style={{display: 'grid', gridTemplateColumns: '500px 1fr', gridTemplateRows: '500px'}} id="candidate_form">
                                <div className={styles['image-container']} id='candidate_image' onClick={setListener}>
                                    <input type='file' hidden id='image_input' onChange={changeHandler}/>
                                    <div id='add_icon'>
                                        <AddIcon/>
                                    </div>
                                </div>
                                <div id='ifo-content' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
                                    <select name='section' style={{padding: '0.5em'}}>
                                        {
                                            data.map((value, index) => (
                                                <>
                                                    <option style={{padding: '1em'}} key={value.sectionName} value={value.sectionName}>{value.sectionName.toUpperCase()}</option>
                                                </>
                                            ))
                                        }
                                    </select>
                                    <Input sx={{color: "#000"}} name='id' type="number" placeholder="Id" />
                                    <TextField id="outlined-basic" name='candidate' label="Candidato" variant="outlined" />
                                    <TextField id="outlined-basic" name='formula' label="Fórmula" variant="outlined" />
                                    <Button variant="contained" href="#contained-buttons" onClick={buttonHandler.bind(null, close)}>
                                        Crear
                                    </Button>
                                </div>
                            </form>
                        )
                    }
                </Popup>
            )}
         </>

  );
}