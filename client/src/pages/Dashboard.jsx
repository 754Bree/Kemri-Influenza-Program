import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get userId from localStorage

        if (!userId) {
          console.warn("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/user?user_id=${userId}`
        );
        const data = await response.json();

        if (response.ok && data.userName) {
          setUsername(data.userName);
        } else {
          console.error(
            "Error fetching user:",
            data.error || "Invalid response"
          );
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsername();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome to the dashboard, {username}!
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/questionnaire")}
            >
              Next
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
