import React, { useState, useEffect } from 'react';
import { Toolbar, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Skeleton } from '@mui/material';
import Sidebar from '../components/sidebar';
import axios from 'axios';

const EmployeeCredentials = () => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');

    const fetchEmployees = async (query = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/employees?q=${query}`);
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSearch = () => {
        fetchEmployees(search);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p:6 }}>
                <Toolbar>

                    <Typography variant="h4" color='#9E4B02'>Employee Details</Typography>
                    
                    <Box sx={{ marginLeft: 'auto' }}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            color='warning'
                            sx={{ mr: 1 }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <Button variant="contained" color= 'warning' onClick={handleSearch}>Search</Button>
                        <hr/>
                    </Box>
                </Toolbar>
                <TableContainer component={Paper} sx={{ p:3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['eSN', 'Firstname', 'Lastname', 'Username', 'Email', 'Telephone', 'Status'].map((header) => (
                                    <TableCell key={header} align="center" style={{ fontWeight: 'bold' }}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        {Array.from({ length: 7 }).map((_, i) => (
                                            <TableCell key={i} align="center">
                                                <Skeleton variant="text" width={100} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                employees.map((employee) => (
                                    <TableRow key={employee.eSN}>
                                        <TableCell align="center">{employee.eSN}</TableCell>
                                        <TableCell align="center">{employee.firstname}</TableCell>
                                        <TableCell align="center">{employee.lastname}</TableCell>
                                        <TableCell align="center">{employee.username}</TableCell>
                                        <TableCell align="center">{employee.email}</TableCell>
                                        <TableCell align="center">{employee.telephone}</TableCell>
                                        <TableCell align="center">{employee.status}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default EmployeeCredentials;
