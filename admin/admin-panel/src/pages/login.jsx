import { useState } from "react";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/admin/login", {
                username,
                password,
            });
            localStorage.setItem("adminToken", response.data.token);
            window.location.href = "/dashboard";
        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
