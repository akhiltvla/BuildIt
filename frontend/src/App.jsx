import React from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  return (
    <>

      <GoogleOAuthProvider clientId="454338849591-93m2q6138f1sklce464o1et4f1kcvg9a.apps.googleusercontent.com">
        <Header />
        <ToastContainer />
        <Container className='my-2'>
          <Outlet />
        </Container>
      </GoogleOAuthProvider>;
    </>
  )
}

export default App
