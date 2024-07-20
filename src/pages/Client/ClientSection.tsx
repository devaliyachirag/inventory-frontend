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
import { useNavigate } from "react-router-dom";
import useAuthApi from "../../components/useApi";

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
  font-size: 25px;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  padding: 15px 20px;
  background-color:  rgba(43, 43, 196, 1);
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
  text-align: center;
`;

const CenteredTableCell = styled(TableCell)`
  text-align: center;
`;

const BoldTableCell = styled(TableCell)`
  font-weight: bold;
  text-align: center;
  font-size:18px;
  color:white;
`;

const ClientSection: React.FC<any> = () => {
  const [clientList, setClientList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const api = useAuthApi();
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate("/add-client");
  };

  const handleEdit = (clientId: string) => {
    navigate(`/edit-client/${clientId}`);
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

  const lastFiveClients = clientList.slice(-5);
  const currentClients = currentPage === 1 ? lastFiveClients : clientList.slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage);

  return (
    <TableSection>
      <SectionHeading>
        CLIENT LIST
        <AddButton onClick={handleOpen}>Add Client</AddButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{background:"linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(43, 43, 196, 1) 35%, rgba(0, 212, 255, 1) 100%)"}}>
              <BoldTableCell>Name</BoldTableCell>
              <BoldTableCell>Company Name</BoldTableCell>
              <BoldTableCell>Company Email</BoldTableCell>
              <BoldTableCell>GST Number</BoldTableCell>
              <BoldTableCell>Action</BoldTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentClients.length > 0 ? (
              currentClients.map((client) => (
                <TableRow key={client.id}>
                  <CenteredTableCell>{client.name}</CenteredTableCell>
                  <CenteredTableCell>{client.companyName}</CenteredTableCell>
                  <CenteredTableCell>{client.companyEmail}</CenteredTableCell>
                  <CenteredTableCell>{client.gstNumber}</CenteredTableCell>
                  <CenteredTableCell>
                    <IconButton sx={{ color: "rgba(43, 43, 196, 1)" }} onClick={() => handleEdit(client.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: "rgba(0, 212, 255, 1)" }} onClick={() => handleDelete(client.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CenteredTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <CenteredTableCell colSpan={5}>
                  <NoDataMessage>No Clients found</NoDataMessage>
                </CenteredTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {clientList.length > 5 && (
        <Pagination
          count={Math.ceil(clientList.length / clientsPerPage)}
          page={currentPage}
          // color="primary"
          onChange={handlePageChange}
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', }}
        />
      )}
      <Button variant="contained" sx={{background: "rgba(43, 43, 196, 1)"}} onClick={handleViewAllClients} >
        View All Clients
      </Button>
    </TableSection>
  );
};

export default ClientSection;
