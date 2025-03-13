import React, { useEffect, useState } from "react";
import { Container, Typography, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
    const [activeUsers, setActiveUsers] = useState([]);

    useEffect(() => {
        fetchActiveUsers();
        const interval = setInterval(fetchActiveUsers, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchActiveUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/admin/active-users");
            const data = await response.json();
            setActiveUsers(data);
        } catch (error) {
            console.error("Error fetching active users:", error);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <CssBaseline />
            <AdminSidebar />
            <Container sx={{ flexGrow: 1, p: 5 }}>
                <Typography variant="h3" gutterBottom>
                    Dashboard
                </Typography>

                <Typography variant="h6" color="success" gutterBottom>
                    User Activity
                    <hr />
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeUsers.length > 0 ? (
                                activeUsers.map((user) => (
                                    <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span style={{ fontSize: "10px", textShadow: "0px 0px 3px " }}>
                                                {user.active_status === "green" ? "🟢" : "🔴"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default AdminDashboard;
