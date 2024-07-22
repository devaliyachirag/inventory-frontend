// src/components/ClientFormPage.tsx

import React, { useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthApi from '../../components/useApi';

export type ClientFormData = {
  email: string;
  name: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  gstNumber: string;
};

const formStyle = {
  maxWidth: 600,
  margin: 'auto',
  marginTop: '20px',
  padding: '20px',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const SubmitButton = styled(Button)`
  margin-top: 16px;
`;

const ClientFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useAuthApi();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientFormData>({
    defaultValues: {
      email: '',
      name: '',
      companyName: '',
      companyEmail: '',
      companyAddress: '',
      gstNumber: '',
    },
  });

  const fetchClientData = async (clientId: string) => {
    try {
      const clientData = await api('get', `/client/${clientId}`);
      reset(clientData);  // Update form fields with fetched data
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClientData(id);
    }
  }, [id, api, reset]);

  const onSubmit: SubmitHandler<ClientFormData> = async (data: any) => {
    try {
      if (id) {
        await api('put', `/update-client/${id}`, data);
      } 
      else {
        await api('post', '/add-client', data);
      }
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Box sx={formStyle}>
      <Typography variant="h6" gutterBottom>
        {id ? "Edit Client" : "Add Client"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <TextField
          label="Company Name"
          fullWidth
          margin="normal"
          {...register("companyName", { required: "Company Name is required" })}
          error={!!errors.companyName}
          helperText={errors.companyName?.message}
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <TextField
          label="Company Email"
          fullWidth
          margin="normal"
          {...register("companyEmail", { required: "Company Email is required" })}
          error={!!errors.companyEmail}
          helperText={errors.companyEmail?.message}
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <TextField
          label="Company Address"
          fullWidth
          margin="normal"
          {...register("companyAddress", { required: "Company Address is required" })}
          error={!!errors.companyAddress}
          helperText={errors.companyAddress?.message}
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <TextField
          label="GST Number"
          fullWidth
          margin="normal"
          {...register("gstNumber", { required: "GST Number is required" })}
          error={!!errors.gstNumber}
          helperText={errors.gstNumber?.message}
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <SubmitButton type="submit" variant="contained" sx={{ background: "rgba(43, 43, 196, 1)" }} fullWidth>
          Submit
        </SubmitButton>
      </form>
    </Box>
  );
};

export default ClientFormPage;
