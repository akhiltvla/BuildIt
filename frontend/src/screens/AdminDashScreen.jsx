import React, { useState } from 'react';
import Sidenav from '../components/Sidenav';
import { Box, Modal, TextField, Typography, MenuItem, InputLabel } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useAdminPmListMutation, useAdminSeListMutation,useAdminProjectListMutation } from '../slices/adminApiSlice';
import { useDispatch } from 'react-redux';
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
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress';

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
        <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
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



const AdminDashScreen = () => {

  const [pcount,pSetCount]= useState('')
  const [pmcount,pmSetCount]= useState('')
  const [secount,seSetCount]= useState('')
  const [pmList, setPmList] = useState([]);
  const [pmListData] = useAdminPmListMutation();
  const [seListData] = useAdminSeListMutation();
  const [pListData] = useAdminProjectListMutation();
  const [projectListData] = useAdminProjectListMutation();
  const [selectedProject, setSelectedProject] = useState({})
  const [showlist, setShowlist] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);




const countP = async()=>{
const {data} =await pListData()
const pcount =data.length
pSetCount(pcount)

}

const countPm = async()=>{
  const {data} =await pmListData()
  const pmcount =data.length
  pmSetCount(pmcount)
  //  console.log(count);
  }

  const countSe = async()=>{
    const {data} =await seListData()
    const secount =data.length
    seSetCount(secount)
    //  console.log(count);
    }

    const listProject = async () => {
      const { data } = await projectListData()
       if (data) {
        setShowlist(data)
      }
  
    }
  

useEffect(()=>{
  listProject()
  countP()
  countPm()
  countSe()
},[])
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
    { id: 'name', label: 'Name', minWidth: 170, },
    { id: 'place', label: 'Place', minWidth: 170 },
    { id: 'client', label: 'Client', minWidth: 170 },
    // { id: 'pm', label: 'Project Manager', minWidth: 170 },
    // { id: 'se', label: 'Site Engineer', minWidth: 250 },
    // { id: 'sdate', label: 'Start date', minWidth: 170 },
    // { id: 'edate', label: 'End Date', minWidth: 170 },
    {
      id: 'actions',
      label: 'Progress',
      minWidth: 400,}
      
  ];
  function createData(name, place, client, pm, se, sdate, edate, _id) {

    return { name, place, client, pm, se, sdate, edate, _id };
  }

  const rows = showlist && showlist.map((list) =>
    createData(list.name, list.place, list.client, list.pm, list.se, list.sdate, list.edate, list._id)
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component='main' sx={{ flexGrow: 1, p: 3, ml: -20, display: 'flex', flexDirection: 'column' }}>
        <h3>Admin Dashboard.</h3>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
          {/* First Card */}
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Number of Projects 
              </Typography>
              <Typography sx={{ fontSize: 50 }} component="div">
              {pcount}
              </Typography>
            </CardContent>
           
          </Card>

          {/* Second Card */}
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Number of Project Managers
              </Typography>
              <Typography sx={{ fontSize: 50 }} component="div">
              {pmcount}
              </Typography>
            </CardContent>
            
          </Card>

          {/* Third Card */}
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Number of Site Engineers
              </Typography>
              <Typography sx={{ fontSize: 50 }} component="div">
              {secount}
              </Typography>
            </CardContent>
            
          </Card>
        </Box>
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
}

export default AdminDashScreen;
