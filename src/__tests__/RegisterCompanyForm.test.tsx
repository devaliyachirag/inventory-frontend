import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CompanyRegisterPage from "../pages/Company/CreateCompanyPage";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";

describe("CompanyRegisterPage", () => {
    test("displays validation errors for empty fields", async () => {
        render(
          <Router>
            <CompanyRegisterPage />
          </Router>
        );
    
        await act(async () => {
          fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        });
    
        expect(await screen.findByText(/Company Name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Company Email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Company Contact No. is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Address is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/GST Number is required/i)).toBeInTheDocument();
      });

  test("displays error message for invalid email format", async () => {
    render(
      <Router>
        <CompanyRegisterPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Company Email/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(
      await screen.findByText(/Enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test("displays error message for invalid contact number format", async () => {
    render(
      <Router>
        <CompanyRegisterPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Company Contact No./i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(
      await screen.findByText(/Enter a valid contact number/i)
    ).toBeInTheDocument();
  });
});
