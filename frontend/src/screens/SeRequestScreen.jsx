import React from 'react'
import { Box, Modal, TextField, Divider, Typography, InputLabel, MenuItem} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormContainer from "../components/FormContainer";
import {Form} from 'react-bootstrap';
import Select from '@mui/material/Select';
import SeSidenav from '../components/SeSidenav'
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useAdminProjectListMutation } from '../slices/adminApiSlice';
import {useListRequestMutation} from '../slices/pmApiSlice'
import { useListTeamSeMutation, useMaterialRequestMutation, useEmployeeRequestMutation, useEquipmentRequestMutation } from '../slices/userApiSlice';
import { toast } from 'react-toastify'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const SeRequestScreen = () => {

    const { userInfo } = useSelector((state) => state.auth)
    const {projectDetails} = useSelector((state)=> state.getProject)
    const dispatch = useDispatch();
    const [name, setName] = useState('')
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('');
    const [count, setCount] = useState(''); 
    const [project, setProject] = useState("");
    const [pList, setPList] = useState([]);
    const [selectedMaterialRequest, setSelectedMaterialRequest] = useState({});
    const [pListData] = useAdminProjectListMutation();
    const [materialRequest]= useMaterialRequestMutation();
    const [employeeRequest]= useEmployeeRequestMutation();
    const [equipmentRequest]= useEquipmentRequestMutation();
    const [listRequest]= useListRequestMutation()
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedProject, setSelectedProject] = useState({})
    const [openModal, setOpenModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const seId= userInfo._id

    const handleChangeProject = (event) => {
        const selectedProject = pList.find(project => project.name === event.target.value);
        setProject(event.target.value);
        setSelectedProjectId(selectedProject ? selectedProject._id : "");

      };

    const fetchProject = async () => {
        try {
            const projectResponse = await pListData();
            const allProjects = projectResponse.data;
            
            const projectsAssignedToSE = allProjects.filter(project => project.se === userInfo.name);
       //      console.log('projectsAssignedToSE:',projectsAssignedToSE);
            setPList(projectsAssignedToSE);

        } catch (error) {
            console.error('Error fetching Projecct data', error);
        }
    };

    const [row, setRow] = useState({});

    useEffect(() => {
        // listTeamSe()
       
        fetchProject()
    }, [selectedProjectId]);


    // console.log(showlist)


    const handleOpenModal = () => {
        setOpenModal(true);
      };
    
      const handleCloseModal = () => {
        setOpenModal(false);
      };

   

      const handleView = async () => {
        if (!selectedProjectId) {
          toast.error('Please select a project.');
          return;
        }
      
        try {
          const { data } = await listRequest(selectedProjectId); // Replace with your actual API call
       console.log(data);

          setSelectedMaterialRequest(data); // Set the material request data
          setOpenViewModal(true); // Open the modal
        } catch (error) {
          console.error('Error fetching material request data:', error);
          toast.error('Unable to fetch material request data');
        }
      };
          const handleCloseViewModal = () => {
            setOpenViewModal(false);
          };



    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleMaterialRequest = async (e) => {
        //console.log("hihihihi");
        e.preventDefault();
        if (!selectedProjectId) {
            toast.error('Please select a project.');
            return;
        }
        if (name === '' || qty === '' || unit === '') {
            toast.error('Please fill in all of the required fields.');
            return;
        }
        try {
            // Prepare data based on the request type (material, employee, or equipment)
            
            await materialRequest({ name,qty,unit, seId, projectId: selectedProjectId}).unwrap()
            toast.success('Request Send')
          
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
                //toast.error(err?.data?.message || err.error)
            } else {

                toast.error('Unable to send the request');
            }
        }
    };

    const handleEmployeeRequest = async (e) => {
        //console.log("hihihihi");
        e.preventDefault();
        if (!selectedProjectId) {
            toast.error('Please select a project.');
            return;
        }
        if (name === '' || count === '') {
            toast.error('Please fill in all of the required fields.');
            return;
        }
        try {
            // Prepare data based on the request type (material, employee, or equipment)
            
            await employeeRequest({ name,count,seId, projectId: selectedProjectId}).unwrap()
            toast.success('Request Send')
          
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
                //toast.error(err?.data?.message || err.error)
            } else {

                toast.error('Unable to send the request');
            }
        }
    };


    const handleEquipmentRequest = async (e) => {
        //console.log("hihihihi");
        e.preventDefault();
        if (!selectedProjectId) {
            toast.error('Please select a project.');
            return;
        }
        if (name === '' || count === '') {
            toast.error('Please fill in all of the required fields.');
            return;
        }
        try {
            // Prepare data based on the request type (material, employee, or equipment)
            
            await equipmentRequest({ name,count,seId, projectId: selectedProjectId}).unwrap()
            toast.success('Request Send')
          
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
                //toast.error(err?.data?.message || err.error)
            } else {

                toast.error('Unable to send the request');
            }
        }
    };

    

    return (

        <Box sx={{ display: 'flex' }}>
            <SeSidenav />

            <Box component='main' sx={{ flexGrow: 1, p: 3, ml: -20 }}>
                
            <FormControl sx={{ minWidth: 200, marginTop: 1 }}>
                    <InputLabel id="project-label" sx={{ marginTop: -1 }}>Projects</InputLabel>
                    <Select labelId="project-label" id="project" value={project} onChange={handleChangeProject}>
                        <MenuItem value="">
                            <em>Select Project</em>
                        </MenuItem>
                        {pList.map((projectItem) => (
                            <MenuItem key={projectItem.name} value={projectItem.name}>
                                {projectItem.name}
                                
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box component='main' sx={{ flexGrow: 1, p: 3, ml: 15 }}>
                {/* <Button variant='contained' onClick={handleView}>View</Button> */}
                <h5>Enter the item for Request</h5>
                <Form onSubmit={handleMaterialRequest}> 
                <Box component="div" sx={{'& > :not(style)': { m: 0.5, width: '25ch' },}} noValidate autoComplete="off">
                 <TextField id="name" label="Item" variant="outlined" onChange={(e)=>setName(e.target.value)} />
                 <TextField id="qty" label="Quantity" variant="filled" onChange={(e)=>setQty(e.target.value)} />
                <TextField id="unit" label="Unit" variant="filled"onChange={(e)=>setUnit(e.target.value)} />
                 <Stack spacing={2} direction='row'>
                 <Button type='submit' variant='contained' onClick={() =>handleMaterialRequest()}>Send to PM</Button>
                 
                 
                
                 
                </Stack>
                
                </Box>
                </Form>

                {/* <Divider sx={{ my: 1, backgroundColor: 'black'  }} />
                            
                <h5>Employee request</h5>
                <Form onSubmit={handleEmployeeRequest}> 
                <Box component="div" sx={{'& > :not(style)': { m: 0.5, width: '25ch' },}} noValidate autoComplete="off">
                 <TextField id="name" label="Employee Type" variant="outlined" onChange={(e)=>setName(e.target.value)} />
                 <TextField id="count" label="Count" variant="filled" onChange={(e)=>setCount(e.target.value)} />
                
                 <Stack spacing={2} direction='row'>
                 <Button type='submit' variant='contained'>Send to PM</Button>

              
                </Stack>
                
                </Box>
                </Form> */}


{/* 
                <Divider sx={{ my: 1, backgroundColor: 'black' }} />
                <h5>Equipment request</h5>
                <Form onSubmit={handleEquipmentRequest}> 
                <Box component="div" sx={{'& > :not(style)': { m: 0.5, width: '25ch' },}} noValidate autoComplete="off">
                 <TextField id="name" label="Equipment Type" variant="outlined" onChange={(e)=>setName(e.target.value)} />
                 <TextField id="count" label="Count" variant="filled" onChange={(e)=>setCount(e.target.value)} />
                
                 <Stack spacing={2} direction='row'>
                 <Button type='submit' variant='contained'>Send to PM</Button>

                
                </Stack>
                </Box>
                </Form> */}
            </Box>

        </Box>
        </Box>
    )
}


export default SeRequestScreen
