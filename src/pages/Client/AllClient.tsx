// src/components/AllClients.tsx
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthApi from "../../components/useApi";

const TableSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeading = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const AllClients: React.FC<any> = () => {
  const [clientList, setClientList] = useState<any[]>([]);
  const api = useAuthApi();

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

  const handleEdit = (clientId: string) => {
    // Implement edit functionality
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

  return (
    <TableSection>
      <SectionHeading>All Clients</SectionHeading>
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
            {clientList.length > 0 ? (
              clientList.map((client) => (
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
    </TableSection>
  );
};

export default AllClients;
