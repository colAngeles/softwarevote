import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Loader from '../components/Loader';
import { useQuery } from 'react-query';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Section({ blankVotes, sectionName, socket, setDeleting }) {
  let startDelete = () => {
    setDeleting(true);
    socket.emit('delete:section', sectionName);
  }
  let count = React.useRef(1);
  count.current += blankVotes
  let getCandidates = async () => {
    let res = await fetch('/get-candidates');
    return res.json()
  }
  let {data: candidates, isLoading, error} = useQuery('candidates', getCandidates)
  if(!candidates) {
      return (
          <Loader/>
      )
  }
  return (
    <React.Fragment>
      <Title>
        { 
        sectionName 
        }
        :
        <IconButton aria-label="delete" onClick={startDelete}>
          <DeleteIcon />
        </IconButton>
      </Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Candidato</TableCell>
            <TableCell>Fórmula</TableCell>
            <TableCell>VOTOS</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {candidates.length != 0 ? candidates.map((row) => {
              if (row.section == sectionName) {
                count.current = 1 ? count.current = row.votes : count.current += row.votes
                return(
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell> 
                    <TableCell>{row.candidate}</TableCell>
                    <TableCell>{row.formula}</TableCell>
                    <TableCell>{row.votes}</TableCell>
                    <TableCell align="right">{`${count.current > 0 ? row.votes / count.current * 100 : 0}`}%</TableCell>
                  </TableRow>
                )
              }
            }): <TableCell>Sección Vacía.</TableCell> 
          }
          {
            candidates.length != 0 ? <TableRow><b>VOTOS EN BLANCO: </b> {blankVotes} ({`${count.current > 0 ? blankVotes / count.current * 100 : 0}`})</TableRow>: null
          }
      </TableBody>
      </Table>
    </React.Fragment>
  );
}
