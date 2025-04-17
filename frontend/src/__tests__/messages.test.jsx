import {
  it, beforeAll, beforeEach, afterAll, afterEach, expect, vi,
} from 'vitest';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {WorkspaceProvider} from '../context/WorkspaceContext.jsx';
import {AuthProvider} from '../context/AuthContext';
import {ChannelsProvider} from '../context/ChannelsContext.jsx';
import {server, setupMocks, newMessage} from './mocks';
import {useMediaQuery} from '@mui/material';
import {MessagesProvider} from '../context/MessagesContext.jsx';
import Channel from '../routes/Channel.jsx';

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

it('shows messages', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <MessagesProvider>
                <Channel />
              </MessagesProvider>
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
  fireEvent.click(channel);

  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  expect(screen.getByText('Test')).toBeInTheDocument();
});

it('can send message', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <MessagesProvider>
                <Channel />
              </MessagesProvider>
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
  fireEvent.click(channel);

  const textField = await screen.findByRole('textbox', {
    name: /message input/i,
  });
  await userEvent.type(textField, newMessage.data.content);

  const sendButton = screen.getByLabelText('send button');
  fireEvent.click(sendButton);

  await waitFor(() => {
    expect(screen.getByText(newMessage.data.content)).toBeInTheDocument();
  });
  expect(screen.getByText(newMessage.data.content)).toBeInTheDocument();
});

vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      userId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      logout: vi.fn(),
    }),
  };
});

it('can delete', async () => {
  render(
      <MemoryRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <ChannelsProvider>
              <MessagesProvider>
                <Channel />
              </MessagesProvider>
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
  fireEvent.click(channel);

  const textField = await screen.findByRole('textbox', {
    name: /message input/i,
  });
  await userEvent.type(textField, newMessage.data.content);

  const sendButton = screen.getByLabelText('send button');
  fireEvent.click(sendButton);

  const deleteButton = screen.getAllByLabelText('delete message')[0];
  fireEvent.click(deleteButton);
});
