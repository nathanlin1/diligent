import {
  it,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  expect,
  vi,
  describe} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext';
import {WorkspaceProvider} from '../context/WorkspaceContext.jsx';
import {ChannelsProvider} from '../context/ChannelsContext.jsx';
import BottomNav from '../components/BottomNav.jsx';
import SideNav from '../components/SideNav.jsx';
import {server, setupMocks} from './mocks';
import {useMediaQuery} from '@mui/material';

const mockNavigate = vi.fn();

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
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      logout: vi.fn(),
    }),
  };
});

beforeEach(() => {
  setupMocks();
  vi.mocked(useMediaQuery).mockReturnValue(true);
  window.innerWidth = 375;
  window.innerHeight = 667;
  window.dispatchEvent(new Event('resize'));
  mockNavigate.mockClear();
});

describe('SideNav', () => {
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

  it('renders with desktop ui', () => {
    useMediaQuery.mockImplementation(() => false);

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
    expect(drawer).toHaveStyle('width: 240px');
  });
});

describe('BottomNav', () => {
  it('navigates to home when the home button is clicked', () => {
    render(
        <MemoryRouter>
          <AuthProvider>
            <WorkspaceProvider>
              <ChannelsProvider>
                <BottomNav />
              </ChannelsProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </MemoryRouter>,
    );

    const homeButton = screen.getByText('Home');
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
