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
import bcrypt from "bcryptjs"; //

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        telephone: "",
    });

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
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
        setFormData({
            username: "",
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            telephone: "",
        });
        setEditMode(false);
        setOpen(true);
    };

    // Open Modal for Editing a User
    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: "",
            telephone: user.telephone,
        });
        setEditMode(true);
        setOpen(true);
    };

    // Create or Update User
const handleSubmit = async (event) => {
    event.preventDefault();

    // If editing, send a PUT request; otherwise, send a POST request
    const method = editMode ? "PUT" : "POST";
    const url = editMode
        ? `http://127.0.0.1:5000/admin/users/${selectedUser.userID}`
        : "http://127.0.0.1:5000/admin/users";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        alert(editMode ? "User updated successfully!" : "User created successfully!");
        fetchUsers(); // Refresh the user list
        setOpen(false); // Close the modal
    } catch (error) {
        console.error("Error saving user:", error);
        alert("Failed to save user.");
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
            <Container sx={{ flexGrow: 1, p: 5 }}>
                <Typography variant="h3" gutterBottom>
                    User Management
                </Typography>

                <Button variant="contained" color="success" onClick={handleOpen} sx={{ mb: 3 }}>
                    Add New User
                
                </Button>
                        <hr />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Telephone</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.telephone}</TableCell>
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
                                    <TableCell colSpan={7} align="center">
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
                            label="First Name"
                            name="firstname"
                            fullWidth
                            value={formData.firstname}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Last Name"
                            name="lastname"
                            fullWidth
                            value={formData.lastname}
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
                        <TextField
                            margin="dense"
                            label="Telephone"
                            name="telephone"
                            fullWidth
                            value={formData.telephone}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} color="success">
                            {editMode ? "Update" : "Create"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};

export default AdminUsers;
