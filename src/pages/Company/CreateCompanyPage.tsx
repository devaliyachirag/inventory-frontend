import React, { useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthApi from "../../components/useApi";

const formStyle = {
  maxWidth: 600,
  margin: "auto",
  marginTop: 4,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 3,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

type CompanyFormData = {
  companyName: string;
  companyEmail: string;
  companyContactNo: string;
  address: string;
  gstNumber: string;
};

const CompanyRegisterPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyContactNo: "",
      address: "",
      gstNumber: "",
    },
  });
  const api = useAuthApi();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CompanyFormData> = async (data: any) => {
    try {
      await api("post", "/register-company", data);
      navigate("/");
    } catch (error) {
      console.error("Error registering company:", error);
    }
  };

  useEffect(() => {
    const checkCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get("http://localhost:5050/company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          navigate("/");
        }
      } catch (error) {
        console.error("No company registered", error);
      }
    };
    checkCompany();
  }, [navigate]);

  return (
    <Box sx={formStyle}>
      <Typography variant="h6" gutterBottom>
        Register Company
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <TextField
              label="Company Name"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
            />
          )}
          rules={{ required: "Company Name is required" }}
        />
        <Controller
          name="companyEmail"
          control={control}
          render={({ field }) => (
            <TextField
              label="Company Email"
              type="email"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.companyEmail}
              helperText={errors.companyEmail?.message}
            />
          )}
          rules={{
            required: "Company Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
          }}
        />
        <Controller
          name="companyContactNo"
          control={control}
          render={({ field }) => (
            <TextField
              label="Company Contact No."
              type="tel"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.companyContactNo}
              helperText={errors.companyContactNo?.message}
            />
          )}
          rules={{
            required: "Company Contact No. is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid contact number",
            },
          }}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          )}
          rules={{ required: "Address is required" }}
        />
        <Controller
          name="gstNumber"
          control={control}
          render={({ field }) => (
            <TextField
              label="GST Number"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber?.message}
            />
          )}
          rules={{ required: "GST Number is required" }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ background: "rgba(43, 43, 196, 1)" }}
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CompanyRegisterPage;
