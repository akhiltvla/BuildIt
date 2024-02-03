import React from 'react'
import { Box, Modal, TextField, Typography } from '@mui/material'
import Sidenav from '../components/Sidenav'
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePmAdminAddMutation, useAdminPmListMutation, useAdminPmDeleteMutation, useAdminPmBlockMutation, useAdminPmUnBlockMutation, useAdminPmAuthoriseMutation } from '../slices/adminApiSlice';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { pmLogout } from '../slices/pmAuthSlice';
import { usePmLogoutMutation } from '../slices/pmApiSlice';
import { useSelector } from 'react-redux';


const AdminPmScreen = () => {
  const pmInfo = useSelector((state) => state.pmAuth.pmInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [pmname, setPmName] = useState('')
  const [pmemail, setPmEmail] = useState('');
  const [pmpassword, setPmPassword] = useState('');
  const [pmcontact, setPmContact] = useState('');
  const [jdate, setJdate] = useState('');

  const [showlist, setShowlist] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState({})
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedPm, setSelectedPm] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  



  const [addPm, { isLoading }] = usePmAdminAddMutation();
  const [pmListData] = useAdminPmListMutation();
  const [pmDelete] = useAdminPmDeleteMutation();
  const [pmBlock] = useAdminPmBlockMutation()
  const [pmUnBlock] = useAdminPmUnBlockMutation()
  const [pmAuthorise] = useAdminPmAuthoriseMutation()
  const [pmlogoutApiCall] = usePmLogoutMutation()

 
  const [row, setRow] = useState({});

  const listPm = async()=>{

    const {data} = await pmListData()
   
    // console.log('count:',data.length);
    if(data){
      setShowlist(data)
    }

  }
 
  


  useEffect(() => {
    listPm()
  }, []);


  // console.log(showlist)

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (pmname === '' || pmemail === '' || pmpassword === '' || pmcontact === '' || jdate === '') {
      toast.error('Please fill in all of the required fields.');
      return;
    }
    try {
      await addPm({ pmname, pmcontact, pmemail, pmpassword, jdate }).unwrap()

      toast.success('Added successfully')
      handleCloseModal(); // Close the modal after form submission

      listPm()
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        //toast.error(err?.data?.message || err.error)
      } else {
        toast.error('Project Manager exist with same Email id');
      }

    }
  }




  const handleDelete = async (id) => {
    setRow(id); // Set the project ID to the state
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await pmDelete(row);
      toast.success('PM deleted successfully.');
      listPm();
      setShowConfirmationModal(false); // Hide the confirmation modal after successful deletion
    } catch (error) {
      console.error('Failed to delete the PM:', error);
      toast.error('Failed to delete the PM.');
    }
  };


  const pmlogoutHandler = async () => {
    
    try {
      await pmlogoutApiCall().unwrap()
      dispatch(pmLogout())
      //navigate('/')
     console.log('loggedout');
    } catch (err) {
      console.log(err);
    }
  }


  const handleBlock = async (id) => {
    try {
    
     const {data} = await pmBlock(id)
  
  
      if (data) {

        toast.success('PM blocked successfully');
     
        pmlogoutHandler()


        listPm(); // Refresh the list of users
        
      } else {
        toast.error('Failed to block the PM');
      }
    } catch (error) {
      console.error('Error blocking PM:', error);
    }
  };



  const handleUnBlock = async (id) => {
    try {
    
     const {data} = await pmUnBlock(id)
  
  
      if (data) {
        toast.success('PM unblocked successfully');
     
        listPm(); // Refresh the list of users
      } else {
        toast.error('Failed to unblock the PM');
      }
    } catch (error) {
      console.error('Error unblocking PM:', error);
    }
  };


  const handleAuthorise = async (id) => {
    try {
      const {data} = await pmAuthorise(id)
      if(data){
        toast.success('User Authorise successfully');
     
        listPm(); // Refresh the list of users
      } else {
        toast.error('Failed to Authorise the user');
      }
    }
    catch (error) {
      console.error('Error authorise user:', error);
    }
  }


  
  const handleView = (id) => {
    const pm = showlist.find((pm) => pm._id === id);
    setSelectedPm(pm);
    setOpenViewModal(true);
  };
  
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };
  



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
      <Typography variant="h5">Add New Project Manager</Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>


          <TextField label="Project Manager Name" variant="outlined" onChange={(e) => setPmName(e.target.value)} />
          <TextField label="Contact" variant="outlined" onChange={(e) => setPmContact(e.target.value)} />
          <TextField label="Email" variant="outlined" onChange={(e) => setPmEmail(e.target.value)} />
          <TextField label="Password" variant="outlined" onChange={(e) => setPmPassword(e.target.value)} />
          {/* <TextField label="Address" variant="outlined" /> */}
          {/* <TextField label="Joining Date" variant="outlined" onChange={(e) => setJdate(e.target.value)} /> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
           <DatePicker label="Joining Date" variant="outlined" onChange={(date) => setJdate(date)}/>
           </DemoContainer>
          </LocalizationProvider>

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
    { id: 'name', label: 'Name', minWidth: 250, },
    { id: 'email', label: 'Email', minWidth: 250 },
    { id: 'actions', label: 'Actions', minWidth: 400 },

  ];
  function createData(name, email, contact, jdate,_id,isblocked,isauthorise) {

    return { name, email, contact, jdate, _id, isblocked,isauthorise };
  }

  const rows = showlist && showlist.map((list) =>
    createData(list.name, list.email, list.contact, new Date(list.jDate).toLocaleDateString(), list._id, list.isblocked,list.isauthorise)
  );




  const ViewPmModal = ({ open, handleClose, pmData }) => {
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
  <Typography variant="h5">Project Manager Details</Typography>
  
  <Typography>Name: {pmData.name}</Typography>
        <Typography>Email: {pmData.email}</Typography>
        <Typography>Contact: {pmData.contact}</Typography>
        <Typography>Joining Date: {new Date(pmData.jdate).toLocaleDateString('en-GB')}</Typography>
        </Box>
      </Modal>
    );
  };


  const DeleteConfirmationModal = ({ open, handleClose, handleConfirm }) => {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (

    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component='main' sx={{ flexGrow: 1, p: 3, ml: -20 }}>
        <h3>Project managers</h3>
        <Stack spacing={2} direction="row">
          <Button type='button'variant="contained" onClick={handleOpenModal}>Add New</Button>

        </Stack>


        <Modal open={openModal} onClose={handleCloseModal}>
          {modalBody}
        </Modal>

        <DeleteConfirmationModal
          open={showConfirmationModal}
          handleClose={() => setShowConfirmationModal(false)}
          handleConfirm={confirmDelete}
        />

        <ViewPmModal open={openViewModal} handleClose={handleCloseViewModal} pmData={selectedPm} />
       


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
                              <TableCell key={column.id} align={column.align} sx={{ display: 'flex', gap: 1 }}>
                                
                                <Button variant='outlined' onClick={() => handleView(row._id)}>View</Button>
                                
                                {!row.isauthorise ?  (<Button variant='outlined' onClick={() => handleAuthorise(row._id)}>Authorise</Button>)
                                    
                                 : null
                              }
                                
                                <Button variant='outlined' onClick={() => handleDelete(row._id)}>Delete</Button>
                                {row.isblocked ? (
                                   <Button variant='outlined' onClick={() => handleUnBlock(row._id)}>Unblock</Button>
                                     ) : (
                                   <Button variant='outlined' onClick={() => handleBlock(row._id)}>Block</Button>
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


export default AdminPmScreen
