import * as React from 'react';
import  ReactDOM  from 'react-dom/client';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Home from './dashboard-components/Home'
import MainListItems from './dashboard-components/listItems';
import Uploadusers from './dashboard-components/Uploadusers';
import Sections from './dashboard-components/Sections'
import { io } from 'socket.io-client';
import Candidates from './dashboard-components/Candidates';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Loader from './components/Loader';
let socket = io();
let queryClient = new QueryClient();
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://avcla.com/">
        Colegio Los Ángeles
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(false);
  let [openAlert, setOpenAlert] = React.useState(false);
  let [alertInfo, setAlertInfo] = React.useState(null);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
};
  
  const toggleDrawer = () => {
    setOpen(!open);
  };
  if (loadingPage) {
    return (
      <Loader />
    )
  }
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
              backgroundColor: '#162F54'
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Colegio Los Ángeles
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems/>
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'center' }}>
              <Routes>
                <Route path='dashboard' element={<Home/>} />
                <Route path='dashboard/upload-users' element={<Uploadusers socket={socket}/>} />
                <Route path='dashboard/sections' element={<Sections socket={socket}/>} />
                <Route 
                  path='dashboard/candidates' 
                  element={
                    <Candidates
                      setOpenAlert={(open, info) => {
                        setOpenAlert(open);
                        setAlertInfo(info);
                      }} 
                      setLoadingPage={(val) => setLoadingPage(val)}
                    />} 
                />
              </Routes>
            </Paper>
            <Copyright sx={{ pt: 4 }} />
            {
              !alertInfo ? null : (
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity={alertInfo.severity} sx={{ width: '100%' }}>
                      {alertInfo.message}
                  </Alert>
                </Snackbar>
              )
            }
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
    <ReactQueryDevtools />
  </QueryClientProvider>
  
);

