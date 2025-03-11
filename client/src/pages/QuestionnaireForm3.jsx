import React, { useState, useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define validation schema with Zod
const schema = z.object({
  guardianOccupation: z.string().min(1, "This field is required"),
  guardianEducation: z.string().min(1, "This field is required"),
});

const QuestionnaireForm3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    guardianOccupation: "",
    guardianEducation: "",
  });
  
  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("Guardian Demographic Data"));
    if (savedData) {
      setFormData(savedData);
      setValue("guardianOccupation", savedData.guardianOccupation);
      setValue("guardianEducation", savedData.guardianEducation);
    }
  }, [setValue]);

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Guardian Demographic Data:", data);

    // Update local state and save to localStorage
    setFormData(data);
    localStorage.setItem("Guardian Demographic Data", JSON.stringify(data));

    navigate("/questionnaire-4");
  };

  return (
    <Container>
      <Box
        sx={{
          maxWidth: "md",
          width: "auto", 
          margin: "auto",
          mx: "auto",
          mt: 6,
          p: 6,
          borderRadius: 2,
          boxShadow: 5,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" color="purple" gutterBottom>
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
              <RadioGroup
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  setFormData((prev) => ({ ...prev, guardianOccupation: value }));
                }}
              >
                {["Farm Worker", "Employed by someone", "Self Employed", "Professional"].map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
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
              <RadioGroup
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  setFormData((prev) => ({ ...prev, guardianEducation: value }));
                }}
              >
                {["None", "Primary", "Secondary", "Tertiary"].map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
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
          <Button variant="contained" color="secondary" size="large" onClick={() => navigate("/questionnaire2")}>
            Back
          </Button>
          <Button variant="contained" color="primary" size="large" onClick={handleSubmit(onSubmit)}>
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm3;
