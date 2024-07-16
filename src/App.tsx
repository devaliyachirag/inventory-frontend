// src/App.tsx
import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </PrivateRoute>
  );
};

export default App;
