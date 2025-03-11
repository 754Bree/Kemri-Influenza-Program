import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar,Toolbar, Typography, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";

const drawerWidth = 230;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "User Management", icon: <AssignmentIcon />, path: "/registration" },
  { text: "Employee Credentials", icon: <ListAltIcon />, path: "/logs" },
  { text: "Form Statistics", icon: <AssignmentIcon />, path: "/forms" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },

];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "rgb(158, 75, 2)",
          color: "#F5F5F5",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ textAlign: "center", my: 0 }}>
        <Avatar sx={{ width: 100, height: 100, mx: "auto", color: "green", bgcolor: "whitesmoke", boxShadow:"0px 4px 10px rgba(158, 75, 2, 0.9)" }} />
        <Typography variant="body1" sx={{ mt: 1, color: "white" }}>
          Admin
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)} sx={{ "&:hover": { backgroundColor: "rgba(158, 75, 2, 0.9)",  } }}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/logout")} sx={{ "&:hover": { backgroundColor: "warning" } }}>
            <ListItemIcon sx={{ color: "white" }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
