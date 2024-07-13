// src/components/HomePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Modal, Box } from "@mui/material";
import ClientForm from "../components /ClientForm";
import {ClientFormData} from "../components /ClientForm";
import { SubmitHandler } from "react-hook-form";

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

const TableSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeading = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const NoDataMessage = styled.p`
  color: #888;
  font-size: 16px;
`;

const DataList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const onSubmit: SubmitHandler<ClientFormData> = (data:any) => {
    console.log(data);
    // Handle the form submission, e.g., send data to the backend
    handleClose();
  };

  const clients = []; // Replace with actual client data
  const invoices = []; // Replace with actual invoice data

  return (
    <Container>
      <Header>
        <Heading>Inventory</Heading>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Table>
        <TableSection>
          <SectionHeading>
            Client
            <AddButton onClick={handleOpen}>Add Client</AddButton>
          </SectionHeading>
          {clients.length === 0 ? (
            <NoDataMessage>No data</NoDataMessage>
          ) : (
            <DataList>
              {/* Map through clients and render them here */}
            </DataList>
          )}
        </TableSection>
        <TableSection>
          <SectionHeading>
            Invoice
            <AddButton onClick={() => console.log("Add Invoice")}>Add Invoice</AddButton>
          </SectionHeading>
          {invoices.length === 0 ? (
            <NoDataMessage>No data</NoDataMessage>
          ) : (
            <DataList>
              {/* Map through invoices and render them here */}
            </DataList>
          )}
        </TableSection>
      </Table>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <ClientForm onSubmit={onSubmit} />
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
