import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Add this import
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import useAuthApi from '../../components/useApi';

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

const ActionCell = styled(TableCell)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CenteredTableCell = styled(TableCell)`
  text-align: center; 
`;

const InvoiceSection: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const api = useAuthApi();
  const navigate = useNavigate();

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
    navigate(`/invoice-form/${invoice.id}`);
  };

  const handleViewInvoiceDetails = (invoice: any) => {
    navigate(`/invoice-details/${invoice.id}`); // Navigate to the new details page
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewAllInvoices = () => {
    navigate('/all-invoices');
  };

  // Calculate start and end index for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedInvoices = invoices.slice(startIndex, endIndex);

  return (
    <TableSection>
      <SectionHeading>
        Invoice List
        <AddButton onClick={() => navigate("/invoice-form")}>Add Invoice</AddButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <CenteredTableCell>Invoice Date</CenteredTableCell>
              <CenteredTableCell>Invoice Number</CenteredTableCell>
              <CenteredTableCell>Client</CenteredTableCell>
              <CenteredTableCell>Due Date</CenteredTableCell>
              <CenteredTableCell>Action</CenteredTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <CenteredTableCell>{format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}</CenteredTableCell>
                  <CenteredTableCell>{invoice.invoiceNumber}</CenteredTableCell>
                  <CenteredTableCell>{getClientName(invoice.clientId)}</CenteredTableCell>
                  <CenteredTableCell>{format(new Date(invoice.invoiceDueDate), 'dd/MM/yyyy')}</CenteredTableCell>
                  <ActionCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="default"
                      onClick={() => handleViewInvoiceDetails(invoice)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </ActionCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <CenteredTableCell colSpan={5}>
                  No invoices found
                </CenteredTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {
        invoices.length > 5 ? (
          <Pagination
            count={Math.ceil(invoices.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
          />
        ) : null
      }
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewAllInvoices}
        sx={{ display: 'block', margin: '20px auto 0' }}
      >
        View All Invoices
      </Button>
    </TableSection>
  );
};

export default InvoiceSection;
