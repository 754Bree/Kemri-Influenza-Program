import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Typography, Button, Container, RadioGroup, FormControlLabel, Radio, Box, Checkbox,FormGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm5 = () => {

    const navigate = useNavigate();
    const { control, handleSubmit, watch } = useForm();
    const onSubmit = (data) => {
        console.log("Form Data: ", data);
    };
    const hasHealthInfo = watch("healthInfoAccess") === "yes"; // Watch for health info access

    return (
        <Container>
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, border: "1px solid gray", borderRadius: 2, boxShadow: "0 2px 3px blue" }}>
                <Typography variant="h5" mt={3} >
                    Reproductive Health Demographics
                </Typography>
                <hr></hr>
                {/* Question 14: Access to Reproductive Health Info */}
                <Typography variant="h6" mt={3}>
                    14. Do you have any access to reproductive health information?
                </Typography>
                <Controller
                    name="healthInfoAccess"
                    control={control}
                    defaultValue="no"
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    )}
                />

                {/* Question 15: Who mostly educates you? (Conditional) */}
                {hasHealthInfo && (
                    <>
                        <Typography variant="h6" mt={3}>
                            15. If yes, who mostly educates you on reproductive health issues? (Tick as many)
                        </Typography>
                        <Controller
                            name="healthEducators"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <FormGroup {...field}>
                                    <FormControlLabel control={<Checkbox />} label="Teachers" value="Teachers" />
                                    <FormControlLabel control={<Checkbox />} label="Parents" value="Parents" />
                                    <FormControlLabel control={<Checkbox />} label="Health worker" value="Health worker" />
                                    <FormControlLabel control={<Checkbox />} label="Friends" value="Friends" />
                                    <FormControlLabel control={<Checkbox />} label="Radio/Magazines/TV" value="Radio/Magazines/TV" />
                                </FormGroup>
                            )}
                        />
                    </>
                )}

                {/* Question 16: Topics Covered (Conditional) */}
                {hasHealthInfo && (
                    <>
                        <Typography variant="h6" mt={3}>
                            16. Which topics do they normally cover? (Tick as many)
                        </Typography>
                        <Controller
                            name="healthTopics"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <FormGroup {...field}>
                                    <FormControlLabel control={<Checkbox />} label="Sexuality" value="Sexuality" />
                                    <FormControlLabel control={<Checkbox />} label="Abstinence" value="Abstinence" />
                                    <FormControlLabel control={<Checkbox />} label="Condoms" value="Condoms" />
                                    <FormControlLabel control={<Checkbox />} label="STI/HIV" value="STI/HIV" />
                                    <FormControlLabel control={<Checkbox />} label="Relationships" value="Relationships" />
                                </FormGroup>
                            )}
                        />
                    </>
                )}

                {/* Question 17: Information Adequacy (Conditional) */}
                {hasHealthInfo && (
                    <>
                        <Typography variant="h6" mt={3}>
                            17. Is the information adequate?
                        </Typography>
                        <Controller
                            name="infoAdequacy"
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
                <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/questionnaire-4")}
                >
                    Back
                </Button>
                {/* Next Button */}
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 4 }}>
                    Submit
                </Button>
            </Box>
        </Container>
    );
};

export default QuestionnaireForm5;
