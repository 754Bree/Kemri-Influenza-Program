import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Auto-fill email if redirected from signup
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:5000/login",
                { email, password },
                {
                    withCredentials: true,  // Enable credentials for CORS
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log("Login response:", res);  // Debugging step
            
            if (res.status === 200 && res.data.userID) {
                alert(res.data.message);

                // Store user session
                //localStorage.setItem("userID", res.data.userID);
                localStorage.setItem("eSN", res.data.eSN);
                localStorage.setItem("firstname", res.data.firstname);
                //localStorage.setItem("lastname", res.data.lastname);
                //localStorage.setItem("email", res.data.email);

                setIsLoggedIn(true);
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                setErrorMessage("Invalid email or password.");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Server unreachable. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ width: "30%", margin: "auto" }}>
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
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/reset-password")}
                    >
                        Forgot Password?
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/signup")}
                    >
                        Don't have an account? Sign up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
