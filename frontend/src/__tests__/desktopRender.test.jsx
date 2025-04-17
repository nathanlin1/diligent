import {
  it, beforeAll, beforeEach, afterAll, afterEach, expect, vi,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import {server, setupMocks} from './mocks';
import {useMediaQuery} from '@mui/material';
import SideNav from '../components/SideNav.jsx';
import {WorkspaceProvider} from '../context/WorkspaceContext.jsx';
import {AuthProvider} from '../context/AuthContext';
import {ChannelsProvider} from '../context/ChannelsContext.jsx';
import {MemoryRouter} from 'react-router-dom';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('@mui/material', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useMediaQuery: vi.fn(() => true),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: vi.fn(),
  };
});

beforeEach(() => {
  setupMocks();
  vi.mocked(useMediaQuery).mockReturnValue(true);
  window.innerWidth = 375;
  window.innerHeight = 667;
  window.dispatchEvent(new Event('resize'));
});

it('renders with mobile ui', () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <SideNav />
            </ChannelsProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </MemoryRouter>,
  );

  const drawer = screen.getByLabelText('side navigation');
  expect(drawer).toBeInTheDocument();
  expect(drawer).toHaveStyle('width: 100%');
});
