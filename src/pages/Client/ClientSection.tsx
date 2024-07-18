// src/components/ClientSection.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClientForm, { ClientFormData } from "./ClientForm";
import { SubmitHandler } from "react-hook-form";
import useAuthApi from "../../components/useApi";
import { useNavigate } from "react-router-dom";

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

const ClientSection: React.FC<any> = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [clientList, setClientList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const [defaultValues, setDefaultValues] = useState<ClientFormData | undefined>(undefined);
  const api = useAuthApi();
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditClientId(null);
    setDefaultValues({
      email: "",
      name: "",
      companyName: "",
      companyEmail: "",
      companyAddress: "",
      gstNumber: "",
    });
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await api('get', '/clients');
        setClientList(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [api]);

  const onSubmit: SubmitHandler<ClientFormData> = async (data: any) => {
    try {
      if (editMode && editClientId) {
        await api('put', `/update-client/${editClientId}`, data);
        handleClose();
      } else {
        await api('post', '/add-client', data);
      }
      const updatedClients = await api('get', '/clients');
      setClientList(updatedClients);
      handleClose();
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleEdit = (clientId: string) => {
    const clientToEdit = clientList.find((client) => client.id === clientId);
    if (clientToEdit) {
      setEditMode(true);
      setEditClientId(clientId);
      setDefaultValues(clientToEdit);
      handleOpen();
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      await api('delete', `/delete-client/${clientId}`);
      const updatedClients = await api('get', '/clients');
      setClientList(updatedClients);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("An error occurred while deleting the client.");
    }
  };

  const handleViewAllClients = () => {
    navigate('/all-clients');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const lastFiveClients = clientList.slice(-5);
  const currentClients = currentPage === 1 ? lastFiveClients : clientList.slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage);

  return (
    <TableSection>
      <SectionHeading>
        Client
        <AddButton onClick={handleOpen}>Add Client</AddButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Email</TableCell>
              <TableCell>GST Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentClients.length > 0 ? (
              currentClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.companyName}</TableCell>
                  <TableCell>{client.companyEmail}</TableCell>
                  <TableCell>{client.gstNumber}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(client.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(client.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {clientList.length > 5 && (
        <Pagination
          count={Math.ceil(clientList.length / clientsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      )}
      <Button variant="contained" color="primary" onClick={handleViewAllClients} style={{ marginTop: '20px' }}>
        View All Clients
      </Button>
      <ClientForm
        open={open}
        handleClose={handleClose}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        editMode={editMode}
      />
    </TableSection>
  );
};

export default ClientSection;
