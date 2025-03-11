import React from "react";
import { useForm,  } from "react-hook-form";
import {
  Typography,
  Button,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Yup schema validation
const schema = z
  .object({
    financialSupport: z.string({ message: "Please select an option" }),
    pocketMoneyAdequacy: z
      .string({ message: "Please fill this field" })
      .nullable()
      .default(null),
    olderSiblings: z.string({ message: "Please fill this field" }),
    pocketMoney: z.string({ message: "Please fill this field" }),
    guardianVisits: z.string({ message: "Please fill this field" }),
    siblingsRelationships: z
      .string({ message: "Please fill this field" })
      .nullable()
      .default(null),
    otherVisitors: z
      .string({ message: "Please fill this field" })
      .nullable()
      .default(null),
  })
  .superRefine((value, ctx) => {
    if (value.pocketMoney === "Yes" && value.pocketMoneyAdequacy === null) {
      ctx.addIssue({
        path: ["pocketMoneyAdequacy"],
        message: "Please fill this field",
      });
    }
    if (value.olderSiblings === "Yes" && value.siblingsRelationships === null) {
      ctx.addIssue({
        path: ["siblingsRelationships"],
        message: "Please fill this field",
      });
    }
    if (value.guardianVisits === "No" && value.siblingsRelationships === null) {
      ctx.addIssue({
        path: ["otherVisitors"],
        message: "Please fill this field",
      });
    }
  });

const QuestionnaireForm4 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext(); // Use context first

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: formData, // Now formData is properly used

    resolver: zodResolver(schema), // Validation applied
  });

  const submit = (data) => {
    console.log("General Demographic Data:", data); // ✅ Logs current form data
    updateFormData(data);
    
    // Save updated data, NOT old formData
    localStorage.setItem("General Demographic Data", JSON.stringify(data)); 
    navigate("/questionnaire-5");
    // }}
  };

  // Watching values for conditional rendering
  const hasOlderSiblings = watch("olderSiblings", "no");
  const receivesPocketMoney = watch("pocketMoney", "no");
  const guardianVisits = watch("guardianVisits", "no");

  return (
    <Container>
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 6,
          p: 3,
          borderRadius: 2,
          boxShadow:
            "0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.06)",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" mt={3} color="purple">
          General Demographic Data
        </Typography>
        <hr />
        {/* <Form onSubmit={handleSubmit(submit)}> */}
        <Typography variant="h6" mt={3}>
          1. Do you have older brothers and sisters?
        </Typography>
        <RadioGroup>
          <FormControlLabel
            name="olderSiblings"
            {...register("olderSiblings")}
            value="yes"
            control={<Radio />}
            label="Yes"
          />
          <FormControlLabel
            name="olderSiblings"
            {...register("olderSiblings")}
            value="no"
            control={<Radio />}
            label="No"
          />
        </RadioGroup>
        {errors.olderSiblings && (
          <p style={{ color: "red" }}>{errors.olderSiblings.message}</p>
        )}
        {/* )}
                    /> */}

        {hasOlderSiblings === "yes" && (
          <>
            <Typography variant="h6" mt={3}>
              1b. If yes, do they have girlfriends/boyfriends?
            </Typography>
            {/* <Controller
                                name="siblingsRelationships"
                                control={control}
                                defaultValue="no"
                                render={({ field }) => ( */}
            <RadioGroup>
              <FormControlLabel
                {...register("siblingsRelationships")}
                name="siblingsRelationships"
                value="yes"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel
                {...register("siblingsRelationships")}
                name="siblingsRelationships"
                value="no"
                control={<Radio />}
                label="No"
              />
            </RadioGroup>
            {/* )}
                            /> */}
            {errors.siblingsRelationships && (
              <p style={{ color: "red" }}>
                {errors.siblingsRelationships.message}
              </p>
            )}
          </>
        )}

        <Typography variant="h6" mt={3}>
          2. Do your parents give you pocket money?
        </Typography>
        {/* <Controller
                        name="pocketMoney"
                        control={control}
                        defaultValue="no"
                        render={({ field }) => ( */}
        <RadioGroup>
          <FormControlLabel
            {...register("pocketMoney")}
            name="pocketMoney"
            value="yes"
            control={<Radio />}
            label="Yes"
          />
          <FormControlLabel
            {...register("pocketMoney")}
            name="pocketMoney"
            value="no"
            control={<Radio />}
            label="No"
          />
        </RadioGroup>
        {errors.pocketMoney && (
          <p style={{ color: "red" }}>{errors.pocketMoney.message}</p>
        )}
        {/* )}
                    /> */}

        {receivesPocketMoney === "yes" && (
          <>
            <Typography variant="h6" mt={3}>
              2b. If yes, is it adequate?
            </Typography>
            {/* <Controller
                                name="pocketMoneyAdequacy"
                                control={control}
                                defaultValue="no"
                                render={({ field }) => ( */}
            <RadioGroup>
              <FormControlLabel
                {...register("pocketMoneyAdequacy")}
                name="pocketMoneyAdequacy"
                value="yes"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel
                {...register("pocketMoneyAdequacy")}
                name="pocketMoneyAdequacy"
                value="no"
                control={<Radio />}
                label="No"
              />
            </RadioGroup>
            {errors.pocketMoneyAdequacy && (
              <p style={{ color: "red" }}>
                {errors.pocketMoneyAdequacy.message}
              </p>
            )}
            {/* )}
                            /> */}
          </>
        )}

        <Typography variant="h6" mt={3}>
          3. Who else meets your financial needs?
        </Typography>

        <>
          <RadioGroup>
            <FormControlLabel
              {...register("financialSupport")}
              name="financialSupport"
              value="Relatives"
              control={<Radio />}
              label="Relatives"
            />
            <FormControlLabel
              {...register("financialSupport")}
              name="financialSupport"
              value="Boyfriend"
              control={<Radio />}
              label="Boyfriend"
            />
            <FormControlLabel
              {...register("financialSupport")}
              name="financialSupport"
              value="Grandparents"
              control={<Radio />}
              label="Grandparents"
            />
            <FormControlLabel
              {...register("financialSupport")}
              name="financialSupport"
              value="Other friends"
              control={<Radio />}
              label="Other friends"
            />
          </RadioGroup>
          {errors.financialSupport && (
            <p style={{ color: "red" }}>{errors.financialSupport.message}</p>
          )}
        </>
        {/* )}
                /> */}

        <Typography variant="h6" mt={3}>
          4. Does your guardian always visit you during visiting days? (For
          boarding students)
        </Typography>
        {/* <Controller
                        name="guardianVisits"
                        control={control}
                        defaultValue="no"
                        render={({ field }) => ( */}
        <RadioGroup>
          <FormControlLabel
            {...register("guardianVisits")}
            name="guardianVisits"
            value="yes"
            control={<Radio />}
            label="Yes"
          />
          <FormControlLabel
            {...register("guardianVisits")}
            name="guardianVisits"
            value="no"
            control={<Radio />}
            label="No"
          />
        </RadioGroup>
        {errors.guardianVisits && (
          <p style={{ color: "red" }}>{errors.guardianVisits.message}</p>
        )}
        {/* )}
                    /> */}

        {guardianVisits === "no" && (
          <>
            <Typography variant="h6" mt={3}>
              4b. If no, who else visits you in school?
            </Typography>
            {/* <Controller
                                name="otherVisitors"
                                control={control}
                                defaultValue="" */}
            {/* render={({ field }) => ( */}
            <RadioGroup>
              <FormControlLabel
                {...register("otherVisitors")}
                name="otherVisitors"
                value="Boyfriend"
                control={<Radio />}
                label="Boyfriend"
              />
              <FormControlLabel
                {...register("otherVisitors")}
                name="otherVisitors"
                value="Relatives"
                control={<Radio />}
                label="Relatives"
              />
              <FormControlLabel
                {...register("otherVisitors")}
                name="otherVisitors"
                value="Brothers/Sisters"
                control={<Radio />}
                label="Brothers/Sisters"
              />
              <FormControlLabel
                {...register("otherVisitors")}
                name="otherVisitors"
                value="Man friend (casual boyfriend)"
                control={<Radio />}
                label="Man friend (casual boyfriend)"
              />
              <FormControlLabel value="None" control={<Radio />} label="None" />
            </RadioGroup>
            {errors.otherVisitors && (
              <p style={{ color: "red" }}>{errors.otherVisitors.message}</p>
            )}
            {/* )}
                            /> */}
          </>
        )}
        <br />
        <hr></hr>
        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            size="medium"
            onClick={() => navigate("/questionnaire-3")}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleSubmit(submit)}

            //     //updateFormData({ ...formData, financialSupport: watch("financialSupport") });
            //     navigate("/questionnaire-5");
            // }}
          >
            Next
          </Button>
        </Box>
        {/* </Form> */}
      </Box>
    </Container>
  );
};

export default QuestionnaireForm4;
