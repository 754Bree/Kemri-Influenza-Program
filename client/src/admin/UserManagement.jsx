import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import AdminSidebar from "./AdminSidebar";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Fetch Users from API
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/admin/users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Handle Form Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open Modal for Adding a User
    const handleOpen = () => {
        setFormData({ username: "", email: "", password: "" });
        setEditMode(false);
        setOpen(true);
    };

    // Open Modal for Editing a User
    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({ username: user.username, email: user.email, password: "" });
        setEditMode(true);
        setOpen(true);
    };

    // Create or Update User
    const handleSubmit = async () => {
        const url = editMode
            ? `http://127.0.0.1:5000/admin/users/${selectedUser.userID}`
            : "http://127.0.0.1:5000/admin/users";
        const method = editMode ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchUsers();
                setOpen(false);
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    // Delete User
    const handleDelete = async (userID) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/admin/users/${userID}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />
            <Container sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    User Management
                </Typography>

                <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
                    Add New User
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEdit(user)}
                                                sx={{ mr: 1 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(user.userID)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit User Dialog */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Username"
                            name="username"
                            fullWidth
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            name="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            name="password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editMode ? "Update" : "Create"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};

export default AdminUsers;
