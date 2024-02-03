import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Form, Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux'
import FormContainer from "../components/FormContainer";
import { setPmCredentials, pmLogout } from "../slices/pmAuthSlice";
import { toast } from 'react-toastify'
import Loader from '../components/Loader';
import { Box } from '@mui/material';
import { useUpdatePmMutation } from "../slices/pmApiSlice";
import PmSidenav from '../components/PmSidenav'
import React from 'react'
import axios from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


const PmProfileScreen = () => {
    const [name,setName] = useState('')
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const [confirmPassword,setConfirmPassword]= useState('')
    const [photo,setPhoto]= useState('')
    const [contact, setContact] = useState('');
    const [jdate, setJDate] = useState('');
   
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { pmInfo } = useSelector((state)=> state.pmAuth)
    const [updateProfile, { isLoading }] = useUpdatePmMutation()  


    useEffect(()=>{
        setName(pmInfo.name)
        setEmail(pmInfo.email)
        setPhoto(pmInfo.photo)
        setContact(pmInfo.contact)
        setJDate(pmInfo.jdate)
        
    },[ pmInfo.setName, pmInfo.setEmail, pmInfo.setPhoto, pmInfo.setContact, pmInfo.setJDate])


    const handleImageUpload = (e) => {
        const selectedImage = e.target.files[0];
        setPhoto(selectedImage);
      };



    // const submitHandler = async (e) =>{
    //     e.preventDefault();
    //     if(password!==confirmPassword){
    //         toast.error('Passwords do not match')
    //     } else {
    //             try {
    //             const res = await updateProfile({
    //                 _id:userInfo._id,
    //                 name,
    //                 email,
    //                 password
    //             }).unwrap()
    //             dispatch(setCredentials({...res}))
    //                toast.success('Profile Updated')
    //                console.log(res)
    //         } catch (err) {
    //             toast.error(err?.data?.message || err.error)
    //         }
    //     }
    // }



    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
        } else {
          try {
            const formData = new FormData();
            formData.append("pmPhoto", photo);
            const result = await axios.put(
              "http://localhost:3000/api/pms/pmprofile",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            const res = await updateProfile({
              _id: pmInfo._id,
              name,
              email,
              password,
              contact,
              jdate,
              photo,
              
            }).unwrap();
            dispatch(setPmCredentials({ ...res, photo: res.photo }));
            toast.success("Profile Updated");
          } catch (error) {
            toast.error(error?.data?.message || error.error || error.message);
          }
        }
      };


  return (
    
    <Box sx={{ display: 'flex' }}>
      <PmSidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: -20 }}>
   <h2>Update the profile</h2>
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={pmInfo.photo && pmInfo.photo} alt="Project Manager Photo" style={{ maxWidth:'120px', borderRadius: '50%' }} />
        </div>
        {/* <h1>Update PM Profile</h1> */}
        <Form onSubmit={submitHandler}> 
        <div class="row">
      <div class="col-6">
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

            <Form.Group className="my-2" controlId="contact">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control type='contact' placeholder="Enter Contact Number" value={contact} onChange={(e) => setContact(e.target.value)}>
            </Form.Control>
          </Form.Group>

            <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder="EnterPassword" value={password} onChange={ (e) => setPassword(e.target.value)}>
                 </Form.Control>
            </Form.Group>
            </div>

          <div class="col-6">

            <Form.Group className="my-2" controlId="ConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' placeholder="Confirm Password" value={confirmPassword} onChange={ (e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>


            <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Form.Label>Joining Date</Form.Label>
       
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Joining Date"   onChange={(date) => setJDate(date)} />
            </DemoContainer>
          </LocalizationProvider>

            <Form.Group className="my-2" controlId="Photo">
                <Form.Label>Profile</Form.Label>
                <Form.Control type='file' placeholder="Photo" onChange={ handleImageUpload}>
                </Form.Control>
            </Form.Group>
            
            {isLoading && <Loader />}

           <Button type='submit' variant= 'primary' className="mt-3">
            Update
            </Button> 
            </div>
          </div>
        </Form>
        </Box>
      </Box>
     


  )
}

export default PmProfileScreen
