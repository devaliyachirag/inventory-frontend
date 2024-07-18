import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import styled from '@emotion/styled';

export type ClientFormData = {
  email: string;
  name: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  gstNumber: string;
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SubmitButton = styled(Button)`
  margin-top: 16px;
`;

interface ClientFormProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: SubmitHandler<ClientFormData>;
  defaultValues?: ClientFormData;
  editMode: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ open, handleClose, onSubmit, defaultValues, editMode }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientFormData>({
    defaultValues,
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          {editMode ? "Edit Client" : "Add Client"}
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
          <SubmitButton type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </SubmitButton>
        </form>
      </Box>
    </Modal>
  );
};

export default ClientForm;
