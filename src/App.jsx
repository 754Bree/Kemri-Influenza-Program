import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QuestionnaireForm from "./pages/QuestionnaireForm";
import Dashboard from "./pages/Dashboard"; // Main app page after login
import QuestionnaireForm2 from "./pages/QuestionnaireForm2";
import QuestionnaireForm3 from "./pages/QuestionnaireForm3";
import QuestionnaireForm4 from "./pages/QuestionnaireForm4";
import QuestionnaireForm5 from "./pages/QuestionnaireForm5";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const questionnaireSN = useState("12345"); // Example SN
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh"> {/* Full height layout */}
      <Router>
        {/* Navbar with conditional visibility */}
        <Navbar isLoggedIn={isLoggedIn} questionnaireSN={questionnaireSN} />
        <Box flexGrow={1}> {/* Ensures content pushes footer to bottom */}
          <Routes>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/questionnaire" element={<QuestionnaireForm />} /> {/* New Route */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questionnaire2" element={<QuestionnaireForm2 />} />
            <Route path="/questionnaire-3" element={<QuestionnaireForm3 />} />
            <Route path="/questionnaire-4" element={<QuestionnaireForm4 />} />
            <Route path="/questionnaire-5" element={<QuestionnaireForm5 />} />
          </Routes>
        </Box>
        <Footer />
      </Router>
    </Box>
  );
}

export default App;
