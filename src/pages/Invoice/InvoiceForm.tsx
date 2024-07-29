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
  IconButton,
} from "@mui/material";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import DatePickerComponent from "../../components/DatePickerComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
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
  const api = useAuthApi();
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [clientList, setClientList] = useState<any[]>([]);
  const [invoice, setInvoice] = useState<any | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

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

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = items.reduce(
        (acc, item) => acc + item.amount * item.quantity,
        0
      );
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [items]);

  const addItem = () => {
    append({ name: "", amount: 0, quantity: 0, total: 0 });
  };

  const handleDeleteItem = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<InvoiceFormData> = async (data: any) => {
    try {
      if (invoice) {
        await api("PUT", `/update-invoice/${invoice.id}`, data);
      } else {
        await api("POST", "/add-invoice", data);
      }
      navigate(-1);
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  const validateFirstItem = () => {
    const firstItem = items[items.length - 1] || {};
    return firstItem.name && firstItem.amount > 0 && firstItem.quantity > 0;
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
                <DatePickerComponent
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  label="Invoice Date"
                  error={!!errors.invoiceDate}
                  helperText={errors.invoiceDate?.message}
                />
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
                <DatePickerComponent
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  label="Due Date"
                  error={!!errors.invoiceDueDate}
                  helperText={errors.invoiceDueDate?.message}
                />
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
                {clientList && clientList.map((client) => (
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
        {fields.map((item, index) => (
          <Grid container spacing={2} key={item.id}>
            <Grid item xs={4}>
              <Controller
                name={`items.${index}.name`}
                control={control}
                defaultValue={item.name}
                render={({ field }) => (
                  <TextField
                    label="Item Name"
                    fullWidth
                    margin="normal"
                    {...field}
                    error={!!errors.items?.[index]?.name}
                    helperText={errors.items?.[index]?.name?.message}
                  />
                )}
                rules={{ required: "Item Name is required" }}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={`items.${index}.amount`}
                control={control}
                defaultValue={item.amount}
                render={({ field }) => (
                  <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    {...field}
                    error={!!errors.items?.[index]?.amount}
                    helperText={errors.items?.[index]?.amount?.message}
                  />
                )}
                rules={{ required: "Amount is required", min: 1 }}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={`items.${index}.quantity`}
                control={control}
                defaultValue={item.quantity}
                render={({ field }) => (
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    margin="normal"
                    {...field}
                    error={!!errors.items?.[index]?.quantity}
                    helperText={errors.items?.[index]?.quantity?.message}
                  />
                )}
                rules={{ required: "Quantity is required", min: 1 }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Total"
                type="number"
                fullWidth
                margin="normal"
                value={item.amount * item.quantity}
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                aria-label="delete"
                color="secondary"
                style={{ margin: "20px 0" }}
                onClick={() => handleDeleteItem(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Total Amount: {totalAmount}
        </Typography>
        <Button
          variant="outlined"
          onClick={addItem}
          fullWidth
          disabled={!validateFirstItem()}
        >
          Add Item
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{ background: "rgba(43, 43, 196, 1)" }}
          fullWidth
          style={{ marginTop: "20px" }}
        >
          {invoice ? "Update Invoice" : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default InvoiceFormPage;
