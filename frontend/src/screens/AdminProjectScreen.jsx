import React from 'react'
import { Box, Modal, TextField, Typography, MenuItem, InputLabel } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import Sidenav from '../components/Sidenav'
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useProjectAdminAddMutation, useProjectAdminEditMutation, useAdminProjectListMutation, useAdminProjectDeleteMutation } from '../slices/adminApiSlice';
import { useAdminPmListMutation, useAdminSeListMutation } from '../slices/adminApiSlice';
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






const AdminProjectScreen = () => {

  const dispatch = useDispatch();
  const [pname, setPname] = useState('')
  const [pplace, setPplace] = useState('');
  const [pclient, setPclient] = useState('');
  const [ppm, setPpm] = useState("");
  const [pse, setPse] = useState('');
  const [sdate, setSdate] = useState('');
  const [edate, setEdate] = useState('');

  const [pmList, setPmList] = useState([]);
  const [seList, setSeList] = useState([]);
  const [selectedProject, setSelectedProject] = useState({})
  const [showlist, setShowlist] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPname, setEditPname] = useState('');
  const [editPplace, setEditPplace] = useState('');
  const [editPClient, setEditPClient] = useState('');
  const [editPPm, setEditPPm] = useState('');
  const [editPSe, setEditPSe] = useState('');
  const [editPSd, setEditPSd] = useState('');
  const [editPEd, setEditPEd] = useState('');
  const [addProject, { isLoading }] = useProjectAdminAddMutation();
  const [editProject] = useProjectAdminEditMutation();
  const [projectListData] = useAdminProjectListMutation();
  const [projectDelete] = useAdminProjectDeleteMutation()
  const [seListData] = useAdminSeListMutation()
  const [pmListData] = useAdminPmListMutation()


  const [editProjectData, setEditProjectData] = useState({
    pname: '',
    pplace: '',
    pclient: '',
    ppm: '',
    pse: '',
    sdate: '',
    edate: '',
  });


  const handleEdit = (id) => {
    const projectToEdit = showlist.find((project) => project._id === id);


    // console.log('pr',projectToEdit);
    setEditProjectData({
      pname: projectToEdit.name,
      pplace: projectToEdit.place,
      pclient: projectToEdit.client,
      ppm: projectToEdit.pm,
      pse: projectToEdit.se,
      sdate: projectToEdit.sdate,
      edate: projectToEdit.edate,
    });

    setEditModalOpen(true);
  };



  const handleEditSubmit = async (event) => {
    event.preventDefault();

   
    
    if (editProjectData.pname === '' ||
    editProjectData.pplace === '' ||
    editProjectData.pclient === '' ||
    editProjectData.ppm === '' ||
    editProjectData.pse === '' ||
    editProjectData.sdate === '' ||
    editProjectData.edate === '') {
    
      toast.error('Please fill in all of the required fields.');
      return;
    }
  
    if (new Date(editProjectData.edate) <= new Date(editProjectData.sdate)) {
      toast.error('End date should be after the start date');
      return;
    }

    try {

    
      await editProject({
     
        //  _id: selectedProject._id,
        // ...editProjectData,

        _id: selectedProject._id,
  pname: editProjectData.pname,
  pplace: editProjectData.pplace,
  pclient: editProjectData.pclient,
  ppm: editProjectData.ppm,
  pse: editProjectData.pse,
  sdate: editProjectData.sdate,
  edate: editProjectData.edate,
      })

      // Handle success, e.g., close the edit modal, show success message, etc.
      toast.success('Project updated successfully.');
      setEditModalOpen(false);
      listProject(); // Update the project list
    } catch (error) {
      // Handle error, show error message, etc.
      toast.error('Failed to update project.');
    }
  };




  const handleChangePpm = (event) => {
    setPpm(event.target.value);
  };

  const handleChangePse = (event) => {
    setPse(event.target.value);
  };

  const listProject = async () => {
    const { data } = await projectListData()
    if (data) {
      setShowlist(data)
    }

  }

  const fetchPmAndSeList = async () => {
    try {
      const pmResponse = await pmListData();
      const seResponse = await seListData();

      const pmData = pmResponse.data;
      const seData = seResponse.data;

      setPmList(pmData);
      setSeList(seData);
    } catch (error) {
      console.error('Error fetching PM and SE data', error);
    }
  };

  useEffect(() => {
    listProject()

    fetchPmAndSeList()
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log('name:',pname,pplace,pclient,ppm,pse,sdate);

    if (pname === '' || pplace === '' || pclient === '' || ppm === '' || pse === '' || sdate === '' || edate === '') {

      toast.error('Please fill in all of the required fields.');
      return;
    }

    if (new Date(edate) <= new Date(sdate)) {
      toast.error('End date shouldbe after the start date')
      return
    }

    try {
      await addProject({ pname, pplace, pclient, ppm, pse, sdate, edate }).unwrap()

      toast.success('Added successfully')
      handleCloseModal(); // Close the modal after form submission
      listProject()
      //  listProject()
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        //toast.error(err?.data?.message || err.error)
      } else {
        toast.error('Project exist');
      }

    }
  }
  const [row, setRow] = useState({});

  const handleView = (id) => {

    const project = showlist.find((project) => project._id === id);
    setSelectedProject(project);
    setOpenViewModal(true);
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleDelete = async (id) => {
    setRow(id); // Set the project ID to the state
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await projectDelete(row);
      toast.success('Project deleted successfully.');
      listProject();
      setShowConfirmationModal(false); // Hide the confirmation modal after successful deletion
    } catch (error) {
      console.error('Failed to delete the project:', error);
      toast.error('Failed to delete the project.');
    }
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
      <Typography variant="h5">Add New Projects</Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>


          <TextField label="Projects" variant="outlined" onChange={(e) => setPname(e.target.value)} />
          <TextField label="Place" variant="outlined" onChange={(e) => setPplace(e.target.value)} />
          <TextField label="Client" variant="outlined" onChange={(e) => setPclient(e.target.value)} />

          <FormControl>
            <InputLabel id="pm-label">Project Manager</InputLabel>
            <Select labelId="pm-label" id="pm" value={ppm} onChange={handleChangePpm}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {pmList.map((pm) => (
                <MenuItem key={pm.name} value={pm.name}>
                  {pm.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl >
            <InputLabel id="se-label">Site Engineer</InputLabel>
            <Select labelId="se-label" id="se"
              value={pse} onChange={handleChangePse}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {seList.map((se) => (
                <MenuItem key={se.name} value={se.name}>
                  {se.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>




          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Start Date" variant="outlined" onChange={(date) => setSdate(date)} />
            </DemoContainer>
          </LocalizationProvider>
          {/* <TextField label="Start Date" variant="outlined" onChange={(e) => setSdate(e.target.value)} /> */}


          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="End Date" variant="outlined" onChange={(date) => setEdate(date)} />
            </DemoContainer>
          </LocalizationProvider>
          {/* <TextField label="End Date" variant="outlined" onChange={(e) => setEdate(e.target.value)} /> */}


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
    { id: 'name', label: 'Name', minWidth: 170, },
    { id: 'place', label: 'Place', minWidth: 170 },
    { id: 'client', label: 'Client', minWidth: 170 },
    // { id: 'pm', label: 'Project Manager', minWidth: 170 },
    // { id: 'se', label: 'Site Engineer', minWidth: 250 },
    // { id: 'sdate', label: 'Start date', minWidth: 170 },
    // { id: 'edate', label: 'End Date', minWidth: 170 },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 400,
    }

  ];
  function createData(name, place, client, pm, se, sdate, edate, _id) {

    return { name, place, client, pm, se, sdate, edate, _id };
  }

  const rows = showlist && showlist.map((list) =>
    createData(list.name, list.place, list.client, list.pm, list.se, list.sdate, list.edate, list._id)
  );

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
            boxShadow: 24,
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
        <h3>Projects</h3>
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
                              <TableCell key={column.id} align={column.align} sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={() => handleView(row._id)}>View</Button>
                                <Button variant="outlined" onClick={() => handleEdit(row._id)}>Edit</Button>
                                
                                <Button variant="outlined" onClick={() => handleDelete(row._id)}>Delete</Button>

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

        <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <Box
          sx={{
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
          <Typography variant="h5">Edit Project</Typography>
          <form onSubmit={handleEditSubmit}>
            <Stack spacing={1}>
         
              <TextField label="Projects" variant="outlined" value={editProjectData.pname} onChange={(e) =>setEditProjectData({...editProjectData,pname: e.target.value,})} />
              <TextField label="Place" variant="outlined" value={editProjectData.pplace} onChange={(e) =>setEditProjectData({...editProjectData,pplace: e.target.value,})} />
              <TextField label="Client" variant="outlined" value={editProjectData.pclient} onChange={(e) =>setEditProjectData({...editProjectData,pclient: e.target.value,})} />
              

              <FormControl>
            <InputLabel id="pm-label">Project Manager</InputLabel>
            <Select labelId="pm-label" id="pm" value={editProjectData.ppm} onChange={(e) => setEditProjectData({...editProjectData,ppm: e.target.value,})}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {pmList.map((pm) => (
                <MenuItem key={pm.name} value={pm.name}>
                  {pm.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl>
            <InputLabel id="se-label">Site Engineer</InputLabel>
            <Select labelId="se-label" id="se" value={editProjectData.pse} onChange={(e) => setEditProjectData({...editProjectData,pse: e.target.value,})}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {seList.map((se) => (
                <MenuItem key={se.name} value={se.name}>
                  {se.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Start Date" variant="outlined"  onChange={(date) => setEditProjectData({...editProjectData, sdate: date})} />
            </DemoContainer>
          </LocalizationProvider>
  
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="End Date" variant="outlined"   onChange={(date) => setEditProjectData({...editProjectData, edate: date})} />
            </DemoContainer>
          </LocalizationProvider>


              <Button type="submit" variant="contained">
                Update
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>


      </Box>
      
    </Box>
  )
}

export default AdminProjectScreen