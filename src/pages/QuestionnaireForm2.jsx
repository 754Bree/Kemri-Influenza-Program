import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormContext } from "../context/FormContext"; // Import context

const QuestionnaireForm2 = () => {
    const { formData, updateFormData } = useFormContext(); // Get global form data
    const { control, handleSubmit, getValues, setValue } = useForm({
        defaultValues: formData, // Load saved data
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Set default values when component loads
        Object.keys(formData).forEach((key) => {
            setValue(key, formData[key]);
        });
    }, [formData, setValue]);

    const onSubmit = (data) => {
        const age = parseInt(data.age, 10);
        const familyMembers = parseInt(data.familyMembers, 10);

        // Validate age range
        if (age < 15 || age > 19) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Age",
                text: "Age must be between 15 and 19.",
                confirmButtonText: "OK",
            });
            return;
        }

        // Validate family members range
        if (familyMembers < 2 || familyMembers > 10) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Family Size",
                text: "Family members must be between 2 and 10.",
                confirmButtonText: "OK",
            });
            return;
        }

        // Save form data before navigating
        updateFormData(data);

        // Navigate to the next page
        navigate("/questionnaire-3");
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2, boxShadow: "0 2px 3px orange" }}>
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

            <Typography variant="h6" mt={3}>4. How many are you in the family?</Typography>
            <Controller
                name="familyMembers"
                control={control}
                defaultValue=""
                rules={{
                    required: "This field is required",
                    min: { value: 2, message: "Family size must be at least 2" },
                    max: { value: 10, message: "Family size must be at most 10" },
                }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="Limit is from 2 to 10"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        error={!!error}
                        helperText={error ? error.message : ""}
                    />
                )}
            />

            <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleSubmit(onSubmit)}
            >
                Next
            </Button>
        </Box>
    );
};

export default QuestionnaireForm2;
