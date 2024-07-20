import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthApi from "../../components/useApi";
import { useNavigate } from "react-router-dom";

const TableSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
`;

const SectionHeading = styled.h2`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const StyledTableCell = styled(TableCell)`
  text-align: center;
  padding: 16px;
`;

const ActionCell = styled(TableCell)`
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
`;

const TableHeadCell = styled(TableCell)`
  font-weight: bold;
  text-align: center;
  padding: 16px;
`;
const HeadingText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;
const BackButton = styled(Button)`
  background-color: rgba(43, 43, 196, 1);
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const StripedTableRow = styled(TableRow)<{ isOdd: boolean }>`
  background-color: ${({ isOdd }) => (isOdd ? '#f9f9f9' : '#ffffff')};
`;

const AllClients: React.FC<any> = () => {
  const [clientList, setClientList] = useState<any[]>([]);
  const api = useAuthApi();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/'); // Navigate to the previous or desired page
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
      <SectionHeading>
        <HeadingText>All Clients</HeadingText>
        <BackButton onClick={handleBack}>Back</BackButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Company Name</TableHeadCell>
              <TableHeadCell>Company Email</TableHeadCell>
              <TableHeadCell>GST Number</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientList.length > 0 ? (
              clientList.map((client, index) => (
                <StripedTableRow key={client.id} isOdd={index % 2 === 0}>
                  <StyledTableCell>{client.name}</StyledTableCell>
                  <StyledTableCell>{client.companyName}</StyledTableCell>
                  <StyledTableCell>{client.companyEmail}</StyledTableCell>
                  <StyledTableCell>{client.gstNumber}</StyledTableCell>
                  <ActionCell>
                    <IconButton  sx={{ color: "rgba(43, 43, 196, 1)" }} onClick={() => handleEdit(client.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: "rgba(0, 212, 255, 1)" }} onClick={() => handleDelete(client.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ActionCell>
                </StripedTableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={5}>No Clients found</StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </TableSection>
  );
};

export default AllClients;
