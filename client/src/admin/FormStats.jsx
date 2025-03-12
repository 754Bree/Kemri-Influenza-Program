import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AdminSidebar from "./AdminSidebar";

const FormStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        fetch("http://127.0.0.1:5000/formstats")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching form statistics:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />
            <Container sx={{ flexGrow: 1, p: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Form Statistics
                </Typography>

                {/* Bar Chart Example */}
                <Typography variant="h6" gutterBottom>
                    Age Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.age_distribution}>
                        <XAxis dataKey="age_range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Pie Chart Example */}
                <Typography variant="h6" gutterBottom>
                    Health Information Access
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data.health_info_access}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.health_info_access.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Container>
        </div>
    );
};

export default FormStats;
