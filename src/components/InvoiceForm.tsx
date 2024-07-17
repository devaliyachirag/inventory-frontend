// InvoiceForm.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "@emotion/styled";
import axiosInstance from "../components/axiosInstance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Token from "./token";

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }
  .react-datepicker__input-container input {
    padding-right: 40px; /* Space for the icon */
  }
`;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

export type InvoiceFormData = {
  invoiceDate: Date | null;
  invoiceNumber: string;
  invoiceDueDate: Date | null;
  clientId: string;
  items: { name: string; amount: number; quantity: number; total: number }[];
};

interface InvoiceFormProps {
  open: boolean;
  handleClose: () => void;
  invoice?: any;
  onDelete?: (id: string) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  open,
  handleClose,
  invoice,
  onDelete,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      items: [{ name: "", amount: 0, quantity: 0, total: 0 }],
    },
  });
  const [clientList, setClientList] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientList(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [open]);

  useEffect(() => {
    if (invoice) {
      reset({
        invoiceDate: new Date(invoice.invoiceDate),
        invoiceNumber: invoice.invoiceNumber,
        invoiceDueDate: new Date(invoice.invoiceDueDate),
        clientId: invoice.clientId,
        items: invoice.items,
      });
    } else {
      reset();
    }
  }, [invoice, open, reset]);

  const items = watch("items");

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.amount * updatedItem.quantity;
        return updatedItem;
      }
      return item;
    });
    setValue("items", updatedItems);
  };

  const addItem = () => {
    const newItem = { name: "", amount: 0, quantity: 0, total: 0 };
    setValue("items", [...items, newItem]);
  };

  const handleDelete =  () => {
    if (invoice && onDelete) {
     onDelete(invoice.id);
      handleClose();
    }
  };

  const onSubmit: SubmitHandler<InvoiceFormData> = async (data) => {
    try {
      Token()
      if (invoice) {
        await axiosInstance.put(`/update-invoice/${invoice.id}`, data, {
          headers: {
            Authorization: `Bearer ${Token()}`,
          },
        });
      } else {
        await axiosInstance.post("/add-invoice", data, {
          headers: {
            Authorization: `Bearer ${Token()}`,
          },
        });
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          {invoice ? "Edit Invoice" : "Add Invoice"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="invoiceDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select invoice date"
                      customInput={
                        <TextField
                          fullWidth
                          margin="normal"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconWrapper>
                                  <CalendarTodayIcon />
                                </IconWrapper>
                              </InputAdornment>
                            ),
                          }}
                        />
                      }
                      className={`form-control ${
                        errors.invoiceDate ? "is-invalid" : ""
                      }`}
                    />
                    {errors.invoiceDate && (
                      <p className="text-danger">
                        {errors.invoiceDate.message}
                      </p>
                    )}
                  </DatePickerWrapper>
                )}
                rules={{ required: "Invoice Date is required" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="invoiceDueDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select due date"
                      customInput={
                        <TextField
                          fullWidth
                          margin="normal"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconWrapper>
                                  <CalendarTodayIcon />
                                </IconWrapper>
                              </InputAdornment>
                            ),
                          }}
                        />
                      }
                      className={`form-control ${
                        errors.invoiceDueDate ? "is-invalid" : ""
                      }`}
                    />
                    {errors.invoiceDueDate && (
                      <p className="text-danger">
                        {errors.invoiceDueDate.message}
                      </p>
                    )}
                  </DatePickerWrapper>
                )}
                rules={{ required: "Invoice Due Date is required" }}
              />
            </Grid>
          </Grid>
          <Controller
            name="invoiceNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Invoice Number"
                fullWidth
                margin="normal"
                {...field}
                error={!!errors.invoiceNumber}
                helperText={errors.invoiceNumber?.message}
              />
            )}
            rules={{ required: "Invoice Number is required" }}
          />
          <Controller
            name="clientId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.clientId}>
                <InputLabel>Client</InputLabel>
                <Select {...field} label="Client">
                  {clientList.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.clientId && (
                  <FormHelperText>{errors.clientId.message}</FormHelperText>
                )}
              </FormControl>
            )}
            rules={{ required: "Client is required" }}
          />
          {items.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={4}>
                <TextField
                  label="Item Name"
                  fullWidth
                  margin="normal"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={item.amount}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "amount",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Total"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={item.total}
                  disabled
                />
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={addItem} fullWidth>
            Add Item
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            {invoice ? "Update Invoice" : "Submit"}
          </Button>
          {invoice && (
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleDelete}
                style={{ marginTop: "20px" }}
              >
                Delete Invoice
              </Button>
            </Grid>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default InvoiceForm;
