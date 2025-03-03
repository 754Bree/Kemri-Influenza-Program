import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Typography, Button, Container, RadioGroup, FormControlLabel, Radio, Box, FormHelperText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup schema validation
const schema = yup.object().shape({
    financialSupport: yup.string().required("Please select an option"),
});

const QuestionnaireForm4 = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext(); // Use context first

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: formData, // Now formData is properly used
        resolver: yupResolver(schema), // Validation applied
    });

    // Watching values for conditional rendering
    const hasOlderSiblings = watch("olderSiblings", "no");
    const receivesPocketMoney = watch("pocketMoney", "no");
    const guardianVisits = watch("guardianVisits", "no");

    return (
        <Container>
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2, boxShadow: "0 2px 3px blue" }}>
                <Typography variant="h5" mt={3}>
                    General Demographic Data
                </Typography>
                <hr />

                <Typography variant="h6" mt={3}>1. Do you have older brothers and sisters?</Typography>
                <Controller
                    name="olderSiblings"
                    control={control}
                    defaultValue="no"
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    )}
                />

                {hasOlderSiblings === "yes" && (
                    <>
                        <Typography variant="h6" mt={3}>1b. If yes, do they have girlfriends/boyfriends?</Typography>
                        <Controller
                            name="siblingsRelationships"
                            control={control}
                            defaultValue="no"
                            render={({ field }) => (
                                <RadioGroup {...field}>
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            )}
                        />
                    </>
                )}

                <Typography variant="h6" mt={3}>2. Do your parents give you pocket money?</Typography>
                <Controller
                    name="pocketMoney"
                    control={control}
                    defaultValue="no"
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    )}
                />

                {receivesPocketMoney === "yes" && (
                    <>
                        <Typography variant="h6" mt={3}>2b. If yes, is it adequate?</Typography>
                        <Controller
                            name="pocketMoneyAdequacy"
                            control={control}
                            defaultValue="no"
                            render={({ field }) => (
                                <RadioGroup {...field}>
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            )}
                        />
                    </>
                )}

                <Typography variant="h6" mt={3}>3. Who else meets your financial needs?</Typography>
                <Controller
                    name="financialSupport"
                    control={control}
                    defaultValue={formData.financialSupport || ""}
                    render={({ field }) => (
                        <>
                            <RadioGroup
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    updateFormData({ ...formData, financialSupport: e.target.value });
                                }}
                            >
                                <FormControlLabel value="Relatives" control={<Radio />} label="Relatives" />
                                <FormControlLabel value="Boyfriend" control={<Radio />} label="Boyfriend" />
                                <FormControlLabel value="Grandparents" control={<Radio />} label="Grandparents" />
                                <FormControlLabel value="Other friends" control={<Radio />} label="Other friends" />
                            </RadioGroup>
                            {errors.financialSupport && <FormHelperText error>{errors.financialSupport.message}</FormHelperText>}
                        </>
                    )}
                />

                <Typography variant="h6" mt={3}>4. Does your guardian always visit you during visiting days? (For boarding students)</Typography>
                <Controller
                    name="guardianVisits"
                    control={control}
                    defaultValue="no"
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    )}
                />

                {guardianVisits === "no" && (
                    <>
                        <Typography variant="h6" mt={3}>4b. If no, who else visits you in school?</Typography>
                        <Controller
                            name="otherVisitors"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <RadioGroup {...field}>
                                    <FormControlLabel value="Boyfriend" control={<Radio />} label="Boyfriend" />
                                    <FormControlLabel value="Relatives" control={<Radio />} label="Relatives" />
                                    <FormControlLabel value="Brothers/Sisters" control={<Radio />} label="Brothers/Sisters" />
                                    <FormControlLabel value="Man friend (casual boyfriend)" control={<Radio />} label="Man friend (casual boyfriend)" />
                                    <FormControlLabel value="None" control={<Radio />} label="None" />
                                </RadioGroup>
                            )}
                        />
                    </>
                )}

                {/* Navigation Buttons */}
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => {
                        updateFormData({ ...formData, financialSupport: watch("financialSupport") });
                        navigate("/questionnaire-5");
                    }}
                >
                    Next
                </Button>

                <Button
                    type="button"
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/questionnaire-3")}
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default QuestionnaireForm4;
