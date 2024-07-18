// src/App.tsx
import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/LoginPage"
import ClientSection from "./pages/Client/ClientSection";
import AllClients from "./pages/Client/AllClient";
import ClientForm from "./pages/Client/ClientForm";
const App: React.FC = () => {
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-clients" element={<AllClients />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PrivateRoute>
  );
};

export default App;
