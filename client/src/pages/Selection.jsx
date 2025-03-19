import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";

const Selection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    // Load all saved questionnaire data from localStorage
    const savedData = {
      form2: JSON.parse(localStorage.getItem("Individual Demographic Data")) || {},
      form3: JSON.parse(localStorage.getItem("Guardian Demographic Data")) || {},
      form4: JSON.parse(localStorage.getItem("General Demographic Data")) || {},
      form5: JSON.parse(localStorage.getItem("Reproductive Health Data")) || {},
    };
    setFormData(savedData);
  }, []);

  const handleSubmitAll = async () => {
    if (!formData) {
      alert("No data to submit.");
      return;
    }

    // ✅ Required fields
    const requiredFields = [
      "age", "stayWith", "religion", "familySize",
      "guardianOccupation", "guardianEducation",
      "financialSupport", "olderSiblings", "pocketMoney",
      "guardianVisits", "reproductiveHealthAccess"
    ];

    // ✅ Flatten formData into a single object (assuming form2, form3, etc. contain the needed data)
    const combinedData = { ...formData.form2, ...formData.form3, ...formData.form4, ...formData.form5 };

    // ✅ Find missing fields
    const missingFields = requiredFields.filter((field) => !combinedData[field]);

    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    console.log("Submitting data...", combinedData); // Debug log

    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Submission successful!", result);
      setSubmissionStatus("success");
      alert("✅ Data submitted successfully!Redirecting...");

      // ✅ Navigate to /questionnaire2 and set focus
      setTimeout(() => {
        navigate("/questionnaire2");
        setTimeout(() => {
          const firstInput = document.querySelector("input, textarea, select");
          if (firstInput) firstInput.focus();
        }, 400); // Allow time for page to render
      }, 800);

    } catch (error) {
      console.error("Error submitting data:", error);
      setSubmissionStatus("error");
      alert(`❌ Submission failed: ${error.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, p: 4 }}>
      <Typography variant="h5" color="secondary" gutterBottom>
        Review Your Selections
        <hr />
      </Typography>

      {formData ? (
        Object.entries(formData).map(([formName, data], index) => (
          <Paper key={index} sx={{ p: 2, my: 2 }}>
            <Typography variant="h6" color="purple">{`Form ${index + 1}`}</Typography>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
          </Paper>
        ))
      ) : (
        <Typography>No selections recorded.</Typography>
      )}

      {submissionStatus === "success" && (
        <Typography color="green">✅ Data submitted successfully!</Typography>
      )}
      {submissionStatus === "error" && (
        <Typography color="red">❌ Error submitting data.</Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate("/dashboard")}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmitAll}>
          Submit & Continue
        </Button>
      </Box>
    </Box>
  );
};

export default Selection;
