import React, { useState, useEffect } from "react";
import { Typography, Box, ToggleButton, ToggleButtonGroup, Select, MenuItem } from "@mui/material";
import Sidebar from "../components/sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FormStats = () => {
    const [category, setCategory] = useState("Sociodemographics");
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [chartData, setChartData] = useState([]);
    const [formCount, setFormCount] = useState(0);  // Store total forms

    useEffect(() => {
        fetchColumns(category);
        fetchFormCount(); // Fetch total form count
    }, [category]);

    useEffect(() => {
        if (selectedColumn) {
            fetchData(selectedColumn);
        }
    }, [selectedColumn]);

    const fetchColumns = async (selectedCategory) => {
        try {
            const response = await fetch(`/api/questions?category=${selectedCategory}`);
            const data = await response.json();
            setColumns(data);
            setSelectedColumn(data.length > 0 ? data[0] : "");
        } catch (error) {
            console.error("Error fetching column titles:", error);
        }
    };

    const fetchData = async (column) => {
        try {
            const response = await fetch(`/api/stats?question=${encodeURIComponent(column)}`);
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const fetchFormCount = async () => {
        try {
            const response = await fetch("/api/form-count"); // Get count from backend
            const data = await response.json();
            setFormCount(data.count);
        } catch (error) {
            console.error("Error fetching form count:", error);
        }
    };

    return (
        <Box display="flex">
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 4 }}>
                <Typography variant="h4" sx={{ color: "#9E4B02" }}>Form Statistics</Typography>

                {/* Show total number of forms */}
                <Typography variant="h6" sx={{ mt: 2, mb: 2, color: "#4caf50" }}>
                    Total Forms Submitted: {formCount}
                </Typography>

                <Box p={4}>
                    <ToggleButtonGroup
                        color="success"
                        value={category}
                        exclusive
                        onChange={(e, newCategory) => newCategory && setCategory(newCategory)}
                    >
                        <ToggleButton value="Sociodemographics">Sociodemographics</ToggleButton>
                        <ToggleButton value="Reproductive Health">Reproductive Health</ToggleButton>
                    </ToggleButtonGroup>

                    <Typography variant="h6" sx={{ mt: 2 }}>Select a column to view data</Typography>

                    <Select
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{ mt: 2, mb: 2 }}
                    >
                        <MenuItem value="" disabled>Select a column</MenuItem>
                        {columns.map((col, index) => (
                            <MenuItem key={index} value={col}>{col}</MenuItem>
                        ))}
                    </Select>

                    {selectedColumn && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>{selectedColumn}</Typography>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="option" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FormStats;
