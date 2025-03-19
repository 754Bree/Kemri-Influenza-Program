import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Typography,
  Box,
} from "@mui/material";

const QuestionnaireForm5 = () => {
  const navigate = useNavigate();
  const [reproductiveHealthAccess, setReproductiveHealthAccess] = useState("");
  const [educators, setEducators] = useState([]);
  const [topics, setTopics] = useState([]);
  const [infoAdequacy, setInfoAdequacy] = useState("");

  // Handles Yes/No for reproductive health access
  const handleAccessChange = (event) => {
    const value = event.target.value;
    setReproductiveHealthAccess(value);

    // Reset selections if "No" is chosen
    if (value === "No") {
      setEducators([]);
      setTopics([]);
      setInfoAdequacy("");
    }
  };

  // Handles multi-select checkboxes
  const handleCheckboxChange = (event, setter, values) => {
    const { value, checked } = event.target;
    setter(
      checked ? [...values, value] : values.filter((item) => item !== value)
    );
  };

  // Save form data to local storage and navigate
  const handleSubmit = () => {
    if (!reproductiveHealthAccess) {
      alert("Please select whether you have access to reproductive health information.");
      return;
    }

    const formData = {
      reproductiveHealthAccess,
      educators,
      topics,
      infoAdequacy,
    };

    // Save the data to local storage as JSON
    localStorage.setItem("Reproductive Health Data", JSON.stringify(formData));
    
    console.log("Reproductive Health Data:", formData);
    navigate("/submission");
  };

  return (
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
      {/* Heading */}
      <Typography variant="h4" color="purple" gutterBottom>
        Reproductive Health Information
        <hr />
      </Typography>

      {/* Question 1: Yes/No */}
      <FormControl component="fieldset">
        <FormLabel>
          1. Do you have access to reproductive health information?
        </FormLabel>
        <RadioGroup
          value={reproductiveHealthAccess}
          onChange={handleAccessChange}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {/* Remaining Questions (Only enabled if Yes is selected) */}
      <FormControl
        component="fieldset"
        disabled={reproductiveHealthAccess !== "Yes"}
      >
        <FormLabel>
          2. Who mostly educates you on reproductive health issues? (Select
          multiple)
        </FormLabel>
        <FormGroup>
          {[
            "Teachers",
            "Parents",
            "Health worker",
            "Friends",
            "Radio/Magazines/TV",
          ].map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={educators.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(e, setEducators, educators)
                  }
                  value={option}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      </FormControl>

      <FormControl
        component="fieldset"
        disabled={reproductiveHealthAccess !== "Yes"}
      >
        <FormLabel>
          3. Which topics do they normally cover? (Select multiple)
        </FormLabel>
        <FormGroup>
          {[
            "Sexuality",
            "Abstinence",
            "Condoms",
            "STI/HIV",
            "Relationships",
          ].map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={topics.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, setTopics, topics)}
                  value={option}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      </FormControl>
      <br />
      <FormControl
        component="fieldset"
        disabled={reproductiveHealthAccess !== "Yes"}
      >
        <FormLabel>4. Is the information adequate?</FormLabel>
        <RadioGroup
          value={infoAdequacy}
          onChange={(e) => setInfoAdequacy(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/questionnaire-4")}
        >
          Back
        </Button>
        <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleSubmit}
          >
            Next
          </Button>
      </Box>
    </Box>
  );
};

export default QuestionnaireForm5;
