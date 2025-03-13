import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AdminSidebar from "./AdminSidebar";

const FormStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [chartData, setChartData] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);

    // Fixed Age groups for the Y-axis
    const ageGroups = [15, 16, 17, 18, 19];

    useEffect(() => {
        fetch("http://127.0.0.1:5000/formstats")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Data:", data); // Debugging API response
                setData(data);
                extractColumns(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching form statistics:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedColumn && data) {
            generateChartData();
        }
    }, [selectedColumn, data]);

    const extractColumns = (data) => {
        if (!data) return;

        const sociodemographicsCols = data.sociodemographics?.length > 0
            ? Object.keys(data.sociodemographics[0])
            : [];
        const healthdemographicsCols = data.healthdemographics?.length > 0
            ? Object.keys(data.healthdemographics[0])
            : [];

        const uniqueColumns = [...new Set([...sociodemographicsCols, ...healthdemographicsCols])];

        console.log("Extracted Columns:", uniqueColumns); // Debugging column extraction

        setAvailableColumns(uniqueColumns);
    };

    const generateChartData = () => {
        if (!data || !selectedColumn) return;

        let columnValues = {};
        let formattedData = [];

        [...(data.sociodemographics || []), ...(data.healthdemographics || [])].forEach((item) => {
            if (item[selectedColumn]) {
                columnValues[item[selectedColumn]] = true;
            }
        });

        const uniqueColumnValues = Object.keys(columnValues);

        ageGroups.forEach((age) => {
            let ageData = { age };

            uniqueColumnValues.forEach((value) => {
                const count = [...(data.sociodemographics || []), ...(data.healthdemographics || [])].filter(
                    (item) => Number(item.Age) === age && item[selectedColumn] === value
                ).length;
                ageData[value] = count;
            });

            formattedData.push(ageData);
        });

        setChartData(formattedData);
    };

    if (loading) return <CircularProgress />;
    if (!data) return <Typography variant="h6" color="error">Error loading data.</Typography>;

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />
            <Container sx={{ flexGrow: 1, p: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Form Statistics
                </Typography>

                <FormControl sx={{ minWidth: 200, marginBottom: 3 }}>
                    <InputLabel>Select a Column</InputLabel>
                    <Select
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        disabled={availableColumns.length === 0}
                    >
                        {availableColumns.length > 0 ? (
                            availableColumns.map((col, index) => (
                                <MenuItem key={index} value={col}>
                                    {col}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No columns available</MenuItem>
                        )}
                    </Select>
                </FormControl>

                {selectedColumn ? (
                    <div>
                        <Typography variant="h6" gutterBottom>
                            {selectedColumn} Distribution by Age
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart layout="vertical" data={chartData}>
                                <XAxis type="number" />
                                <YAxis dataKey="age" type="category" />
                                <Tooltip />
                                <Legend />
                                {Object.keys(chartData[0] || {}).filter(key => key !== "age").map((value, idx) => (
                                    <Bar key={idx} dataKey={value} fill={["#8884d8", "#82ca9d", "#ffc658"][idx % 3]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        Select a column to display statistics.
                    </Typography>
                )}
            </Container>
        </div>
    );
};

export default FormStats;
