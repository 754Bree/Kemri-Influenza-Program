import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  Button, Container,Typography,Box,Skeleton,Dialog,DialogTitle, DialogContent, DialogActions, Link, Backdrop,} from "@mui/material";
import { styled } from "@mui/system";

const BlurBackdrop = styled(Backdrop)({
  backdropFilter: "blur(5px)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedfirstname = localStorage.getItem("firstname");
    if (storedfirstname) {
      setFirstname(storedfirstname);
    } else {
      console.warn("Firstname not found in localStorage");
    }
    setLoading(false);
  }, []);

  return (
    <Container maxWidth="md" sx={{ width: "75%", margin: "auto" }}>
      <Box textAlign="center" mt={5} p={3} boxShadow={3} borderRadius={3}>
        {loading ? (
          <>
            <Skeleton variant="text" width={250} height={40} />
            <Skeleton variant="text" width={180} height={30} />
            <Skeleton
              variant="rectangular"
              width={150}
              height={40}
              sx={{ mt: 3, mx: "auto" }}
            />
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome to the dashboard
              <br />
              <span>{firstname}!</span>
            </Typography>
            <Typography variant="body1" mt={2}>
              Learn more about the study{" "}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDialog(true);
                }}
              >
                here
              </Link>
              .
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, mr: 2 }}
              onClick={() => navigate("/questionnaire2")}
            >
              Begin
            </Button>
            
          </>
        )}
      </Box>

      {/* Dialog Popup */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        BackdropComponent={BlurBackdrop}
      >
        <DialogTitle>About the Study</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            The study investigates whether cultural beliefs, family socio-economic status,
            sources of information, and social networks affect adolescent girls' adherence
            to sexual abstinence in Kisumu City.
          </Typography>
          <Typography variant="body1" paragraph>
            It aims to create conceptual and operational models that empower adolescent girls
            to make informed choices about sexual activity, either abstaining, delaying sexual debut,
            or practicing safer sex.
          </Typography>
          <Typography variant="body1" paragraph>
            The findings will aid parents, teachers, and health workers in developing strategies
            to promote abstinence, thereby reducing HIV transmission among adolescents and
            lowering HIV prevalence across the country.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Empty Dialog Popup */}
      
    </Container>
  );
};

export default Dashboard;
