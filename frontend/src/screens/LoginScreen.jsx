import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, NavLink } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from "../components/FormContainer";
import { useLoginMutation, useGloginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify'
import Loader from '../components/Loader';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [gname, setGName] = useState('');
    const [gmail, setGMail] = useState('');
    const [gimage, setGImage] = useState('');

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()
    const [glogin] = useGloginMutation()

    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate('/dash')
        }
    }, [navigate, userInfo])
    //  console.log(userInfo);
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            navigate('/dash')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    const googlelogin = async (name, email, picture) => {
        try {
            console.log("xy",name,email,picture);
            const res = await glogin({
                name, email, picture
            }).unwrap()
            if(res){
                dispatch(setCredentials({ ...res }))
                navigate('/dash')
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
        <>
            <FormContainer>
                <h1> Site Engineer</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder="EnterPassword" value={password} onChange={(e) => setPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    {isLoading && <Loader />}

                    <Button type='submit' variant='primary' className="mt-3">
                        Sign In
                    </Button>

                    <p> New Customer? <Link to='/register'>Register</Link> </p>
                      <p style={{color:'black', fontWeight:'bold'}}> Forgot Password? <Link to='/seforgotpassword'>Click Here</Link> </p>
                

                </Form>
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />

            </FormContainer>


        </>
    )
}

export default LoginScreen
