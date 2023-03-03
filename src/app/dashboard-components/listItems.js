import * as React from 'react';
import styles from '../css/listitems.module.css'
import { NavLink, useLocation } from 'react-router-dom'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
export default function MainListItems() {
  let location = useLocation();

  return (
  <React.Fragment>
    <NavLink to='/dashboard' className={styles["nav-link"]}>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon sx={{color: location.pathname == '/dashboard' ? '#F7901E' : 'rgba(0, 0, 0, 0.54)'}}/>
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </NavLink> 
    <NavLink to='/dashboard/sections' className={styles["nav-link"]}>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon sx={{color: location.pathname == '/dashboard/sections' ? '#F7901E' : 'rgba(0, 0, 0, 0.54)'}}/>
        </ListItemIcon>
        <ListItemText primary="Secciones" />
      </ListItemButton>
    </NavLink>
    <NavLink to="/dashboard/upload-users" className={styles["nav-link"]}>
          <ListItemButton>
            <ListItemIcon>
              <GroupAddIcon sx={{color: location.pathname == '/dashboard/upload-users' ? '#F7901E' : 'rgba(0, 0, 0, 0.54)'}}/>
            </ListItemIcon>
            <ListItemText primary="Subir Usuarios" />
          </ListItemButton>
        </NavLink>
    <NavLink to='/dashboard/candidates' className={styles["nav-link"]}>
      <ListItemButton>
        <ListItemIcon>
          <PresentToAllIcon  sx={{color: location.pathname == '/dashboard/candidates' ? '#F7901E' : 'rgba(0, 0, 0, 0.54)'}}/>
        </ListItemIcon>
        <ListItemText primary="Candidatos" />
      </ListItemButton>
    </NavLink>
    <NavLink to='/dashboard/users' className={styles["nav-link"]}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon sx={{color: location.pathname == '/dashboard/users' ? '#F7901E' : 'rgba(0, 0, 0, 0.54)'}}/>
        </ListItemIcon>
        <ListItemText primary="Usuarios" />
      </ListItemButton>
    </NavLink>
  </React.Fragment>
);
}
