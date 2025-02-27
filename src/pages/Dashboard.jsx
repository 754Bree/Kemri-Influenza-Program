import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/questionnaire")}
                >
                    Next
                </Button>
                
            </Box>
        </Container>
    );
};

export default Dashboard;
