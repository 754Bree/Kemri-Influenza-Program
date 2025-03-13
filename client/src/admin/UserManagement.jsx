import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import AdminSidebar from "./AdminSidebar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({ username: "", firstname: "", lastname: "", email: "", telephone: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (userID) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${userID}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpen = (user = null) => {
    setEditUser(user || { username: "", firstname: "", lastname: "", email: "", telephone: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser({ username: "", firstname: "", lastname: "", email: "", telephone: "" });
  };

  const handleSave = async () => {
    try {
      if (editUser?.userID) {
        await axios.put(`http://localhost:5000/admin/users/${editUser.userID}`, editUser);
      } else {
        await axios.post("http://localhost:5000/admin/users", editUser);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, padding: "3%" }}>
        <Typography variant="h3">User Management</Typography>
        <br />
        <Button variant="contained" color="success" onClick={() => handleOpen()}>Add User</Button>
        <hr />
        <TableContainer component={Paper} sx={{ minWidth: 650 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telephone</TableCell>
              
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userID}>
                  <TableCell>{user.userID}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  
                  <TableCell>
                    <Button onClick={() => handleOpen(user)} color="primary">Edit</Button>
                    <Button onClick={() => handleDelete(user.userID)} color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* User Form Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editUser?.userID ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField label="Username" fullWidth margin="dense" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
            <TextField label="First Name" fullWidth margin="dense" value={editUser.firstname} onChange={(e) => setEditUser({ ...editUser, firstname: e.target.value })} />
            <TextField label="Last Name" fullWidth margin="dense" value={editUser.lastname} onChange={(e) => setEditUser({ ...editUser, lastname: e.target.value })} />
            <TextField label="Email" fullWidth margin="dense" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
            <TextField label="Telephone" fullWidth margin="dense" value={editUser.telephone} onChange={(e) => setEditUser({ ...editUser, telephone: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsers;
