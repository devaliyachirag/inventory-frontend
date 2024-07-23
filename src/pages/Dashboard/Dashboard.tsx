import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppBar, Tabs, Tab, Toolbar, Typography, Button, Paper } from "@mui/material";
import styled from "@emotion/styled";
import ClientSection from "../Client/ClientSection";
import InvoiceSection from "../Invoice/InvoiceSection";
import useAuthApi from "../../components/useApi";



const StyledAppBar = styled(AppBar)`
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(43, 43, 196, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const StyledHeading = styled(Typography)`
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
`;

const StyledButton = styled(Button)`
  background: rgba(43, 43, 196, 1);
  &:hover {
    background-color: #00796b;
  }
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background-color: #fff;
  }
  .MuiTab-root {
    color: #fff;
    &.Mui-selected {
      color: #fff;
      font-weight: bold;
    }
  }
`;

const StyledTabPanel = styled(Paper)`
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(parseInt(searchParams.get("tab") || "0", 10));
  const [loading, setLoading] = useState(true);
  const api = useAuthApi();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
    setSearchParams({ tab: newValue.toString() });
  };

  useEffect(() => {
    const checkCompanyRegistration = async () => {
      try {
        const response = await api("GET", "/company");
        if (response && response.company) {
          navigate("/");
        }
      } catch (error) {
        console.error("No company registered or error occurred:", error);
        navigate("/register-company");
      } finally {
        setLoading(false);
      }
    };

    checkCompanyRegistration();
  }, [navigate, api]);

  useEffect(() => {
    const tabParam = parseInt(searchParams.get("tab") || "0", 10);
    setActiveTab(tabParam);
  }, [searchParams]);

  if (loading) {
    return null;
  }

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <StyledHeading variant="h6">Inventory</StyledHeading>
          <StyledButton variant="contained" onClick={handleLogout}>
            Logout
          </StyledButton>
        </StyledToolbar>
        <StyledTabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Clients" />
          <Tab label="Invoices" />
        </StyledTabs>
      </StyledAppBar>
      <StyledTabPanel hidden={activeTab !== 0}>
        <ClientSection />
      </StyledTabPanel>
      <StyledTabPanel hidden={activeTab !== 1}>
        <InvoiceSection />
      </StyledTabPanel>
    </>
  );
};

export default Dashboard;