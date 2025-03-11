import React, { useEffect, useState } from "react";
import { Box,  Typography,} from "@mui/material";
import Sidebar from "../components/sidebar";
import axios from "axios";


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      setStats(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 8 }}>
        <Typography variant="h4"  color="rgba(158, 75, 2, 0.9)">
          Admin Dashboard
          <hr />
        </Typography>
      
      </Box>
    </Box>
  );
};

export default Dashboard;
