import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const [questionnaireSN, setQuestionnaireSN] = useState("");
  const [dateCollected, setDateCollected] = useState("");

  useEffect(() => {
    const generatedSN = `IFP${new Date().getFullYear()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const collectedDate = new Date().toISOString().split("T")[0];

    setQuestionnaireSN(generatedSN);
    setDateCollected(collectedDate);

    console.log("Questionnaire Serial Number:", generatedSN);
    console.log("Date of Data Collection:", collectedDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/questionnaire2", { state: { questionnaireSN, dateCollected } });
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh", // Ensures spacing between Navbar and Footer
        }}
      >
        <Box
          textAlign="center"
          p={4}
          boxShadow={3}
          borderRadius={3}
          bgcolor="white"
          width="100%"
          maxWidth={500}
        >
          <Typography variant="h3" gutterBottom color="purple">
            Questionnaire Form
            <hr />
        
          </Typography>
          
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Questionnaire Serial Number"
                  variant="outlined"
                  value={questionnaireSN}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Data Collection"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dateCollected}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm;
