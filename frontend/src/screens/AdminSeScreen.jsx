import React from 'react'
import { Box, Modal, TextField, Typography } from '@mui/material'
import Sidenav from '../components/Sidenav'
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSeAdminAddMutation, useAdminSeListMutation, useAdminSeDeleteMutation, useAdminSeBlockMutation, useAdminSeUnBlockMutation, useAdminSeAuthoriseMutation } from '../slices/adminApiSlice';
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

const AdminSeScreen = () => {

  const dispatch = useDispatch();
  const [sename, setSeName] = useState('')
  const [seemail, setSeEmail] = useState('');
  const [sepassword, setSePassword] = useState('');
  const [secontact, setSeContact] = useState('');
  const [jdate, setJdate] = useState('');

  const [showlist, setShowlist] = useState('')
  const [openModal, setOpenModal] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedSe, setSelectedSe] = useState({});
  const [selectedProject, setSelectedProject] = useState({})
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [addSe, { isLoading }] = useSeAdminAddMutation();
  const [seListData] = useAdminSeListMutation();
  const [seDelete] = useAdminSeDeleteMutation()
  const [seBlock] = useAdminSeBlockMutation()
  const [seUnBlock] = useAdminSeUnBlockMutation()
  const [seAuthorise] = useAdminSeAuthoriseMutation()

 
   
  const [row, setRow] = useState({});

  const listSe = async () => {
    const { data } = await seListData()
    if (data) {
      setShowlist(data)
    }

  }
  


  useEffect(() => {
    listSe()
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

    if (sename === '' || seemail === '' || sepassword === '' || secontact === '' || jdate === '') {
      toast.error('Please fill in all of the required fields.');
      return;
    }
    try {
      await addSe({ sename, secontact, seemail, sepassword, jdate }).unwrap()

      toast.success('Added successfully')
      handleCloseModal(); // Close the modal after form submission

      listSe()
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        //toast.error(err?.data?.message || err.error)
      } else {
        toast.error('Site Engineer exist with same Email id');
      }

    }
  }


  const handleDelete = async (id) => {
    setRow(id); // Set the project ID to the state
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await seDelete(row);
      setShowConfirmationModal(false);
      toast.success('SE deleted successfully.');
      listSe();
       // Hide the confirmation modal after successful deletion
    } catch (error) {
      console.error('Failed to delete the SE:', error);
      toast.error('Failed to delete the SE.');
    }
  };

const handleBlock = async (id) => {
  try {
  
   const {data} = await seBlock(id) 


    if (data) {
      toast.success('User blocked successfully');
   
      listSe(); // Refresh the list of users
    } else {
      toast.error('Failed to block the user');
    }
  } catch (error) {
    console.error('Error blocking user:', error);
  }
};


const handleUnBlock = async (id) => {
  try {
  
   const {data} = await seUnBlock(id)


    if (data) {
      toast.success('User unblocked successfully');
   
      listSe(); // Refresh the list of users
    } else {
      toast.error('Failed to unblock the user');
    }
  } catch (error) {
    console.error('Error unblocking user:', error);
  }
};

const handleAuthorise = async (id) => {
  try {
    const {data} = await seAuthorise(id)
    console.log(data);
    if(data){
      toast.success('User Authorise successfully');
   
      listSe(); // Refresh the list of users
    } else {
      toast.error('Failed to Authorise the user');
    }
  }
  catch (error) {
    console.error('Error authorise user:', error);
  }
}

const handleView = (id) => {
  const se = showlist.find((se) => se._id === id);
  setSelectedSe(se);
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
      <Typography variant="h5">Add New Site Engineer</Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>


          <TextField label="Site Engineer Name" variant="outlined" onChange={(e) => setSeName(e.target.value)} />
          <TextField label="Contact" variant="outlined" onChange={(e) => setSeContact(e.target.value)} />
          <TextField label="Email" variant="outlined" onChange={(e) => setSeEmail(e.target.value)} />
          <TextField label="Password" variant="outlined" onChange={(e) => setSePassword(e.target.value)} />
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
  function createData(name, email, contact, jdate, _id, isblocked, isauthorise) {

    return { name, email, contact, jdate, _id, isblocked, isauthorise };
  }

  const rows = showlist && showlist.map((list) =>
    createData(list.name, list.email, list.contact, list.jdate, list._id,list.isblocked, list.isauthorise)
  );


  const ViewSeModal = ({ open, handleClose, seData }) => {
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
  <Typography variant="h5">Site Engineer Details</Typography>
  
  <Typography>Name: {seData.name}</Typography>
        <Typography>Email: {seData.email}</Typography>
        <Typography>Contact: {seData.contact}</Typography>
        <Typography>Joining Date: {new Date(seData.jdate).toLocaleDateString('en-GB')}</Typography>
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
        <h3>Site Engineers</h3>
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleOpenModal}>Add New</Button>

        </Stack>


        <Modal open={openModal} onClose={handleCloseModal}>
          {modalBody}
        </Modal>

        <DeleteConfirmationModal
          open={showConfirmationModal}
          handleClose={() => setShowConfirmationModal(false)}
          handleConfirm={confirmDelete}
        />

        <ViewSeModal open={openViewModal} handleClose={handleCloseViewModal} seData={selectedSe} />
       
        

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
                              <TableCell key={column.id} align={column.align} sx={{display: 'flex', gap: 1}}>
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


export default AdminSeScreen
