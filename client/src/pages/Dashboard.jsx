import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, Skeleton } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const [eSN, setESN] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Employee Serial Number (eSN) from localStorage
    const storedESN = localStorage.getItem("eSN");

    if (storedESN) {
      setESN(storedESN);
    } else {
      console.warn("eSN not found in localStorage");
    }

    setLoading(false);
  }, []);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
        {loading ? (
          <>
            <Skeleton variant="text" width={250} height={40} />
            <Skeleton variant="text" width={180} height={30} />
            <Skeleton
              variant="rectangular"
              width={150}
              height={40}
              sx={{ mt: 3, mx: "auto" }}
            />
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome to the dashboard
              <br />
              <span>{eSN}!</span>
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/questionnaire2")}
            >
              Begin
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
