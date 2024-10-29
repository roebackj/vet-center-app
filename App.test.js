// src/App.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders login form', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  
  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const submitButton = screen.getByText(/submit/i);

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('redirects to login if not authenticated', () => {
  render(
    <MemoryRouter initialEntries={['/secure']}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const loginHeader = screen.getByText(/login/i); // Check if login header is present
  expect(loginHeader).toBeInTheDocument();
});

