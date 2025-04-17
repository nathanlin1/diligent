import {it, expect, vi, describe} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext';
import ProtectedRoute from '../routes/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('renders children when there is a user', async () => {
    vi.mock('../context/AuthContext', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useAuth: () => ({
          user: {id: '123', name: 'John Doe'},
        }),
      };
    });

    render(
        <MemoryRouter initialEntries={['/protected']}>
          <AuthProvider>
            <Routes>
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <div>Protected Content</div>
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
