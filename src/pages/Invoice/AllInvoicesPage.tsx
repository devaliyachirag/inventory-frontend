import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import useAuthApi from '../../components/useApi';
import { useNavigate } from 'react-router-dom';

const TableSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height:100vh;
`;

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const HeadingText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const StyledTableCell = styled(TableCell)`
  text-align: center;
  padding: 16px;
`;

const TableHeadCell = styled(TableCell)`
  font-weight: bold;
  text-align: center;
  padding: 16px;
  background-color: #f0f2f5;
`;

const ActionCell = styled(TableCell)`
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
`;

const StripedTableRow = styled(TableRow) <{ isOdd: boolean }>`
  background-color: ${({ isOdd }) => (isOdd ? '#f9f9f9' : '#ffffff')};
`;

const BackButton = styled(Button)`
  background-color: rgba(43, 43, 196, 1);
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const AllInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const api = useAuthApi();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigate to the previous or desired page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesData = await api('get', '/user-invoices');
        setInvoices(invoicesData);

        const clientsData = await api('get', '/clients');
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [api]);

  const getClientName = (clientId: string) => {
    const client = clients.find(client => client.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await api('delete', `/delete-invoice/${invoiceId}`);
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleEditInvoice = (invoice: any) => {
    // Handle editing invoice functionality here
  };

  // const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
  //   setPage(value);
  // };

  const displayedInvoices = invoices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <TableSection>
      <SectionHeading>
        <HeadingText>All Invoices</HeadingText>
        <BackButton onClick={handleBack}>Back</BackButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableHeadCell>Invoice Date</TableHeadCell>
              <TableHeadCell>Invoice Number</TableHeadCell>
              <TableHeadCell>Client</TableHeadCell>
              <TableHeadCell>Due Date</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice, index) => (
                <StripedTableRow key={invoice.id} isOdd={index % 2 === 0}>
                  <StyledTableCell>{format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}</StyledTableCell>
                  <StyledTableCell>{invoice.invoiceNumber}</StyledTableCell>
                  <StyledTableCell>{getClientName(invoice.clientId)}</StyledTableCell>
                  <StyledTableCell>{format(new Date(invoice.invoiceDueDate), 'dd/MM/yyyy')}</StyledTableCell>
                  <ActionCell>
                    <IconButton
                      sx={{ color: "rgba(43, 43, 196, 1)" }}
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "rgba(0, 212, 255, 1)" }}
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ActionCell>
                </StripedTableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={5}>
                  No invoices found
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </TableSection>
  );
};

export default AllInvoicesPage;
