import React from 'react'
import { Box, Modal, TextField, Typography, InputLabel, MenuItem, } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormContainer from "../components/FormContainer";
import {Form} from 'react-bootstrap';
import Select from '@mui/material/Select';
import SeSidenav from '../components/SeSidenav'
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useAdminProjectListMutation } from '../slices/adminApiSlice';
import { useListTeamSeMutation } from '../slices/userApiSlice';
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

const SeTeamScreen = () => {

    const { userInfo } = useSelector((state) => state.auth)
  
    const dispatch = useDispatch();

    const [project, setProject] = useState("");
    const [tproject, setTProject] = useState("");

    const [pList, setPList] = useState([]);
    
    const [teamList, setTeamList] = useState([]);
    const [showlist, setShowlist] = useState('')
    const [openModal, setOpenModal] = useState(false);

    const [pListData] = useAdminProjectListMutation();
    
    const [teamListDataSe] = useListTeamSeMutation();

    const [selectedProjectId, setSelectedProjectId] = useState("");
    const seId= userInfo._id


    
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
            
            const projectsAssignedToSE = allProjects.filter(project => project.se === userInfo.name);
       //      console.log('projectsAssignedToSE:',projectsAssignedToSE);
            setPList(projectsAssignedToSE);

        } catch (error) {
            console.error('Error fetching Projecct data', error);
        }
    };

    const [row, setRow] = useState({});

    const listTeamSe = async () => {

       try { 
        if(selectedProjectId){
        // console.log('Selected Project ID (listTeam):', selectedProjectId);
        const { data } = await teamListDataSe( selectedProjectId )

         console.log('Data:',data);
        if (data) {
            setShowlist(data)
        }
    }
    }catch (error) {
        console.log('Error fetching team data',error);
    }
}




    useEffect(() => {
        listTeamSe()
       
        fetchProject()
    }, [selectedProjectId]);


    // console.log(showlist)

   


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
        // { id: 'actions', label: 'Actions', minWidth: 200 },

    ];
    function createData(name, role, contact, email, project, _id) {

        return { name, role, contact, email, project, _id };
    }

    const rows = showlist && showlist.map((list) =>
        createData(list.name, list.role, list.contact, list.email, list.project, list._id)
    );






    return (

        <Box sx={{ display: 'flex' }}>
            <SeSidenav />
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

                                                                {/* <Button onClick={() => handleDelete(row._id)}>Delete</Button> */}

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


export default SeTeamScreen
