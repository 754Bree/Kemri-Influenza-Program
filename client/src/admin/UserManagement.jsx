import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import AdminSidebar from "./AdminSidebar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (userID) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${userID}`);
      fetchUsers();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleSuspend = async (userID) => {
    try {
      await axios.put(`http://localhost:5000/admin/users/${userID}/suspend`);
      fetchUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, padding: "3%" }}>
        <Typography variant="h3">User Management</Typography>
        <br />
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
                <TableCell>Status</TableCell>
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
                  <TableCell style={{ color: user.is_active ? "green" : "red" }}>{user.is_active ? "Active" : "Suspended"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleSuspend(user.userID)} color="warning" disabled={!user.is_active}>Suspend</Button>
                    <Button onClick={() => handleDelete(user.userID)} color="secondary">Remove User</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AdminUsers;
