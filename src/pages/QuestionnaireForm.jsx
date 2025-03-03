import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm = () => {
    const navigate = useNavigate();
    const [questionnaireSN, setQuestionnaireSN] = useState("");
    const [dateCollected, setDateCollected] = useState("");

    useEffect(() => {
        setQuestionnaireSN(`IFP${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`);
        setDateCollected(new Date().toISOString().split("T")[0]);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/questionnaire2", { state: { questionnaireSN, dateCollected } });
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Questionnaire Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Questionnaire Serial Number"
                                variant="outlined"
                                value={questionnaireSN}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Date of Data Collection"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={dateCollected}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default QuestionnaireForm;
