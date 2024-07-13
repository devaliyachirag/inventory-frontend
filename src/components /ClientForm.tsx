// src/components/ClientForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";
import axiosInstance from './axiosInstance';

export type ClientFormData = {
  email: string;
  name: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  gstNumber: string;
};

interface ClientFormProps {
  onSubmit: SubmitHandler<ClientFormData>;
}

const ClientForm: React.FC<ClientFormProps> = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>();
  
  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      // Retrieve the token from local storage or wherever it's stored
      const token = localStorage.getItem('token');

      // Send the request with the token in the headers
      const response = await axiosInstance.post("/add-client", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Client added successfully');
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add Client
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Company Name"
          fullWidth
          margin="normal"
          {...register("companyName", { required: "Company Name is required" })}
          error={!!errors.companyName}
          helperText={errors.companyName?.message}
        />
        <TextField
          label="Company Email"
          fullWidth
          margin="normal"
          {...register("companyEmail", { required: "Company Email is required" })}
          error={!!errors.companyEmail}
          helperText={errors.companyEmail?.message}
        />
        <TextField
          label="Company Address"
          fullWidth
          margin="normal"
          {...register("companyAddress", { required: "Company Address is required" })}
          error={!!errors.companyAddress}
          helperText={errors.companyAddress?.message}
        />
        <TextField
          label="GST Number"
          fullWidth
          margin="normal"
          {...register("gstNumber", { required: "GST Number is required" })}
          error={!!errors.gstNumber}
          helperText={errors.gstNumber?.message}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ClientForm;
