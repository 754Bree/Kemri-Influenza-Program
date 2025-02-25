import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Auto-fill email if redirected from signup
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://127.0.0.1:5000/login", { email, password });

            if (res.status === 200) {
                alert(res.data.message);

                // Store user session
                localStorage.setItem("userID", res.data.userID);
                localStorage.setItem("eSN", res.data.eSN);
                localStorage.setItem("firstname", res.data.firstname);
                localStorage.setItem("lastname", res.data.lastname);
                localStorage.setItem("email", res.data.email);

                setIsLoggedIn(true); // Update authentication state
                navigate("/dashboard"); // Redirect to dashboard
            }
        } catch (error) {
            setErrorMessage("Login failed! Check your credentials.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
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
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 2 }}>
                        Login
                    </Button>
                    <Button fullWidth variant="text" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/reset-password")}>
                        Forgot Password?
                    </Button>
                    <Button fullWidth variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/signup")}>
                        Don't have an account? Sign up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
