import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [questionnaireSN, setQuestionnaireSN] = useState("");
    const [dateCollected, setDateCollected] = useState("");

    // Function to generate Serial Number (IFP + Year + Counter)
    const generateSerialNumber = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
        return `IFP${year}${randomNum}`;
    };

    // Autofill Serial Number & Date when component loads
    useEffect(() => {
        setQuestionnaireSN(generateSerialNumber());
        setDateCollected(new Date().toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted:", { questionnaireSN, dateCollected });

        // Navigate to the next form
        navigate("/questionnaire2", { state: { questionnaireSN, dateCollected } });
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Questionnaire Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Questionnaire Serial Number"
                        variant="outlined"
                        value={questionnaireSN}
                        disabled // Prevent manual changes
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Date of Data Collection"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dateCollected}
                        disabled // Prevent manual changes
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Next
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default QuestionnaireForm;
