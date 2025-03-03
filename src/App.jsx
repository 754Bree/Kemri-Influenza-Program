import React, { createContext, useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Login from "./pages/Login";
import { FormProvider } from "./context/FormContext";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import QuestionnaireForm from "./pages/QuestionnaireForm";
import QuestionnaireForm2 from "./pages/QuestionnaireForm2";
import QuestionnaireForm3 from "./pages/QuestionnaireForm3";
import QuestionnaireForm4 from "./pages/QuestionnaireForm4";
import QuestionnaireForm5 from "./pages/QuestionnaireForm5";

// Create Theme Context
export const ThemeContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userID"));
  const [darkMode, setDarkMode] = useState(false);

  // Create MUI theme based on dark mode state
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Ensures global dark mode styles */}
        <FormProvider>
          <Router>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Ensures full viewport height
              }}
            >
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

              {/* Content wrapper to push footer to bottom */}
              <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <Routes>
                  <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/questionnaire" element={<QuestionnaireForm />} />
                  <Route path="/questionnaire2" element={<QuestionnaireForm2 />} />
                  <Route path="/questionnaire-3" element={<QuestionnaireForm3 />} />
                  <Route path="/questionnaire-4" element={<QuestionnaireForm4 />} />
                  <Route path="/questionnaire-5" element={<QuestionnaireForm5 />} />
                </Routes>
              </Box>

              <Footer />
            </Box>
          </Router>
        </FormProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
