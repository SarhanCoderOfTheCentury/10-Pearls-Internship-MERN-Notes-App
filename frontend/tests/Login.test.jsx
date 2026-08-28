/**
 * Login.test.jsx
 *
 * Tests for LoginPage.jsx
 *
 * Mocking strategy:
 *   - vi.mock('../src/hooks/useAuth') → replaces the hook used inside LoginPage
 *   - MemoryRouter wraps every render (useNavigate / useLocation requirement)
 *   - ToastProvider wraps every render (useToast requirement)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import LoginPage from '../src/pages/LoginPage';
import { ToastProvider } from '../src/context/ToastContext';

// ─── Mock useAuth ─────────────────────────────────────────────────────────────
const mockLoginUser = vi.fn().mockResolvedValue(true);

vi.mock('../src/hooks/useAuth', () => ({
  default: () => ({
    user: null,
    loading: false,
    loginUser: mockLoginUser,
    registerUser: vi.fn(),
    logoutUser: vi.fn(),
    isAuthenticated: false,
  }),
}));

// ─── Render helper ───────────────────────────────────────────────────────────
function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <ToastProvider>
        <LoginPage />
      </ToastProvider>
    </MemoryRouter>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginUser.mockResolvedValue(true);
  });

  test('renders the email input, password input, and sign-in button', () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('allows user to type into email and password fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••/);

    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    await user.type(passwordInput, '12345678');
    expect(passwordInput).toHaveValue('12345678');
  });

  test('shows "Email is required" error when form is submitted with no email', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // react-hook-form required message from LoginPage: "Email is required"
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  test('shows "Password is required" error when only email is entered', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('shows "Enter a valid email" error for malformed email', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'not-an-email');
    await user.type(screen.getByPlaceholderText(/••••/), '12345678');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  test('shows "Password must be atleast 8 characters" for short password', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/••••/), 'abc');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  test('calls loginUser with correct credentials on valid submit', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/••••/), '12345678');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '12345678',
      });
    });
  });

  test('disables the submit button and shows "Signing in…" while request is in flight', async () => {
    // loginUser never resolves → button stays in loading state
    mockLoginUser.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/••••/), '12345678');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/signing in/i)).toBeInTheDocument();
  });
});