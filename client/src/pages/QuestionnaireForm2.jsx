import React, { useState, useEffect } from "react";
import {  TextField,RadioGroup,FormControlLabel, Radio, Button, FormControl, FormLabel,Typography,Box,} from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionnaireForm2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    stayWith: "",
    religion: "",
    familySize: "",
  });
  const [errors, setErrors] = useState({});

  // Load saved data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Validation function
  const validate = () => {
    let tempErrors = {};
    tempErrors.age =
      formData.age < 15 || formData.age > 19
        ? "Age must be between 15 and 19"
        : "";
    tempErrors.stayWith = formData.stayWith ? "" : "This field is required";
    tempErrors.religion = formData.religion ? "" : "This field is required";
    tempErrors.familySize =
      formData.familySize < 2 || formData.familySize > 12
        ? "Family size must be between 2 and 12"
        : "";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validate()) {
      console.log("Individual Demographic Data:", formData); 
      localStorage.setItem("Individual Demographic Data", JSON.stringify(formData));
      navigate("/questionnaire-3");
    }
  };

  return (
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
        Individual Demographic Data
      </Typography>
      <hr />

      {/* Age Input */}
      <Typography mt={3}>1. How old are you?</Typography>
      <TextField
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        error={!!errors.age}
        helperText={errors.age}
        fullWidth
        margin="normal"
      />

      {/* Stay With Selection */}
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel>2. Whom do you stay with?</FormLabel>
        <RadioGroup
          name="stayWith"
          value={formData.stayWith}
          onChange={handleChange}
        >
          {["Father and Mother", "Mother only", "Father only", "Relatives"].map(
            (option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            )
          )}
        </RadioGroup>
        {errors.stayWith && (
          <Typography color="error">{errors.stayWith}</Typography>
        )}
      </FormControl>

      {/* Religion Selection */}
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel>3. What is your religion?</FormLabel>
        <RadioGroup
          name="religion"
          value={formData.religion}
          onChange={handleChange}
        >
          {["Catholic", "Protestant", "Muslim", "SDA", "None"].map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
        {errors.religion && (
          <Typography color="error">{errors.religion}</Typography>
        )}
      </FormControl>

      {/* Family Size Input */}
      <Typography mt={3}>4. How many are you in the family?</Typography>
      <TextField
        name="familySize"
        type="number"
        value={formData.familySize}
        onChange={handleChange}
        error={!!errors.familySize}
        helperText={errors.familySize}
        fullWidth
        margin="normal"
      />

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionnaireForm2;
