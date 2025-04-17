import {
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
  beforeEach,
  vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {AuthProvider} from '../context/AuthContext';
import Login from '../routes/Login.jsx';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import {server, setupMocks} from './mocks';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  setupMocks();
});

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: vi.fn(),
  };
});

it('has login fields', () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
  );

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');
  const loginButton = screen.getByLabelText('Submit Button');

  expect(emailField).toBeInTheDocument();
  expect(passwordField).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

it('allows the user to enter email and password', () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
  );

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');

  fireEvent.change(emailField, {target: {value: 'test@example.com'}});
  fireEvent.change(passwordField, {target: {value: 'password'}});

  expect(emailField.value).toBe('test@example.com');
  expect(passwordField.value).toBe('password');
});

it('can login', async () => {
  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
  );

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');
  const loginButton = screen.getByLabelText('Submit Button');

  fireEvent.change(emailField, {target: {value: 'test@example.com'}});
  fireEvent.change(passwordField, {target: {value: 'password'}});
  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

it('shows as * for pw', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
  );
  const pw = screen.getByLabelText('Password');

  fireEvent.change(pw, {target: {value: 'password'}});

  expect(pw.value).toBe('password');
  expect(pw).toHaveAttribute('type', 'password');
});

it('cant login with invalid credentials', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
  );

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');
  const loginButton = screen.getByLabelText('Submit Button');

  fireEvent.change(emailField, {target: {value: 'test@example.com'}});
  fireEvent.change(passwordField, {target: {value: 'test'}});
  fireEvent.click(loginButton);

  await waitFor(() => {
    const error = screen.getByText('Invalid login. Please try again.');
    expect(error).toBeInTheDocument();
  });
});

it('can log out', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <BottomNav />
        </AuthProvider>
      </MemoryRouter>,
  );

  const logout = screen.getByText('Logout');
  fireEvent.click(logout);

  expect(localStorage.getItem('token')).toBeNull();
});
