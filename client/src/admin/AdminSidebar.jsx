import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Toolbar } from "@mui/material";
import { Dashboard, People, Logout, Menu } from "@mui/icons-material";

const drawerWidth = 222;

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate(); // Initialize navigation

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <>
            <IconButton onClick={toggleSidebar} sx={{ margin: 2 }}>
                <Menu />
            </IconButton>

            <Drawer
                variant="persistent"
                open={isOpen}
                sx={{
                    width: isOpen ? drawerWidth : 0,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: isOpen ? drawerWidth : 0,
                        transition: "width 0.3s",
                        overflowX: "hidden",
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <List>
                    {/* Navigate to Admin Dashboard */}
                    <ListItem button onClick={() => navigate("/admin/dashboard")}>
                        <ListItemIcon><Dashboard /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    {/* Navigate to Users Page */}
                    <ListItem button onClick={() => navigate("/admin/users")}>
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="User Management" />
                    </ListItem>
                    
                    {/* Navigate to Form statistics Page */}
                    <ListItem button onClick={() => navigate("/admin/statistics")}>
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="Form Statistics" />
                    </ListItem>

                    

                    <Divider />

                    <ListItem button onClick={() => {
                        localStorage.removeItem("authToken"); // Clear stored auth token
                        navigate("/admin"); // Redirect to admin login page
                    }}>
                        <ListItemIcon><Logout /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default AdminSidebar;
