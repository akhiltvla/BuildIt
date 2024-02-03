import  React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { styled, useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import { adminLogout } from '../slices/adminAuthSlice';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Sidenav() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
 

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [adminlogoutApiCall] = useAdminLogoutMutation()

  const adminlogoutHandler = async () => {
    try {
      await adminlogoutApiCall().unwrap()
      dispatch(adminLogout())
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=>setOpen(!open)}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
    
          <Navbar bg='blue' variant='blue' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>BuildIt</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto' >
              <NavDropdown  title="Admin" id="pmname" >
                <NavDropdown.Item  onClick={adminlogoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
         
              

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={()=>setOpen(!open)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        <ListItem disablePadding onClick={()=>navigate('/admindash')}>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardCustomizeTwoToneIcon /> 
                </ListItemIcon>
                <ListItemText primary='Dash Board' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/adminproject')}>
              <ListItemButton>
                <ListItemIcon>
                  <WorkTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary='Projects' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/adminpm')}>
              <ListItemButton>
                <ListItemIcon>
                 <AccountCircleTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary='Project manager' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/adminse')}>
              <ListItemButton>
                <ListItemIcon>
           <AccountBoxTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary='Site Engineer' />
              </ListItemButton>
            </ListItem>

            {/* <ListItem  disablePadding>
              <ListItemButton>
                <ListItemIcon>
               <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary='Materials' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding>
              <ListItemButton>
                <ListItemIcon>
                <MailIcon />
                </ListItemIcon>
                <ListItemText primary='Equipments' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding>
              <ListItemButton>
                <ListItemIcon>
               <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary='Employees' />
              </ListItemButton>
            </ListItem> */}

        </List>
        <Divider />
        
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        
      </Main>
    </Box>
  );
}
