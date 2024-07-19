// src/components/AllInvoicesPage.tsx
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import useAuthApi from '../../components/useApi';
import InvoiceForm from './InvoiceForm';

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

const ActionCell = styled(TableCell)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CenteredTableCell = styled(TableCell)`
  text-align: center; 
`;

const AllInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const api = useAuthApi();

  const handleOpen = (invoice?: any) => {
    setCurrentInvoice(invoice || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentInvoice(null);
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
  }, [api, open]);

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
    handleOpen(invoice);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const displayedInvoices = invoices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <TableSection>
      <SectionHeading>
        All Invoices
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
    </TableSection>
  );
};

export default AllInvoicesPage;
