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
  font-size: 25px;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  padding: 15px 20px;
  background-color: rgba(43, 43, 196, 1);
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
  justify-content: center;
  gap: 8px;
  align-items: center;
`;

const CenteredTableCell = styled(TableCell)`
  text-align: center; 
`;

const TableHeadCell = styled(TableCell)`
  font-weight: bold;
  text-align: center;
  font-size:18px;
  color:white;
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
    navigate(`/invoice-details/${invoice.id}`);   
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewAllInvoices = () => {
    navigate('/all-invoices');
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedInvoices = invoices.slice(startIndex, endIndex);

  return (
    <TableSection>
      <SectionHeading>
        INVOICE LIST
        <AddButton onClick={() => navigate("/invoice-form")}>Add Invoice</AddButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{background:"linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(43, 43, 196, 1) 35%, rgba(0, 212, 255, 1) 100%)"}}>
              <TableHeadCell>Client</TableHeadCell>
              <TableHeadCell>Invoice Date</TableHeadCell>
              <TableHeadCell>Invoice Number</TableHeadCell>
              <TableHeadCell>Due Date</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice) => (
                <TableRow key={invoice.id } >
                  <CenteredTableCell>{getClientName(invoice.clientId)}</CenteredTableCell>
                  <CenteredTableCell>{format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}</CenteredTableCell>
                  <CenteredTableCell>{invoice.invoiceNumber}</CenteredTableCell>
                  <CenteredTableCell>{format(new Date(invoice.invoiceDueDate), 'dd/MM/yyyy')}</CenteredTableCell>
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
                    <IconButton
                      sx={{ color: "rgba(43, 43, 196, 1)" }}
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
            sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
          />
        ) : null
      }
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewAllInvoices}
        sx={{ background: "rgba(43, 43, 196, 1)",marginTop:"50px" }}
      >
        View All Invoices
      </Button>
    </TableSection>
  );
};

export default InvoiceSection;
