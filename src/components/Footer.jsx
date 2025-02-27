import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box sx={{ textAlign: "center", py: 2, bgcolor: "grey", mt: 4 }}>
            <Typography variant="body2" color="Whitesmoke">
                © {new Date().getFullYear()} KEMRI-CGHR:IFP . All rights reserved
            </Typography>
        </Box>
    );
};

export default Footer;
