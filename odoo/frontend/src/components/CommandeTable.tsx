// src/components/ProductionTable.tsx
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Commande } from '../types/CommandeType';

interface Column {
    id: string;
    label: string;
  }

interface Props {
  commandes: Commande[];
  columns: Column[];
}

const getValue = (obj: any, path: string): any => {
    
    let x= path.split('.').reduce((acc, part) => acc?.[part], obj);
    //console.log("damn boy", x,"pppp", typeof x);
    return x;
};
  
const CommandeTable: React.FC<Props> = ({ commandes, columns }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortColumn, setSortColumn] = React.useState<string>('id_production');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const columnWidths: (string | number)[] = [
        10, // width for column 0
        10, // width for column 1
        10,
        10,
        10,
        10,
    ];

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const handleSort = (columnId: string) => {
        const isAsc = sortColumn === columnId && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(columnId);
      };

      const sortedData = [...commandes].sort((a, b) => {
        const aValue = getValue(a, sortColumn);
        const bValue = getValue(b, sortColumn);
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      const paginatedData = sortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

  return (
    <Paper elevation={0}> 
        <TablePagination
        component="div"
        count={commandes.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
            paddingTop:0,
            marginTop:-2,
            }}
        labelRowsPerPage="Lignes par page :"
      />
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800, tableLayout: 'fixed', }} size="small" aria-label="production table">
            <TableHead>
            <TableRow >
                {columns.map((col, index) => (
                <TableCell
                    key={col.id}
                    align="left"
                    sx={{ 
                        fontStyle: 'italic',
                        width: columnWidths[index] || 'auto',
                    }}
                    sortDirection={sortColumn === col.id ? sortDirection : false}
                >
                    <TableSortLabel
                    active={sortColumn === col.id}
                    direction={sortColumn === col.id ? sortDirection : 'asc'}
                    onClick={() => handleSort(col.id)}
                    >
                    {col.label}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id_commande || rowIndex}
                    sx={{
                        backgroundColor: 'rgba(29, 57, 148, 0.3)', // adjust opacity here
                        color: rowIndex % 2 === 0 ? 'rgb(228, 231, 239)' : 'inherit',
                        '&:hover': {
                        backgroundColor: 'rgba(29, 57, 148, 0.2)',
                        },
                    }}>
                {columns.map((col, colIndex) => {
                    const value = getValue(row, col.id);
                    const displayValue =
                    typeof value === 'number' && !Number.isInteger(value)
                        ? value.toFixed(2)
                        : value;
                    //console.log("colindex: ",colIndex,": ", columnWidths[colIndex])
                    return (
                    <TableCell
                        key={col.id}
                        align="left"
                        sx={{ width: columnWidths[colIndex] || 'auto' }}
                    >
                        {displayValue}
                    </TableCell>
                    );
                })}
                </TableRow>
            ))}
</TableBody>
        </Table>
        </TableContainer>
        
    </Paper>
  );
};

export default CommandeTable;
