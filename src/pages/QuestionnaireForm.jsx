import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const QuestionnaireForm = () => {
    const [questionnaireSN, setQuestionnaireSN] = useState("");
    const [dateCollected, setDateCollected] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/questionnaire", {
                questionnaireSN,
                dateCollected
            });

            alert(response.data.message);
            setQuestionnaireSN(""); // Reset fields after submission
            setDateCollected("");
        } catch (error) {
            alert("Failed to submit data!");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Questionnaire Data Collection
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Questionnaire Serial Number"
                        variant="outlined"
                        value={questionnaireSN}
                        onChange={(e) => setQuestionnaireSN(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Date of Data Collection"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dateCollected}
                        onChange={(e) => setDateCollected(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default QuestionnaireForm;
