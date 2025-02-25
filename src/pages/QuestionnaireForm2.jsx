import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


const QuestionnaireForm2 = () => {
    const { control } = useForm();
    const navigate = useNavigate();



    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2, boxShadow: "0 2px 3px Blue" }}>
            <Typography variant="h6">1. How old are you?</Typography>
            <Controller
                name="age"
                control={control}
                defaultValue=""
                rules={{
                    required: "Age is required",
                    min: { value: 15, message: "Age must be at least 15" },
                    max: { value: 19, message: "Age must be at most 19" },
                }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="Enter your age"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        error={!!error}
                        helperText={error ? error.message : ""}
                    />
                )}
            />

            {/* Question 2: Who do you stay with? */}
            <Typography variant="h6" mt={3}>2. Whom do you stay with?</Typography>
            <Controller
                name="stayWith"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <RadioGroup {...field}>
                        <FormControlLabel value="Father and mother" control={<Radio />} label="Father and mother" />
                        <FormControlLabel value="Mother only" control={<Radio />} label="Mother only" />
                        <FormControlLabel value="Father only" control={<Radio />} label="Father only" />
                        <FormControlLabel value="Relative" control={<Radio />} label="Relative" />
                    </RadioGroup>
                )}
            />

            {/* Question 3: Guardian Occupation */}
            <Typography variant="h6" mt={3}>3. What is your religion?</Typography>
            <Controller
                name="religion"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <RadioGroup {...field}>
                        <FormControlLabel value="Catholic" control={<Radio />} label="Catholic" />
                        <FormControlLabel value="Protestant" control={<Radio />} label="Protestant" />
                        <FormControlLabel value="Muslim" control={<Radio />} label="Muslim" />
                        <FormControlLabel value="SDA" control={<Radio />} label="SDA" />
                        <FormControlLabel value="None" control={<Radio />} label="None" />

                    </RadioGroup>
                )}
            />

            {/* Question 1: Age Input */}
            <Typography variant="h6" mt={3}>4. How many are you in the family?</Typography>
            <Controller
                name="familyMembers"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField {...field} label="Limit is from 2 to 10" variant="outlined" fullWidth margin="normal" />
                )}
            />
            <Button
                type="button" // Change from "submit" to "button" to prevent form submission
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate("/questionnaire-3")} // Navigate without form submission
            >
                Next
            </Button>
        </Box>
    );
};

export default QuestionnaireForm2;
