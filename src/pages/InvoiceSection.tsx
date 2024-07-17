import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import axiosInstance from '../components/axiosInstance';
import InvoiceForm from '../components/InvoiceForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns'; 

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
  const [open, setOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any | null>(null); 

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
        const token = localStorage.getItem('token');

        const invoicesResponse = await axiosInstance.get('/user-invoices', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(invoicesResponse.data);

        const clientsResponse = await axiosInstance.get('/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(clientsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [open]);

  const getClientName = (clientId: string) => {
    const client = clients.find(client => client.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/delete-invoice/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleEditInvoice = (invoice: any) => {
    handleOpen(invoice);
  };

  return (
    <TableSection>
      <SectionHeading>
        Invoice List
        <AddButton onClick={() => handleOpen()}>Add Invoice</AddButton>
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
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
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
      <InvoiceForm open={open} handleClose={handleClose} invoice={currentInvoice} />
    </TableSection>
  );
};

export default InvoiceSection;
