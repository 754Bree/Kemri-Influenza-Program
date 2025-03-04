import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Button,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema Validation
const schema = z.object({
  guardianOccupation: z.string().nonempty("Please select an occupation."),
  guardianEducation: z.string().nonempty("Please select an academic level."),
});

const QuestionnaireForm3 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    resolver: zodResolver(schema),
  });

  const submit = (data) => {
    console.log("Form Data:", data);
    updateFormData(data);
    navigate("/questionnaire-4");
  };

  return (
    <Container>
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 6,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" color="purple" gutterBottom>
          Guardian Demographic Data
        </Typography>
        <hr />

        {/* Guardian's Occupation */}
        <Typography variant="h6" mt={3}>
          1. What is your guardian's occupation?
        </Typography>
        <Controller
          name="guardianOccupation"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup {...field}>
                {[
                  "Farm Worker",
                  "Employed by someone",
                  "Self Employed",
                  "Professional",
                ].map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
              {errors.guardianOccupation && (
                <FormHelperText sx={{ color: "red" }}>
                  {errors.guardianOccupation.message}
                </FormHelperText>
              )}
            </>
          )}
        />

        {/* Guardian's Academic Level */}
        <Typography variant="h6" mt={3}>
          2. What is the academic level of your guardian?
        </Typography>
        <Controller
          name="guardianEducation"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup {...field}>
                {["None", "Primary", "Secondary", "Tertiary"].map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
              {errors.guardianEducation && (
                <FormHelperText sx={{ color: "red" }}>
                  {errors.guardianEducation.message}
                </FormHelperText>
              )}
            </>
          )}
        />

        <hr />

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/questionnaire2")}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit(submit)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm3;
