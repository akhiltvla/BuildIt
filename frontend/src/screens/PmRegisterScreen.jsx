import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux'

import FormContainer from "../components/FormContainer";
import { usePmregisterMutation } from "../slices/pmApiSlice";
import { usePmLoginMutation, useGloginMutation } from '../slices/pmApiSlice';
import { setPmCredentials } from '../slices/pmAuthSlice';
import { toast } from 'react-toastify'
import Loader from '../components/Loader';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import React from 'react'

const PmRegisterScreen = () => {
    const [name,setName] = useState('')
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const [confirmPassword,setConfirmPassword]= useState('')
    const [gname, setGName] = useState('');
    const [gmail, setGMail] = useState('');
    const [gimage, setGImage] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [pmRegister,{ isLoading }] = usePmregisterMutation()
    const [glogin] = useGloginMutation()
  
    const { pmInfo } = useSelector((state)=> state.auth)

    useEffect(()=>{
        if (pmInfo){
            navigate('/') 
        }
    },[ navigate, pmInfo])

    const submitHandler = async (e) =>{
        
        e.preventDefault();
       
        if(password!==confirmPassword){
            toast.error('Passwords do not match')
        } else {
            try{
                const res = await pmRegister({ name,email,password }).unwrap()
                toast.success('Account created successfully')
                //dispatch(setCredentials({...res})) 
                navigate('/pmlogin')
            } catch(err){
                // console.error('Error caught in catch block:', err);
                toast.error(err?.data?.message || err.error)
            }
        }
    }
    const googlelogin = async (name, email, picture) => {
        try {
            console.log("xy",name,email,picture);
            const res = await glogin({
                name, email, picture
            }).unwrap()
            if(res){
                dispatch(setPmCredentials({ ...res }))
                navigate('/pmdash')
            }
            
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }


    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const credentialResponseDecoded = jwtDecode(credentialResponse.credential)
            console.log(credentialResponseDecoded);


            const { name, email, picture } = credentialResponseDecoded

            googlelogin(name, email, picture)

        } catch (error) {
            console.log('Google login failed:', error);
        }
    }

    console.log(gname, gmail, gimage);
  return (
    <FormContainer>
        <h1>Project Manager</h1>
        <Form onSubmit={submitHandler}>  
            <Form.Group className="my-2" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placeholder="Enter Name" value={name} onChange={ (e) => setName(e.target.value)}>
                </Form.Control>
            </Form.Group>
            
            <Form.Group className="my-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder="Enter Email" value={email} onChange={ (e) => setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder="EnterPassword" value={password} onChange={ (e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="ConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' placeholder="Confirm Password" value={confirmPassword} onChange={ (e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            {isLoading && <Loader />}

           <Button type='submit' variant= 'primary' className="mt-3">
            Sign Up
            </Button> 

            <Row className="py-3">
                <Col>
                Already have an account? <Link to='/pmlogin'>Login</Link>
                </Col>
            </Row>

        </Form>

        <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />

    </FormContainer>
    


  )
}

export default PmRegisterScreen
