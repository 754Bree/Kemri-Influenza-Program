import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const res = await axios.post("http://127.0.0.1:5000/reset-password", { email });
            setMessage(res.data.message); // Show success or error message
        } catch (error) {
            setMessage("Failed to send reset email. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleResetPassword}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Enter your email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Send Reset Link
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/login")} // Navigate to Login
                    >
                        Back to Login
                    </Button>
                </form>
                {message && <Typography color="error" mt={2}>{message}</Typography>}
            </Box>
        </Container>
    );
};

export default ResetPassword;
