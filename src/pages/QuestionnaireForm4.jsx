import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Typography, Button, Container, RadioGroup, FormControlLabel, Radio, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm4 = () => {
    const { control, watch } = useForm();
    const navigate = useNavigate();

    // Watching the value of "olderSiblings" and "pocketMoney" for conditional questions
    const hasOlderSiblings = watch("olderSiblings", "no");
    const receivesPocketMoney = watch("pocketMoney", "no");
    //const  guardianVisits = watch("")

    return (
        <Container>
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2, boxShadow: "0 2px 3px blue" }}>
                <Typography variant="h5" mt={3} >
                    General Demographic Data
                </Typography>
                <hr></hr>
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
                    defaultValue=""
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="Relatives" control={<Radio />} label="Relatives" />
                            <FormControlLabel value="Boyfriend" control={<Radio />} label="Boyfriend" />
                            <FormControlLabel value="Grandparents" control={<Radio />} label="Grandparents" />
                            <FormControlLabel value="Other friends" control={<Radio />} label="Other friends" />
                        </RadioGroup>
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

                {/* Conditionally render the next question if the answer is "No" */}
                {watch("guardianVisits") === "no" && (
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


                {/* Navigation Button */}
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/questionnaire-5")}
                >
                    Next
                </Button>
                
                <Button
                    type="submit"
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
