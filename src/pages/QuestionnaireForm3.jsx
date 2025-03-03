import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Typography, Button, Container, Box, RadioGroup, FormControlLabel, Radio, FormHelperText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext"; // Import FormContext

const QuestionnaireForm3 = () => {
    const { formData, updateFormData } = useFormContext(); // Get stored form data
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: formData, // Populate previously selected values
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Populate previous values on component mount
        Object.keys(formData).forEach((key) => {
            setValue(key, formData[key]);
        });
    }, [formData, setValue]);

    const onSubmit = (data, path) => {
        updateFormData(data); // Save current form data
        navigate(path); // Navigate to the specified page
    };

    // Watch selected values to check if both required fields are filled
    const guardianOccupation = watch("guardianOccupation");
    const guardianAcademicLevel = watch("guardianAcademicLevel");
    const isFormValid = guardianOccupation && guardianAcademicLevel; // Ensure both are selected

    return (
        <Container>
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2 }}>
                <Typography variant="h5" mt={3}>
                    Guardian Demographic Data
                </Typography>
                <hr />

                <Typography variant="h6" mt={3}>1. What is your guardian's occupation?</Typography>
                <Controller
                    name="guardianOccupation"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Please select an option" }}
                    render={({ field }) => (
                        <>
                            <RadioGroup {...field}>
                                <FormControlLabel value="Farm Worker" control={<Radio />} label="Farm Worker" />
                                <FormControlLabel value="Employed by someone" control={<Radio />} label="Employed by someone" />
                                <FormControlLabel value="Self Employed" control={<Radio />} label="Self Employed" />
                                <FormControlLabel value="Professional" control={<Radio />} label="Professional" />
                            </RadioGroup>
                            {errors.guardianOccupation && <FormHelperText error>{errors.guardianOccupation.message}</FormHelperText>}
                        </>
                    )}
                />

                <Typography variant="h6" mt={3}>2. What is the academic level of your guardian?</Typography>
                <Controller
                    name="guardianAcademicLevel"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Please select an option" }}
                    render={({ field }) => (
                        <>
                            <RadioGroup {...field}>
                                <FormControlLabel value="None" control={<Radio />} label="None" />
                                <FormControlLabel value="Primary" control={<Radio />} label="Primary" />
                                <FormControlLabel value="Secondary" control={<Radio />} label="Secondary" />
                                <FormControlLabel value="Tertiary" control={<Radio />} label="Tertiary" />
                            </RadioGroup>
                            {errors.guardianAcademicLevel && <FormHelperText error>{errors.guardianAcademicLevel.message}</FormHelperText>}
                        </>
                    )}
                />

                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit((data) => onSubmit(data, "/questionnaire-4"))}
                    disabled={!isFormValid} // Disable if form is incomplete
                >
                    Next
                </Button>

                <Button
                    type="button"
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit((data) => onSubmit(data, "/questionnaire2"))}
                    disabled={!isFormValid} // Disable if form is incomplete
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default QuestionnaireForm3;
