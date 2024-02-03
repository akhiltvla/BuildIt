import React from 'react'
import { Box, Modal, TextField, Typography, InputLabel, MenuItem, } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormContainer from "../components/FormContainer";
import {Form} from 'react-bootstrap';
import Select from '@mui/material/Select';
import PmSidenav from '../components/PmSidenav'
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useAdminProjectListMutation } from '../slices/adminApiSlice';
import { useAddTeamMutation, useDeleteTeamMutation, useListTeamMutation } from '../slices/pmApiSlice';
import { toast } from 'react-toastify'
import Loader from '../components/Loader';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

const PmTeamScreen = () => {

    const { pmInfo } = useSelector((state) => state.pmAuth)
    const dispatch = useDispatch();
    const [tname, setTName] = useState('')
    const [trole, setTRole] = useState('');
    const [tcontact, setTContact] = useState('');
    const [temail, setTEmail] = useState('');
    const [pteam, setPTeam] = useState("");
    const [project, setProject] = useState("");
    const [tproject, setTProject] = useState("");

    const [pList, setPList] = useState([]);
    
    const [teamList, setTeamList] = useState([]);
    const [showlist, setShowlist] = useState('')
    const [openModal, setOpenModal] = useState(false);

    const [pListData] = useAdminProjectListMutation();
    const [addTeam, { isLoading }] = useAddTeamMutation();
    const [teamListData] = useListTeamMutation();
    const [teamDelete] = useDeleteTeamMutation();
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const pmId= pmInfo._id

    
    //Refer countP fromPmDocumentScreen
    //   const projectResponse =  await pListData();
    //   const allProjects = projectResponse.data;
    //   const projectsAssignedToPM = allProjects.filter(project => project.pm === projectManagerName);

    //     console.log('Projects assigned to Project Manager:', projectsAssignedToPM);

    //   console.log(projectResponse);


    const handleChangeProject = (event) => {
        const selectedProject = pList.find(project => project.name === event.target.value);
        setTProject(event.target.value);
        setSelectedProjectId(selectedProject ? selectedProject._id : "");
        // console.log('Selected Project ID:', selectedProject ? selectedProject._id : "");
      };
    

    

    const fetchProject = async () => {
        try {
            const projectResponse = await pListData();
            const allProjects = projectResponse.data;
            
            const projectsAssignedToPM = allProjects.filter(project => project.pm === pmInfo.name);
            // console.log('projectsAssignedToPM:',projectsAssignedToPM);
            setPList(projectsAssignedToPM);

        } catch (error) {
            console.error('Error fetching Projecct data', error);
        }
    };

    const [row, setRow] = useState({});

    const listTeam = async () => {
        
       try { 
        if(selectedProjectId){
         //console.log('Selected Project ID (listTeam):', selectedProjectId);
        const { data } = await teamListData( selectedProjectId )

        //  console.log('Data:',data);
        if (data) {
            setShowlist(data)
        }
    }
    }catch (error) {
        console.log('Error fetching team data',error);
    }
}




    useEffect(() => {
        listTeam()
       
        fetchProject()
    }, [selectedProjectId]);


    // console.log(showlist)

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (tname === '' || trole === '' || tcontact === '' || temail === '' || tproject ==='') {
            toast.error('Please fill in all of the required fields.');
            return;
        }

        try {

            await addTeam({ tname, trole, tcontact, temail, tproject, pmId, projectId: selectedProjectId }).unwrap()

            toast.success('Added successfully')
            handleCloseModal(); // Close the modal after form submission

            listTeam()
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
                //toast.error(err?.data?.message || err.error)
            } else {

                toast.error('Member exist');
            }

        }
    }




    const handleDelete = async (id) => {
        
        try {
            
            await teamDelete(id)
            toast.success('User deleted successfully')
            listTeam()

        } catch (error) {
            console.error('Failed to delete the user');
            toast.error('Failed to delete the project.');
        }

    }









    const modalBody = (
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
        }}
        >
            <Typography variant="h5">Add New Team Member</Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={1}>


                    <TextField label="Name" variant="outlined" onChange={(e) => setTName(e.target.value)} />
                    <TextField label="Role" variant="outlined" onChange={(e) => setTRole(e.target.value)} />
                    <TextField label="Contact" variant="outlined" onChange={(e) => setTContact(e.target.value)} />
                    <TextField label="Email" variant="outlined" onChange={(e) => setTEmail(e.target.value)} />

                    <FormControl>
                    <InputLabel id="project-label">Project</InputLabel>
                    <Select labelId="project-label" id="project" value={tproject} onChange={handleChangeProject}>
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

                    <Button type="submit" variant="contained">
                        Save
                    </Button>
                    {isLoading && <Loader />}
                </Stack>
            </form>
        </Box>
    );


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const columns = [
        { id: 'name', label: 'Name', minWidth: 200 },
        { id: 'role', label: 'Role', minWidth: 200 },
        { id: 'contact', label: 'Contact', minWidth: 200, },
        { id: 'email', label: 'Email', minWidth: 200 },
        { id: 'actions', label: 'Actions', minWidth: 200 },

    ];
    function createData(name, role, contact, email, project, _id) {

        return { name, role, contact, email, project, _id };
    }

    const rows = showlist && showlist.map((list) =>
        createData(list.name, list.role, list.contact, list.email, list.project, list._id)
    );






    return (

        <Box sx={{ display: 'flex' }}>
            <PmSidenav />
            <Box component='main' sx={{ flexGrow: 1, p: 3, ml: -20 }}>
                <h3>Team</h3>
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
                <Stack spacing={2} direction="row">
                    <Button type='button' variant="contained" onClick={()=>{
                        handleOpenModal()
                        
                    }}>Add New</Button>

                </Stack>


                <Modal open={openModal} onClose={handleCloseModal}>
                    {modalBody}
                </Modal>






                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows && rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];

                                                    if (column.id === 'actions') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>

                                                                <Button onClick={() => handleDelete(row._id)}>Delete</Button>

                                                            </TableCell>
                                                        );
                                                    } else {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    }
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>


            </Box>

        </Box>


    )
}


export default PmTeamScreen
