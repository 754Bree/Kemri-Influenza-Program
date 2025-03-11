import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Card,
    Typography,
    Box,
    InputAdornment,
    IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);  // Toggle state

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");  // Clear previous errors

        try {
            const response = await fetch("http://127.0.0.1:5000/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("adminToken", data.token);
                window.location.href = "/admin/dashboard";  // Redirect after login
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Server error. Try again later.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Card sx={{ padding: 4, marginTop: 8, textAlign: "center" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Influenza Admin
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}  // Toggle password visibility
                        label="Password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        margin="normal"
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
                    {error && <Typography color="error">{error}</Typography>}
                    <Box mt={2}>
                        <Button type="submit" variant="contained" color="success" size="large">
                            Login
                        </Button>
                    </Box>
                </form>
            </Card>
        </Container>
    );
};

export default AdminLogin;
