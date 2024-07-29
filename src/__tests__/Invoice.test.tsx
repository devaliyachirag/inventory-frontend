import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InvoiceFormPage from "../pages/Invoice/InvoiceForm"; 
import useAuthApi from "../components/useApi";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../components/useApi");
const mockedUseAuthApi = useAuthApi as jest.MockedFunction<typeof useAuthApi>;

jest.mock("../components/DatePickerComponent", () => ({
  __esModule: true,
  // default: ({ label, selected, onChange, error, helperText }: any) => (
  //   <div>
  //     <label>{label}</label>
  //     <input
  //       type="date"
  //       value={selected ? selected.toISOString().substr(0, 10) : ""}
  //       onChange={(e) =>
  //         onChange(e.target.value ? new Date(e.target.value) : null)
  //       }
  //       data-testid={label}
  //     />
  //     {error && <span>{helperText}</span>}
  //   </div>
  // ),
}));

describe("InvoiceFormPage", () => {
  const mockApi = jest.fn();

  beforeEach(() => {
    mockedUseAuthApi.mockReturnValue(mockApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders form inputs", async () => {
    render(
      <Router>
        <InvoiceFormPage />
      </Router>
    );

    expect(screen.getByLabelText(/Invoice Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
  });

  test("displays validation errors", async () => {
    render(
      <Router>
        <InvoiceFormPage />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
   
    expect(
      await screen.findByText(/Invoice Date is required/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Invoice Due Date is required/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Invoice Number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Client is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Item Name is required/i)).toBeInTheDocument();    
  });

  test("submits form successfully", async () => {
    mockApi.mockResolvedValueOnce({});

    render(
      <Router>
        <InvoiceFormPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Invoice Number/i), {
      target: { value: "INV-001" },
    });
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: "Test Item" },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => expect(mockApi).toHaveBeenCalledTimes(1));
  });

});
