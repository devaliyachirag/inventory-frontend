import React, { useState, useEffect } from "react";
import {
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
  InputAdornment,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "@emotion/styled";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate, useParams } from "react-router-dom";
import useAuthApi from "../../components/useApi";

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

const InvoiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useAuthApi(); // Use the custom hook
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
  const [invoice, setInvoice] = useState<any | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await api("GET", "/clients");
        setClientList(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [api]);

  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        try {
          const invoiceData = await api("GET", `/invoice/${id}`);
          setInvoice(invoiceData);
          reset({
            invoiceDate: new Date(invoiceData.invoiceDate),
            invoiceNumber: invoiceData.invoiceNumber,
            invoiceDueDate: new Date(invoiceData.invoiceDueDate),
            clientId: invoiceData.clientId,
            items: invoiceData.items,
          });
        } catch (error) {
          console.error("Error fetching invoice:", error);
        }
      };

      fetchInvoice();
    } else {
      reset();
    }
  }, [id, api, reset]);

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

  const handleDelete = async () => {
    if (invoice) {
      try {
        await api("DELETE", `/delete-invoice/${invoice.id}`);
        navigate("/");
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const onSubmit: SubmitHandler<InvoiceFormData> = async (data:any) => {
    try {
      if (invoice) {
        await api("PUT", `/update-invoice/${invoice.id}`, data);
      } else {
        await api("POST", "/add-invoice", data);
      }
      navigate("/");
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <Box sx={formStyle}>
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
                  handleItemChange(index, "amount", parseFloat(e.target.value))
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
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleDelete}
            style={{ marginTop: "20px" }}
          >
            Delete Invoice
          </Button>
        )}
      </form>
    </Box>
  );
};

export default InvoiceFormPage;
