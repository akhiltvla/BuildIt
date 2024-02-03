import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import PmSidenav from '../components/PmSidenav';
import FormContainer from '../components/FormContainer';
import { useAdminProjectListMutation } from '../slices/adminApiSlice';
import { useListDocumentMutation, useUploadDocumentMutation } from '../slices/pmApiSlice';
import { setProjectDetails } from '../slices/getProjectSlice';







const PmDocumentScreen = () => {
  const dispatch = useDispatch();
  const { pmInfo } = useSelector((state) => state.pmAuth)
  const { projectDetails } = useSelector((state) => state.getProject);
  const projectId = projectDetails && projectDetails._id;

  const [pList, setPList] = useState([]);
  const [showlist, setShowlist] = useState('');
  
  const [pListData] = useAdminProjectListMutation();
  const [project, setProject] = useState('');
  const [file, setFile] = useState(null);
  const [documentListData] = useListDocumentMutation();
  const [uploadDocument] = useUploadDocumentMutation();
 
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const handleChangeProject = (event) => {
    const selectedProjectName = event.target.value;
    const selectedProject = pList.find((project) => project.name === selectedProjectName);
    dispatch(setProjectDetails(selectedProject));
    setProject(selectedProjectName);
    setSelectedProjectId(selectedProject ? selectedProject._id : '');
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
   
  };

  const fetchProject = async () => {
    try {
      const projectResponse = await pListData();
      const allProjects = projectResponse.data;

      const projectsAssignedToPM = allProjects.filter(project => project.pm === pmInfo.name)
      setPList(projectsAssignedToPM);
    } catch (error) {
      console.error('Error fetching Project data', error);
    }
  };

  const listDocument = async () => {
    try {
      if (selectedProjectId) {
        const data = projectDetails.pdf;
        // console.log('data::', data);
        if (data) { // Check if data is an array
          setShowlist(data);
        }
      }
    } catch (error) {
      console.log('Error fetching document data', error);

    }
  };
console.log('showlist',showlist);
  const [row, setRow] = useState({});

  useEffect(() => {
    listDocument();
    fetchProject();
  }, [selectedProjectId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('pmfile', file);
      await axios.put(`http://localhost:3000/api/pms/pmdocument/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Uploaded');
      const updatedProjectResponse = await pListData();
      const updatedProjects = updatedProjectResponse.data;

      const updatedProject = updatedProjects.find(project => project._id === projectId);
      dispatch(setProjectDetails(updatedProject));
      listDocument();
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const handleDownload = (pdfUrl, documentName) => {
    // Use an anchor tag to trigger the download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  


  // const handleDelete = async (id) => {
  //   setRow(id); // Set the project ID to the state
  //   setShowConfirmationModal(true); // Show the confirmation modal
  // };

  // const confirmDelete = async () => {
  //   try {
  //     await deleteDocument(row);
  //     toast.success('Document deleted successfully.');
  //     listDocument();
  //     setShowConfirmationModal(false); // Hide the confirmation modal after successful deletion
  //   } catch (error) {
  //     console.error('Failed to delete the project:', error);
  //     toast.error('Failed to delete the project.');
  //   }
  // };



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
    { id: 'documentName', label: <strong>Document</strong>, minWidth: 500 },
   
    
    { id: 'actions', label: <strong>Actions</strong>, minWidth: 400},

  ];



  const createData = (pdfArray) => {
    return pdfArray.map((pdf) => {
      const documentName= pdf.split('/').pop(); // Extract the document name from the URL
      const specificPart = documentName.split('-').slice(1).join('-').trim();
      const finalDocumentName = specificPart.replace(/_[^_]+\.pdf$/, '.pdf');
      return {
        pdf,
        documentName:finalDocumentName,
      }
  });

  };


  const rows = showlist && showlist.length > 0 ? createData(showlist) : [];
  
  // const DeleteConfirmationModal = ({ open, handleClose, handleConfirm }) => {
  //   return (
  //     <Dialog open={open} onClose={handleClose}>
  //       <DialogTitle>Confirm Deletion</DialogTitle>
  //       <DialogContent>
  //         <DialogContentText>
  //           Are you sure you want to delete this document?
  //         </DialogContentText>
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleClose} color="primary">
  //           Cancel
  //         </Button>
  //         <Button onClick={handleConfirm} color="primary">
  //           Confirm
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   );
  // };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <PmSidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: -20 }}>
        <FormContainer>
          <FormControl sx={{ minWidth: 200, marginTop: 1 }}>
            <InputLabel id="pm-label" sx={{ marginTop: -1 }}>
              Projects
            </InputLabel>
            <Select labelId="pm-label" id="pm" value={project} onChange={handleChangeProject}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {pList.map((project) => (
                <MenuItem key={project.name} value={project.name}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="Photo">
              <Form.Control type="file" placeholder="Photo" onChange={handleFileUpload} />
            </Form.Group>
            <Button type="submit" variant="outlined" className="mt-3">
              Upload
            </Button>
          </Form>
        </FormContainer>
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
                                <Button onClick={() => handleDownload(row.pdf, row.documentName)}>View</Button>
                                {/* <Button onClick={() => handleDelete(row._id)}>Delete</Button>
                                <DeleteConfirmationModal
                                  open={showConfirmationModal}
                                  handleClose={() => setShowConfirmationModal(false)}
                                  handleConfirm={confirmDelete}
                                /> */}
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

export default PmDocumentScreen;
