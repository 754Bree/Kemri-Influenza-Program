import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/admin';

export const loginAdmin = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
        });
        localStorage.setItem("adminToken", response.data.token);
        return response.data;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};
