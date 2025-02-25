import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Correct import

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // ✅ Define useNavigate

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:5000/signup", { email, password });
            alert("Signup successful! Redirecting to login...");
            navigate("/login", { state: { email } }); // ✅ Navigate after signup
        } catch (error) {
            alert("Signup failed! Try again.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Signup
                </Typography>
                <form onSubmit={handleSignup}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
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
                        Signup
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/login")} // ✅ Navigate to login
                    >
                        Already have an account? Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;
