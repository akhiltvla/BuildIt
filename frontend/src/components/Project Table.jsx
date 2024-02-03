import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

const columns = [
  { id: 'pcode', label: 'Code', minWidth: 80 },
  { id: 'project', label: 'Project', minWidth: 170 },
  { id: 'place', label: 'Place', minWidth: 170 },
  { id: 'client', label: 'Client', minWidth: 170 },
  { id: 'pm', label: 'Project Manager', minWidth: 100 },
  { id: 'se', label: 'Site Engineer', minWidth: 170 },
  { id: 'sdate', label: 'Start Date', minWidth: 100 },
  { id: 'edate', label: 'End Date', minWidth: 100 },

];

function createData(pcode,project,place,client,pm,se,sdate,edate) {
 
  return {pcode,project,place,client,pm,se,sdate,edate };
}

const rows = [
  createData('001','Commercial', 'Trivandrum','Asset', 'Joseph', 'John','10-05-2022', '09-11-2022'),
  createData('002','Residential', 'Thiruvalla', 'Rajesh','Raju', 'Jithu','10-05-2022', '09-11-2022'),
  createData('003','Flat', 'Kottayam', 'Skyline','Sethu', 'Ramu','10-05-2022', '09-11-2022'),
  createData('004','College', 'Kollam','Asset', 'Joseph', 'Riyas','10-05-2022', '09-11-2022'),
  
];

export default function ProjectTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (row) => {
    // Add functionality for editing the row here
    console.log('Edit clicked for:', row);
  };

  const handleDelete = (row) => {
    // Add functionality for deleting the row here
    console.log('Delete clicked for:', row);
  };

  return (
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
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
  );
}
