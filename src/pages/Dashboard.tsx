// src/components/HomePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import ClientSection from "./ClientSection";
import InvoiceSection from "./InvoiceSection";

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(43, 43, 196, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

const Table = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const clients:any = []; 
  const invoices:any = []; 

  return (
    <Container>
      <Header>
        <Heading>Inventory</Heading>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Table>
        <ClientSection />
        <InvoiceSection />
      </Table>
    </Container>
  );
};

export default Dashboard;
