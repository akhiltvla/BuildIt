import React, { useEffect, useState } from 'react';
import PmSidenav from '../components/PmSidenav';
import Typography from '@mui/material/Typography';
import { Box, Modal} from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {useSelector} from 'react-redux'
import { Container} from 'react-bootstrap';
import { useAdminProjectListMutation, useAdminPmListMutation } from '../slices/adminApiSlice';
import Loader from '../components/Loader';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import FormLabel from "@mui/material/FormLabel";
import PropTypes from 'prop-types'
import { format } from 'date-fns';


const LinearProgressWithLabel = ({projectData})=> {
  const startDate = new Date(projectData.sdate);
  const endDate = new Date(projectData.edate);
  const currentDate = new Date();

  const progress = Math.min(100, ((currentDate - startDate) / (endDate - startDate)) * 100);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`Progress${Math.round(progress)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  projectData: PropTypes.shape({
    sdate: PropTypes.string.isRequired,
    edate: PropTypes.string.isRequired,
  }).isRequired,
};





const PmDashScreen = () => {


  const {pmInfo} = useSelector((state)=> state.pmAuth)
  //  console.log(pmInfo);

  const [pListData] = useAdminProjectListMutation();
  const [pmListData] = useAdminPmListMutation();
  const [showlist, setShowlist] = useState('')
  
  const [selectedProject, setSelectedProject] = useState({})
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [projectsAssignedToPM, setProjectsAssignedToPM] = useState([]);

   const [progress, setProgress] = useState(0);

  const pmProjects = async () => {
    try {
      // Use the project manager ID from pmInfo
      const projectManagerName = pmInfo ? pmInfo.name : null;
      //  console.log('PM Name:',pmInfo.name);
      if (!projectManagerName) {
        console.error('No project manager found');
        return;
      }

      // Fetch the projects assigned to the selected project manager
      const projectResponse = await pListData();
      const allProjects = projectResponse.data;

    // Filter projects based on the project manager's name
    const projectsAssignedToPM = allProjects.filter(project => project.pm === projectManagerName);

    // console.log('Projects assigned to Project Manager:', projectsAssignedToPM);
    // You can set the projectsAssignedToPM to the component state or use them as needed
    setProjectsAssignedToPM(projectsAssignedToPM);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};
          useEffect(()=>{
            pmProjects()
            // const timer = setInterval(() => {
            //   setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
            // }, 800);
            
          },[pmInfo])
    

          const handleOpenModal = () => {
            setOpenModal(true);
          };
        
          const handleCloseModal = () => {
            setOpenModal(false);
          };
        

          const [row, setRow] = useState({});

          const handleView = (id) => {
            console.log('ID:::',id);
            const project = projectsAssignedToPM.find((project) => project._id === id);
            setSelectedProject(project);
            setOpenViewModal(true);
          };
          const handleCloseViewModal = () => {
            setOpenViewModal(false);
          };


          const ViewProjectModal = ({ open, handleClose, projectData }) => {
            return (
              <Modal open={open} onClose={handleClose}>
          
                 <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',      
                    boxShadow:24,
                    p: 4,
                  }}>         
          <Typography variant="h5">Project Details</Typography>
          
          <Typography>Name: {projectData.name}</Typography>
                <Typography>Place: {projectData.place}</Typography>
                <Typography>Client: {projectData.client}</Typography>
                <Typography>Project Manager: {projectData.pm}</Typography>
                <Typography>Site Engineer: {projectData.se}</Typography>
                <Typography>Start Date: {new Date(projectData.sdate).toLocaleDateString('en-GB')}</Typography>
                <Typography>End Date: {new Date(projectData.edate).toLocaleDateString('en-GB')}</Typography>
                </Box>
              </Modal>
            );
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
          const columns = [
            { id: 'name', label: 'Name', minWidth: 150, },
            { id: 'place', label: 'Place', minWidth: 150 },
            { id: 'client', label: 'Client', minWidth: 150 },
            // { id: 'pm', label: 'Project Manager', minWidth: 170 },
            // { id: 'se', label: 'Site Engineer', minWidth: 250 },
            // { id: 'sdate', label: 'Start date', minWidth: 170 },
            // { id: 'edate', label: 'End Date', minWidth: 170 },
            {
              id: 'actions',
              label: 'Progress',
              minWidth: 460,}
              
          ];
          function createData(name, place, client, pm, se, sdate, edate, _id) {
        
            return { name, place, client, pm, se, sdate, edate, _id };
          }
        
          const rows = projectsAssignedToPM && projectsAssignedToPM.map((list) =>
            createData(list.name, list.place, list.client, list.pm, list.se, list.sdate, list.edate, list._id)
          );
      
          
          
          
          
  return (

    <Box sx={{ display: 'flex' }}>
    <PmSidenav />
    <Box component='main' sx={{ flexGrow: 1, p: 3, ml: -20, display: 'flex', flexDirection: 'column' }}>
    <h3>
  Projects under {pmInfo.name}
  
</h3>
      {/* <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>Welcome {pmInfo.name}</h1>
          
          {projectsAssignedToPM.map((project) => (
                <div key={project._id} className="mb-2">
                  <strong>Name:</strong> {project.name}, <strong>Place:</strong> {project.place}, <strong>Client:</strong> {project.client}
                </div>
              ))}
        </Card>
      </Container>
    </div>  */}

<ViewProjectModal open={openViewModal} handleClose={handleCloseViewModal} projectData={selectedProject} />


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
                                <Button onClick={() => handleView(row._id)}>View</Button>
                                
                <LinearProgressWithLabel projectData={row} />
          

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
    
  );
};

export default PmDashScreen;