import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ClientFormPage from "../pages/Client/ClientForm";
import useAuthApi from "../components/useApi";

jest.mock("../components/useApi");

const mockApi = useAuthApi as jest.MockedFunction<typeof useAuthApi>;

describe("ClientFormPage", () => {
  beforeEach(() => {
    mockApi.mockClear();
  });

  test("renders all input fields", () => {
    render(
      <Router>
        <ClientFormPage />
      </Router>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GST Number/i)).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    render(
      <Router>
        <ClientFormPage />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const emailErrors = screen.getAllByText(/Email is required/i);
      const nameError = screen.getByText("Name is required");
      const companyNameError = screen.getByText(/Company Name is required/i);
      const companyEmailError = screen.getByText(/Company Email is required/i);
      const companyAddressError = screen.getByText(
        /Company Address is required/i
      );
      const gstNumberError = screen.getByText(/GST Number is required/i);

      expect(emailErrors).toHaveLength(2);
      expect(nameError).toBeInTheDocument();
      expect(companyNameError).toBeInTheDocument();
      expect(companyEmailError).toBeInTheDocument();
      expect(companyAddressError).toBeInTheDocument();
      expect(gstNumberError).toBeInTheDocument();
    });
  });
});
