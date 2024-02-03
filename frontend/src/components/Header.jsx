import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../slices/userApiSlice';
import { usePmLogoutMutation } from '../slices/pmApiSlice';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import { logout } from '../slices/authSlice'
import { pmLogout } from '../slices/pmAuthSlice';
import { adminLogout } from '../slices/adminAuthSlice';


const Header = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const { pmInfo } = useSelector((state) => state.pmAuth)
  const { adminInfo } = useSelector((state) => state.adminAuth)


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()
  const [pmlogoutApiCall] = usePmLogoutMutation()
  const [adminlogoutApiCall] = useAdminLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

  const pmlogoutHandler = async () => {
    try {
      await pmlogoutApiCall().unwrap()
      dispatch(pmLogout())
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

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
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>BuildIt</Navbar.Brand>
          </LinkContainer>
  
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : pmInfo ? (  // Check if pmInfo is available
                <NavDropdown title={pmInfo.name} id='pmname'>
                  <LinkContainer to='/pmprofile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={pmlogoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : adminInfo ? (  // Check if adminInfo is available
              <NavDropdown title={adminInfo.name} id='pmname'>
                <LinkContainer to='/adminlogin'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={adminlogoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
                
                null
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
  
}


export default Header;