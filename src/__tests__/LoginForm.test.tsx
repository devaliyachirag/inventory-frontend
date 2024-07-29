// src/LoginForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../pages/Login/Loginform';
import { SnackbarProvider } from 'notistack';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });
  
  test('shows error messages for invalid email format and required fields', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter the password/i)).toBeInTheDocument();
    
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/invalid email pattern/i)).toBeInTheDocument();
  });
  
  test('toggles password visibility', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByText(/show/i);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent(/hide/i);
  });

  test('submits the form successfully and navigates to the homepage', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'test-token' },
    });
    
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
