import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const [questionnaireSN, setQuestionnaireSN] = useState("");
  const [dateCollected, setDateCollected] = useState("");
  const [QsnID, setQsnID] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if questionnaire already exists in session storage
    const storedSN = sessionStorage.getItem("questionnaireSN");
    const storedDate = sessionStorage.getItem("dateCollected");
    const storedQsnID = sessionStorage.getItem("QsnID");

    if (storedSN && storedDate && storedQsnID) {
      console.log("Using existing questionnaire session.");
      setQuestionnaireSN(storedSN);
      setDateCollected(storedDate);
      setQsnID(storedQsnID);
      setLoading(false);
    } else {
      console.log(
        "No existing questionnaire found. Will generate when submitted."
      );
      setLoading(false);
    }
  }, []);

  const generateSerialNumber = () => {
    return `IFP${new Date().getFullYear()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  };

  const handleNext = () => {
    console.log("Navigating to next page with data:", {
      questionnaireSN,
      dateCollected,
      QsnID,
    });

    navigate("/questionnaire2", {
      state: { questionnaireSN, dateCollected, QsnID },
    });
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
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

          {loading ? (
            <>
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={50}
                sx={{ mt: 2 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={50}
                sx={{ mt: 2 }}
              />
              <Skeleton
                variant="rectangular"
                width="50%"
                height={40}
                sx={{ mt: 3, mx: "auto" }}
              />
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Questionnaire Serial Number"
                  variant="outlined"
                  value={questionnaireSN || "Generated at submission"}
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
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm;
