import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from "../components/FormContainer";
import { useLoginMutation, useGloginMutation, useVerifyUserMutation, useResetPasswordMutation,useUpdateUserMutation} from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify'
import Loader from '../components/Loader';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';

const SeResetPasswordScreen = () => {
   
    const [password, setPassword] = useState('');
    const [login, { isLoading }] = useLoginMutation()
    const [resetpassword] = useResetPasswordMutation()
    const { _id, token } = useParams();
    console.log('_id:', _id, 'token:', token);

    const { userInfo } = useSelector((state) => state.auth)

    const navigate = useNavigate()
    const dispatch = useDispatch()

const submitHandler = async (e) => {
    e.preventDefault();
    try {
        console.log('kokoookkk');
        const res = await resetpassword( {_id,token,password} ).unwrap()
        console.log('respspssp',res);
        dispatch(setCredentials({ ...res }))
        toast.success("Password Updated");
        // navigate('/login')
    } catch (err) {
        toast.error(err?.data?.message || err.error)
    }
}




     console.log(userInfo);
    

 
    return (
        <>
            <FormContainer>
                <h1> Enter New Password</h1>
                <Form onSubmit={submitHandler}>
                    

                    <Form.Group className="my-2" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder="EnterPassword" value={password} onChange={(e) => setPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    {isLoading && <Loader />}

                    <Button type='submit' variant='primary' className="mt-3">
                        Send 
                    </Button>

                    

                </Form>
                

            </FormContainer>


        </>
    )
}

export default SeResetPasswordScreen
