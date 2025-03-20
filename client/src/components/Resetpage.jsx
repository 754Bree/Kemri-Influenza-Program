import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("Password Reset page!");
    }, []);


    const handlePasswordReset = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://127.0.0.1:5000/reset_password", { token, password });
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Enter New Password
                </Typography>
                <form onSubmit={handlePasswordReset}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="New Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Reset Password
                    </Button>
                </form>
                {message && <Typography color="error" mt={2}>{message}</Typography>}
            </Box>
        </Container>
    );
};

export default ResetPasswordForm;
