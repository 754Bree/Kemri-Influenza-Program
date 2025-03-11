import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            sx={{
                textAlign: "center",
                py: 2,
                p: "6",
                bgcolor: "green",
                mt: 1, // Adds whitespace above the footer
                px: 2, // Ensures spacing on smaller screens
            }}
        >
            <Typography variant="body2" color="white">
                © {new Date().getFullYear()} KEMRI-CGHR:IFP. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
