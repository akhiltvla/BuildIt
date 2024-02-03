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
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';
import FilePresentTwoToneIcon from '@mui/icons-material/FilePresentTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import MailIcon from '@mui/icons-material/Mail';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import { pmLogout } from '../slices/pmAuthSlice';
import { usePmLogoutMutation } from '../slices/pmApiSlice';

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

  const [pmlogoutApiCall] = usePmLogoutMutation()

  const pmlogoutHandler = async () => {
    try {
      await pmlogoutApiCall().unwrap()
      dispatch(pmLogout())
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { pmInfo } = useSelector((state)=> state.pmAuth)

  
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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
          <Box sx={{ flexGrow: 0 }}>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, pl:105}}>
                <Avatar src={pmInfo && pmInfo.photo} alt="Project Manager Photo" style={{ maxWidth: '200px' }} />
              </IconButton>
              {pmInfo ? (
                
                <NavDropdown title={pmInfo.name} id='username'>
                  <LinkContainer to='/pmprofile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={pmlogoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ):null
            }
            </Nav>
          </Navbar.Collapse>
          </Box>



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
        <ListItem disablePadding onClick={()=>navigate('/pmdash')}>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardCustomizeTwoToneIcon /> 
                </ListItemIcon>
                <ListItemText primary='Dash Board' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/pmdocument')}>
              <ListItemButton>
                <ListItemIcon>
                  <FilePresentTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary='Documents' />
              </ListItemButton>
            </ListItem>

            {/* <ListItem  disablePadding onClick={()=>navigate('/pmupdate')}>
              <ListItemButton>
                <ListItemIcon>
                 <InboxIcon />
                </ListItemIcon>
                <ListItemText primary='Daily Updates' />
              </ListItemButton>
            </ListItem> */}

            <ListItem  disablePadding onClick={()=>navigate('/pmrequest')}>
              <ListItemButton>
                <ListItemIcon>
                <CheckBoxTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary='Daily Requests' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/pmchat')}>
              <ListItemButton>
                <ListItemIcon>
               
               <ChatTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary='Chats' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/pmteam')}>
              <ListItemButton>
                <ListItemIcon>
                <Diversity3TwoToneIcon /> 
                </ListItemIcon>
                <ListItemText primary='Project Team' />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding onClick={()=>navigate('/pmlocation')}>
              <ListItemButton>
                <ListItemIcon>
                <LocationOnTwoToneIcon/>
                </ListItemIcon>
                <ListItemText primary='Work Location' />
              </ListItemButton>
            </ListItem>

        </List>
        <Divider />
        
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        
      </Main>
    </Box>
  );
}
