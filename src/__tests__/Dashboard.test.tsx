import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import useAuthApi from "../components/useApi";
type CompanyResponse = {
  company: boolean;
};

jest.mock("../components/useApi", () => ({
  __esModule: true,
  // default: jest.fn(),
}));

const mockApi = useAuthApi as jest.MockedFunction<typeof useAuthApi>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
const { useNavigate } = require("react-router-dom");

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
  });

  test("renders Dashboard with tabs and logout button", async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: /Clients/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Invoices/i })).toBeInTheDocument();
  });

  test("handles logout button click", async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("loads and displays ClientSection and InvoiceSection based on tab selection", async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(screen.getByText(/CLIENT LIST/i)).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: /Invoices/i }));

    await waitFor(() => {
      expect(screen.getByText(/INVOICE LIST/i)).toBeVisible();
    });
  });

  test("navigates to register-company if no company is registered", async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/register-company");
    });
  });
});
