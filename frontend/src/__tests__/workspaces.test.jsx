import {
  it, beforeAll, beforeEach, afterAll, afterEach, expect,
} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceDropdown from '../components/WorkspaceDropdown.jsx';
import {MemoryRouter} from 'react-router-dom';
import {WorkspaceProvider} from '../context/WorkspaceContext.jsx';
import {AuthProvider} from '../context/AuthContext';
import {ChannelsProvider} from '../context/ChannelsContext.jsx';
import TopBar from '../components/TopBar';
import {server, setupMocks, newWorkspace} from './mocks';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  setupMocks();
});

it('has workspace menu', async () => {
  render(
      <MemoryRouter>
        <WorkspaceProvider>
          <WorkspaceDropdown />
        </WorkspaceProvider>
      </MemoryRouter>,
  );
  const workspaceButton = screen.getByLabelText('workspace menu');
  expect(workspaceButton).toBeInTheDocument();
});

it('has dropdown when clicked', async () => {
  render(
      <MemoryRouter>
        <WorkspaceProvider>
          <WorkspaceDropdown />
        </WorkspaceProvider>
      </MemoryRouter>,
  );
  const workspaceButton = screen.getByLabelText('workspace menu');
  fireEvent.click(workspaceButton);

  const createWSButton = screen.getByLabelText('create workspace');
  expect(createWSButton).toBeInTheDocument();
});

it('displays workspaces', async () => {
  render(
      <AuthProvider>
        <MemoryRouter>
          <WorkspaceProvider>
            <WorkspaceDropdown />
          </WorkspaceProvider>
        </MemoryRouter>
      </AuthProvider>,
  );

  const wsMenu = await screen.findByLabelText('workspace menu');
  fireEvent.click(wsMenu);

  const ws = await screen.findByLabelText('workspace Workspace1');
  expect(ws).toBeInTheDocument();
});

it('has popup when create is clicked', async () => {
  render(
      <MemoryRouter>
        <WorkspaceProvider>
          <WorkspaceDropdown />
        </WorkspaceProvider>
      </MemoryRouter>,
  );
  const workspaceButton = screen.getByLabelText('workspace menu');
  fireEvent.click(workspaceButton);

  const createWSButton = screen.getByLabelText('create workspace');
  fireEvent.click(createWSButton);

  const createWSHeader = screen.getByText('Create New Workspace');
  expect(createWSHeader).toBeInTheDocument();
});

it('cannot create without filled fields', async () => {
  render(
      <MemoryRouter>
        <WorkspaceProvider>
          <WorkspaceDropdown />
        </WorkspaceProvider>
      </MemoryRouter>,
  );
  const workspaceButton = screen.getByLabelText('workspace menu');
  fireEvent.click(workspaceButton);

  const createWSButton = screen.getByLabelText('create workspace');
  fireEvent.click(createWSButton);

  const createButton = screen.getByLabelText('Create');
  expect(createButton).toBeDisabled();
});

it('can cancel out of popup', async () => {
  render(
      <MemoryRouter>
        <WorkspaceProvider>
          <WorkspaceDropdown />
        </WorkspaceProvider>
      </MemoryRouter>,
  );
  const workspaceButton = screen.getByLabelText('workspace menu');
  fireEvent.click(workspaceButton);

  const createWSButton = screen.getByLabelText('create workspace');
  fireEvent.click(createWSButton);

  const createWSHeader = screen.getByText('Create New Workspace');

  const cancelButton = screen.getByLabelText('Cancel');
  fireEvent.click(cancelButton);

  await waitFor(() => {
    expect(createWSHeader).not.toBeInTheDocument();
  });
});

it('can add new workspace and update workspaces list', async () => {
  render(
      <AuthProvider>
        <MemoryRouter>
          <WorkspaceProvider>
            <ChannelsProvider>
              <TopBar />
            </ChannelsProvider>
          </WorkspaceProvider>
        </MemoryRouter>
      </AuthProvider>,
  );

  const wsMenu = await screen.findByLabelText('workspace menu');
  fireEvent.click(wsMenu);

  const createWSButton = await screen.findByLabelText('create workspace');
  fireEvent.click(createWSButton);

  const workspaceNameField = await screen.findByRole('textbox', {
    name: /name/i,
  });
  await userEvent.type(workspaceNameField, newWorkspace.data.name);

  const workspaceDescriptionField = await screen.findByRole('textbox', {
    name: /description/i,
  });
  await userEvent.type(
      workspaceDescriptionField,
      newWorkspace.data.description,
  );

  const createButton = await screen.findByText('Create');

  await waitFor(() => {
    fireEvent.click(createButton);
  });

  await waitFor(() => {
    expect(screen.getByText(newWorkspace.data.name)).toBeInTheDocument();
  });
  expect(screen.getByText(newWorkspace.data.name)).toBeInTheDocument();
});

it('selects chosen workspace', async () => {
  render(
      <AuthProvider>
        <MemoryRouter>
          <WorkspaceProvider>
            <ChannelsProvider>
              <TopBar />
            </ChannelsProvider>
          </WorkspaceProvider>
        </MemoryRouter>
      </AuthProvider>,
  );

  const wsMenu = await screen.findByLabelText('workspace menu');
  fireEvent.click(wsMenu);

  const ws = await screen.findByLabelText('workspace Workspace1');
  fireEvent.click(ws);

  await waitFor(() => {
    expect(screen.getByText('Workspace1')).toBeInTheDocument();
  });
  expect(screen.getByText('Workspace1')).toBeInTheDocument();
});
