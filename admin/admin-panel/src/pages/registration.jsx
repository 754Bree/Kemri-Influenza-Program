import React from 'react';
import { Toolbar, Typography, Box, Button, Paper } from '@mui/material';
import Sidebar from '../components/sidebar';

const UserManagement = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
                <Toolbar>
                    <Typography variant="h3" color="#9E4B02">User Management</Typography>
                    
                </Toolbar>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
                    <Button variant="contained" sx={{ bgcolor: 'darkgoldenrod', color: 'white' }}>Update Existing User</Button>
                    <Button variant="contained" sx={{ bgcolor: 'crimson', color: 'white' }}>Delete User Account</Button>
                </Box>
                <Paper elevation={3} sx={{ mt: 3, p: 2, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body1" color="#9E4B02">User Information Will Appear Here</Typography>
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained"  color = 'success' sx={{}}>Confirm</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UserManagement;
