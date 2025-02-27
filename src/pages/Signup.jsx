import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, IconButton, InputAdornment } from "@mui/material";
import axios from "axios"; // Import axios for API requests
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/api/register", {
                firstname,
                lastname,
                username,
                email,
                password
            });

            if (response.data.success) {
                alert("Signup successful! Redirecting to login...");
                navigate("/login");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again.");
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="xs">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Signup
                </Typography>
                <form onSubmit={handleSignup}>
                    <TextField
                        fullWidth margin="normal" label="First Name" variant="outlined"
                        type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Last Name" variant="outlined"
                        type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Username" variant="outlined"
                        type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Email" variant="outlined"
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Password" variant="outlined"
                        type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        fullWidth margin="normal" label="Confirm Password" variant="outlined"
                        type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit" fullWidth variant="contained" color="primary"
                        sx={{ mt: 2 }} disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Signup"}
                    </Button>
                    <Button
                        fullWidth variant="outlined" color="success"
                        sx={{ mt: 2 }} onClick={() => navigate("/login")}
                    >
                        Already have an account? Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;
