import {
  it, beforeAll, beforeEach, afterAll, afterEach, expect, vi,
} from 'vitest';
import {
  render, screen, fireEvent, waitFor, within,
} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {WorkspaceProvider} from '../context/WorkspaceContext.jsx';
import {AuthProvider} from '../context/AuthContext';
import {ChannelsProvider} from '../context/ChannelsContext.jsx';
import {server, setupMocks, newChannel} from './mocks';
import {useMediaQuery} from '@mui/material';
import Home from '../routes/Home.jsx';
import WorkspaceDropdown from '../components/WorkspaceDropdown.jsx';
import TopBar from '../components/TopBar';
import Channels from '../components/Channels.jsx';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  setupMocks();
  vi.fn(useMediaQuery).mockReturnValue(true);
  window.innerWidth = 375;
  window.innerHeight = 667;
  window.dispatchEvent(new Event('resize'));
});

it('shows channels', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <Home />
            </ChannelsProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </MemoryRouter>,
  );

  const wsMenu = screen.getByLabelText('workspace menu');
  fireEvent.click(wsMenu);

  const ws = await screen.findByLabelText('workspace Workspace1');
  fireEvent.click(ws);

  const channel = screen.getByText('Channel1');
  expect(channel).toBeInTheDocument();
});

it('can click channel', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <TopBar />
              <Channels />
            </ChannelsProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </MemoryRouter>,
  );

  const wsMenu = screen.getByLabelText('workspace menu');
  fireEvent.click(wsMenu);

  const ws = await screen.findByLabelText('workspace Workspace1');
  fireEvent.click(ws);

  const channel = screen.getByLabelText('channel Channel1');
  fireEvent.click(channel);

  const topBar = screen.getByLabelText('topbar');
  const header = within(topBar).getByText('Channel1');
  expect(header).toBeInTheDocument();
});

it('can create channel and update list', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <WorkspaceDropdown />
              <Channels />
            </ChannelsProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </MemoryRouter>,
  );

  const wsMenu = screen.getByLabelText('workspace menu');
  fireEvent.click(wsMenu);

  const ws = await screen.findByLabelText('workspace Workspace1');
  fireEvent.click(ws);

  const createCh = screen.getByLabelText('Create Channel');
  fireEvent.click(createCh);

  const chNameField = await screen.findByRole('textbox', {name: /name/i});
  await userEvent.type(chNameField, newChannel.data.name);

  const chDescriptionField = await screen.findByRole('textbox', {
    name: /description/i,
  });
  await userEvent.type(chDescriptionField, newChannel.data.description);

  const create = screen.getByLabelText('Create');

  await waitFor(() => {
    fireEvent.click(create);
  });

  await waitFor(() => {
    expect(screen.getByText(newChannel.data.name)).toBeInTheDocument();
  });
  expect(screen.getByText(newChannel.data.name)).toBeInTheDocument();
});
