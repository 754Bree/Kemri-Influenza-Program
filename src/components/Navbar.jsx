import React from "react";
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";


const Navbar = ({ isLoggedIn, questionnaireSN }) => {
    const currentDate = new Date().toLocaleDateString(); // Get current date

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* App Name / Logo */}
                <Typography variant="h6">KEMRI-CGHR : Influenza Program</Typography>

                {/* Show only when user is logged in */}
                {isLoggedIn && (
                    <Container
                        sx={{
                            display: "flex",
                            gap: 2,
                            backgroundColor: "white",
                            padding: 1,
                            borderRadius: 2,
                        }}
                    >
                        {/* Questionnaire Serial Number */}
                        <Box
                            sx={{
                                padding: "8px 16px",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "8px",
                                border: "1px solid gray",
                            }}
                        >
                            <Typography variant="body1">
                                QSN: {questionnaireSN}
                            </Typography>
                        </Box>

                        {/* Current Date */}
                        <Box
                            sx={{
                                padding: "8px 16px",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "8px",
                                border: "1px solid gray",
                            }}
                        >
                            <Typography variant="body1">
                                Date: {currentDate}
                            </Typography>
                            <Button color="inherit" component={ Link } to="/questionnaire">
                                Questionnaire
                            </Button>
                        </Box>
                    </Container>
                    
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
