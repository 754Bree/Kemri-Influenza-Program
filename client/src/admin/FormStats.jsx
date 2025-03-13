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
                console.log("Fetched Data:", data);
                
                if (!data || (!Array.isArray(data.sociodemographics) && !Array.isArray(data.healthdemographics))) {
                    console.error("Invalid API Response Structure:", data);
                    setLoading(false);
                    return;
                }

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

        const sociodemographicsCols = Array.isArray(data.sociodemographics) && data.sociodemographics.length > 0
            ? Object.keys(data.sociodemographics[0])
            : [];
        const healthdemographicsCols = Array.isArray(data.healthdemographics) && data.healthdemographics.length > 0
            ? Object.keys(data.healthdemographics[0])
            : [];

        const uniqueColumns = [...new Set([...sociodemographicsCols, ...healthdemographicsCols])];

        console.log("Extracted Columns:", uniqueColumns);

        setAvailableColumns(uniqueColumns);
    };

    const generateChartData = () => {
        if (!data || !selectedColumn) {
            console.warn("Missing data or selectedColumn in generateChartData");
            return;
        }

        let formattedData = [];

        console.log("Processing column:", selectedColumn);

        const allData = [...(data.sociodemographics || []), ...(data.healthdemographics || [])];
        
        if (allData.length === 0) {
            console.warn("No data available for processing.");
            setChartData([]);
            return;
        }

        // Extract unique values from the selected column
        const uniqueColumnValues = [...new Set(allData.map(item => item[selectedColumn]).filter(Boolean))];
        console.log("Unique Values in Column:", uniqueColumnValues);

        ageGroups.forEach((age) => {
            let ageData = { age };

            uniqueColumnValues.forEach((value) => {
                const count = allData.filter(
                    (item) => Number(item.Age) === age && item[selectedColumn] === value
                ).length;
                ageData[value] = count;
            });

            formattedData.push(ageData);
        });

        console.log("Generated Chart Data:", formattedData);

        if (formattedData.length === 0) {
            console.warn("No data generated for the chart.");
        }

        setChartData(formattedData);
    };

    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
    if (!data) return <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 5 }}>Error loading data.</Typography>;

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
                        onChange={(e) => {
                            console.log("Selected Column:", e.target.value);
                            setSelectedColumn(e.target.value);
                        }}
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
                        {chartData.length > 0 ? (
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
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No data available for this selection.
                            </Typography>
                        )}
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
