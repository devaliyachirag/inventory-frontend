// src/components/InvoiceDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import useAuthApi from '../../components/useApi';
import { format } from 'date-fns';
import styled from '@emotion/styled';

const PaperStyled = styled(Paper)`
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 20px;
  font-weight: 600;
`;

const ItemContainer = styled(Box)`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TotalAmount = styled(Typography)`
  font-weight: 600;
  margin-top: 20px;
  font-size: 18px;
`;

const InvoiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const api = useAuthApi();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await api('get', `/invoice/${id}`);
        setInvoice(data);

        if (data.clientId) {
          const clientData = await api('get', `/client/${data.clientId}`);
          setClientName(clientData.name);
        }

        // Calculate total amount
        const total = data.items.reduce((sum: number, item: any) => sum + item.total, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      }
    };

    fetchInvoice();
  }, [id, api]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', padding: 3 }}>
      {invoice ? (
        <PaperStyled>
          <Typography variant="h4" gutterBottom>
            Invoice Details
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Invoice Number:</SectionTitle>
              <Typography variant="body1">{invoice.invoiceNumber}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Date:</SectionTitle>
              <Typography variant="body1">{format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Due Date:</SectionTitle>
              <Typography variant="body1">{format(new Date(invoice.invoiceDueDate), 'dd/MM/yyyy')}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Client:</SectionTitle>
              <Typography variant="body1">{clientName || 'Loading...'}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <SectionTitle variant="h6">Items:</SectionTitle>
          {invoice.items.map((item: any, index: number) => (
            <ItemContainer key={index}>
              <Typography variant="body1"><strong>Item Name:</strong> {item.name}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> {item.amount}</Typography>
              <Typography variant="body1"><strong>Quantity:</strong> {item.quantity}</Typography>
              <Typography variant="body1"><strong>Total:</strong> {item.total}</Typography>
            </ItemContainer>
          ))}
          <TotalAmount>Total Amount: ${totalAmount.toFixed(2)}</TotalAmount>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              id="printPageButton2"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <Button
              id="printPageButton"
              variant="contained"
              color="secondary"
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
        </PaperStyled>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default InvoiceDetailsPage;
