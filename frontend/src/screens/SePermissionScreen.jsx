import React from 'react'
import { Box, Modal, TextField, Divider, Typography, InputLabel, MenuItem} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import SeSidenav from '../components/SeSidenav';
import FormContainer from "../components/FormContainer";
import {Form} from 'react-bootstrap';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useAdminProjectListMutation } from '../slices/adminApiSlice';

import { useListRequestSeMutation} from '../slices/userApiSlice'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';




  

const SePermissionScreen = () => {

    const { userInfo } = useSelector((state) => state.auth)
    const {pmInfo} = useSelector((state)=> state.pmAuth)
    const {projectDetails} = useSelector((state)=> state.getProject)
    const dispatch = useDispatch();
    const [name, setName] = useState('')
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('');
    const [count, setCount] = useState(''); 
    const [project, setProject] = useState("");
    const [pList, setPList] = useState([]);
    const [showlist, setShowlist] = useState('')
    const [pListData] = useAdminProjectListMutation();
   
    const [listRequest] = useListRequestSeMutation()
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedProject, setSelectedProject] = useState({})
    const [openModal, setOpenModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [projectsAssignedToPM, setProjectsAssignedToPM] = useState([]);
    const seId= userInfo._id

    const handleChangeProject = (event) => {
        const selectedProject = pList.find(project => project.name === event.target.value);
        setProject(event.target.value);
        setSelectedProjectId(selectedProject ? selectedProject._id : "");
        // console.log('Materialrequest:',materialRequest.find(request => request.projectId === event.target.value));
        
      };


      const seRequests = async() =>{
        
        try {
          if(selectedProjectId){
            const { data } = await listRequest( selectedProjectId )

         if (data) {
            setShowlist(data)
        }
      }
        } catch (error) {
            console.error('Error fetching Request data', error);
        }
      }

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
        seRequests()
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
        { id: 'materialName', label: 'Item Name', minWidth: 250, },
        { id: 'qty', label: 'Quantity', minWidth: 100, },
        { id: 'unit', label: 'Unit', minWidth: 100, },
        { id: 'createdAt', label: 'Date', minWidth: 100, },
      
        { id: 'actions', label: 'Response', minWidth: 400 },
    
      ];

      function createData(materialArray, _id, createdAt,ispermit, isreject) {
        const rows=[]
        materialArray.forEach((material,index) => {
            rows.push({
                materialName: material.name,
                qty:material.qty,
                unit: material.unit,
                _id: index ===0? _id:'',
                createdAt: new Date(createdAt).toLocaleDateString(),
                ispermit,
                isreject,
            })
        })
        return rows.sort((a, b) => b.createdAt - a.createdAt);
      }
    
      const rows = showlist && showlist.map((list) =>
        createData(list.material, list._id, list.createdAt,list.ispermit, list.isreject,)
      ).flat()

    
     

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
                            console.log('Debug: row.ispermit', row.ispermit);
                            console.log('Debug: row.isreject', row.isreject);
                            return (
                              <TableCell key={column.id} align={column.align}>
                                 
                                  

                                 {!row.ispermit && !row.isreject &&
                                  (
                                    <Typography color='orange' variant="h8" component="h8">Pending </Typography>
                                  )
                                }

                                {row.ispermit && (

                                  <Typography color='green' variant="h8" component="h8">Permitted </Typography>
                                )}

                                {row.isreject && (
                                  <Typography color='red' variant="h8" component="h8">Rejected </Typography>
                                )}
                                    
                            

                                    
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


export default SePermissionScreen
