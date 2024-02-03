import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from "../components/FormContainer";
import { useLoginMutation, useGloginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify'
import Loader from '../components/Loader';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {useSendPasswordLinkMutation} from '../slices/userApiSlice';


const SeForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    
    const [message, setMessage] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [sendPasswordLink] = useSendPasswordLinkMutation()
    // const [sendPasswordLink, { isLoading }] = useSendPasswordLinkMutation()


    const { userInfo } = useSelector((state) => state.auth)

    // useEffect(() => {
    //     if (userInfo) {
    //         navigate('/dash')
    //     }
    // }, [navigate, userInfo])
    //  console.log(userInfo);
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await sendPasswordLink({ email }).unwrap()
            console.log('res',res);
         
            // if(res){
            //     // dispatch(setCredentials({ ...res }))
            //     navigate('/seresetpassword')
            // }
            //  const data = await res.json()
            //  console.log('asas',data);
            if(res.status ===201){
                console.log('huhuhhi');
                dispatch(setCredentials({ ...res }))
                const responseData = res.data;
                console.log('responseData', responseData);
             
                setEmail('')
                setMessage(true)
             navigate(`/seresetpassword/${responseData._id}/${responseData.token}`);
            }
            else{
                toast.error('Invalid User')
            }

            
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
   
    return (
        <>
            <FormContainer>
                <h1> Enter your Email</h1>
                {message ? <p style={{ color: 'green' ,fontWeight:'bold'}}>password reset link send successfully in your email</p>:''}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
{/* 
                    {isLoading && <Loader />} */}

                    <Button type='submit' variant='primary' className="mt-3">
                        Send 
                    </Button>     

                </Form>

            </FormContainer>


        </>
    )
}

export default SeForgotPasswordScreen
