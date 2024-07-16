import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClientForm, { ClientFormData } from "../components/ClientForm";
import { SubmitHandler } from "react-hook-form";

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

const NoDataMessage = styled.p`
  color: #888;
  font-size: 16px;
`;

const ClientSection: React.FC<any> = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [clientList, setClientList] = useState<any[]>([]);
  const [defaultValues, setDefaultValues] = useState<
    ClientFormData | undefined
  >(undefined);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditClientId(null);
    setDefaultValues({
      email: "",
      name: "",
      companyName: "",
      companyEmail: "",
      companyAddress: "",
      gstNumber: "",
    });
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
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
  }, []);

  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (editMode && editClientId) {
        await axiosInstance.put(`/update-client/${editClientId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        handleClose();
      } else {
        await axiosInstance.post("/add-client", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      const updatedClients = await axiosInstance.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientList(updatedClients.data);
      handleClose();
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleEdit = (clientId: string) => {
    const clientToEdit = clientList.find((client) => client.id === clientId);
    if (clientToEdit) {
      setEditMode(true);
      setEditClientId(clientId);
      setDefaultValues(clientToEdit);
      handleOpen();
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/delete-client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedClients = await axiosInstance.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientList(updatedClients.data);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("An error occurred while deleting the client.");
    }
  };

  return (
    <TableSection>
      <SectionHeading>
        Client
        <AddButton onClick={handleOpen}>Add Client</AddButton>
      </SectionHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Email</TableCell>
              <TableCell>GST Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientList.length > 0 ? (
              clientList.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.companyName}</TableCell>
                  <TableCell>{client.companyEmail}</TableCell>
                  <TableCell>{client.gstNumber}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(client.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(client.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ClientForm
        open={open}
        handleClose={handleClose}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        editMode={editMode}
      />
    </TableSection>
  );
};

export default ClientSection;
