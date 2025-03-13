import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:5000/signup", formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                alert("Signup successful! Redirecting to login...");
                navigate("/login");
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response?.data?.error || "An error occurred. Please try again.");
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
                    <TextField fullWidth margin="normal" label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Username" name="username" value={formData.username} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    
                    <TextField
                        fullWidth margin="normal" label="Password" name="password"
                        type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth margin="normal" label="Confirm Password" name="confirmPassword"
                        type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Telephone" 
                        name="telephone"  // ✅ Corrected the name to match state
                        type="tel" 
                        placeholder="2547xxxxxxxx" 
                        value={formData.telephone} 
                        onChange={handleChange} 
                        required 
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                        {loading ? "Signing Up..." : "Signup"}
                    </Button>
                    <Button fullWidth variant="outlined" color="success" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
                        Already have an account? Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;
