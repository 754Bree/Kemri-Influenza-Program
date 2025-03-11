import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DarkMode, LightMode } from "@mui/icons-material";
import { ThemeContext } from "../App"; // Now ThemeContext is properly imported
import logo from "../Assets/KEMRI-Logo.jpg";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const { darkMode, setDarkMode } = useContext(ThemeContext); // Access dark mode state

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* App Name / Title */}
                <img src={logo} alt="KEMRI Logo" style={{ height: 40, marginRight: 10 }} />
                <Typography variant="h6" sx={{ cursor: "pointer" }} >
                Questionnaire for girs aged 15 to 19
                </Typography>

                <div>
                    {/* Dark Mode Toggle */}
                    <IconButton onClick={() => setDarkMode(!darkMode)} color="warning">
                        {darkMode ? <LightMode /> : <DarkMode />}
                    </IconButton>

                    {/* Show logout button if logged in */}
                    {isLoggedIn && (
                        <Button color="#b8b8ff" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
