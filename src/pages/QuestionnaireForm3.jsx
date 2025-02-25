import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Typography, Button, Container, Box, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm3 = () => {
    const { control} = useForm();
    const navigate = useNavigate(); // Correct way to use navigation

    
    return (
        <Container>
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2, boxShadow: "0 2px 3px blue" }}>
                <Typography variant="h5" mt={3} >
                    Guardian Demographic Data
                </Typography>
                <hr></hr>
                <Typography variant="h6" mt={3}>1. What is your guardian's occupation?</Typography>
                <Controller
                    name="guardianOccupation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="Farm Worker" control={<Radio />} label="Farm Worker" />
                            <FormControlLabel value="Employed by someone" control={<Radio />} label="Employed by someone" />
                            <FormControlLabel value="Self Employed" control={<Radio />} label="Self Employed" />
                            <FormControlLabel value="Professional" control={<Radio />} label="Professional" />
                        </RadioGroup>
                    )}
                />

                <Typography variant="h6" mt={3}>2. What is the academic level of your guardian?</Typography>
                <Controller
                    name="guardianAcademicLevel"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="None" control={<Radio />} label="None" />
                            <FormControlLabel value="Primary" control={<Radio />} label="Primary" />
                            <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" />
                            <FormControlLabel value="Tertiary" control={<Radio />} label="Tertiary" />
                        </RadioGroup>
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/questionnaire-4")}
                >
                    Next
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/questionnaire2")}
                >
                    Back
                </Button>
                
            </Box>
        </Container>
    );
};

export default QuestionnaireForm3;
