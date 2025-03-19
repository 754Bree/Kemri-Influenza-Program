import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DarkMode, LightMode } from "@mui/icons-material";
import { ThemeContext } from "../App";
import logo from "../Assets/KEMRI-Logo.jpg";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    const handleLogout = async () => {
        const userID = localStorage.getItem("userID");

        if (!userID) {
            console.error("No user ID found in local storage");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID })
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            // Clear storage and update state after successful logout
            localStorage.clear();
            setIsLoggedIn(false);

            // Force a full reload to ensure user is completely logged out
            window.location.href = "/login"; 

        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <img src={logo} alt="KEMRI Logo" style={{ height: 40, marginRight: 10 }} />
                <Typography variant="h6" sx={{ cursor: "pointer" }}>
                    Questionnaire for girls aged 15 to 19
                </Typography>

                <div>
                    <IconButton onClick={() => setDarkMode(!darkMode)} color="warning">
                        {darkMode ? <LightMode /> : <DarkMode />}
                    </IconButton>

                    {isLoggedIn && (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
