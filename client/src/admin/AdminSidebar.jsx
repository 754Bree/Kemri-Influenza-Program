import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Toolbar } from "@mui/material";
import { Dashboard, People, Settings, Logout, Menu } from "@mui/icons-material";

const drawerWidth = 222;

const AdminSidebar = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(true);

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
                    <ListItem button onClick={() => onNavigate("dashboard")}>
                        <ListItemIcon><Dashboard /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    
                    {/* Navigate to Users Page */}
                    <ListItem button onClick={() => onNavigate("users")}>
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>

                    <ListItem button onClick={() => onNavigate("settings")}>
                        <ListItemIcon><Settings /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                    
                    <Divider />
                    
                    <ListItem button onClick={() => alert("Logging out...")}>
                        <ListItemIcon><Logout /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default AdminSidebar;
