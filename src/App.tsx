// src/App.tsx
import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/LoginPage";
import AllClients from "./pages/Client/AllClient";
import ClientForm from "./pages/Client/ClientForm";
import AllInvoicesPage from "./pages/Invoice/AllInvoicesPage";
import InvoiceForm from "./pages/Invoice/InvoiceForm";
import InvoiceDetailsPage from "./pages/Invoice/InvoiceDetailsPage";
const App: React.FC = () => {
  
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-clients" element={<AllClients />} />
        <Route path="/add-client" element={<ClientForm />} />
        <Route path="/edit-client/:id" element={<ClientForm />} />
        <Route path="/all-invoices" element={<AllInvoicesPage />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/invoice-form/:id" element={<InvoiceForm />} />
        <Route path="/invoice-details/:id" element={<InvoiceDetailsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PrivateRoute>
  );
};

export default App;
