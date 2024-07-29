import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../pages/Login/RegisterForm";
import axios from "axios";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("RegisterForm", () => {
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form inputs", () => {
    render(<RegisterForm onSuccess={onSuccess} />);

    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument(); 
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm Password/i)
    ).toBeInTheDocument();
  });

  test("displays validation errors", async () => {
    render(<RegisterForm onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(
      await screen.findByText(/First name is required/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter the password/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please confirm the password/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Please select your gender/i)).toBeInTheDocument();
  });
});
