import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard"; // Corrected
import Registration from "./pages/registration";
import FormStats from "./pages/formstats";
import EmployeeCredentials from "./pages/employeeCredentials";
import Login from "./pages/login";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registration" element={<Registration />} />
        <Route path="/forms" element={<FormStats />} />
        <Route path="/logs" element={<EmployeeCredentials />} />
      </Routes>
    </Router>
  );
};

export default App;
