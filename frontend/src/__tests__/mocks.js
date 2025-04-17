import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
// import { useMediaQuery } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3010/api/v0';

export const server = setupServer();

export const mockWorkspaces = [
  {
    id: '1',
    owner_id: 'owner-1',
    name: 'Workspace1',
    description: 'string',
    channels: [
      {
        id: '10',
        data: {name: 'Channel1', description: 'string'},
        messages: [
          {
            id: '100',
            owner_name: 'Test User',
            content: 'Test',
            timestamp: '2024-03-14T12:00:00Z',
            data: {
              owner_name: 'Test User',
              timestamp: '2024-03-14T12:00:00Z',
              content: 'Test'},
          },
        ],
      },
    ],
  },
  {
    id: '2',
    owner_id: 'owner-2',
    name: 'Workspace2',
    description: 'string',
  },
];

export const newWorkspace = {
  id: '3',
  data: {name: 'Workspace3', description: 'string'},
  channels: [],
};

export const newChannel = {
  id: '11',
  name: 'Channel2',
  description: 'string',
  data: {name: 'Channel2', description: 'string'},
};

export const newMessage = {
  id: '101',
  owner_name: 'Test User',
  user_id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  content: 'Test Message',
  timestamp: '2024-03-14T12:00:00Z',
  data: {
    owner_name: 'Test User',
    timestamp: '2024-03-14T12:00:00Z',
    content: 'Test Message'},
};

export const mockId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const setupMocks = () => {
  server.use(
      http.post('http://localhost:3010/api/v0/login', async ({request}) => {
        const {email, password} = await request.json();

        if (email === 'test@example.com' && password === 'password') {
          return HttpResponse.json({token: 'mock-token'});
        } else {
          return HttpResponse.json(
              {error: 'Invalid credentials'},
              {status: 401},
          );
        }
      },
      ),
      http.get(`${API_URL}/workspaces`, async () =>
        HttpResponse.json(mockWorkspaces),
      ),
      http.get(`${API_URL}/users/email/test@example.com`, async () =>
        HttpResponse.json(mockId),
      ),
      http.post(`${API_URL}/workspaces`, async () =>
        HttpResponse.json(newWorkspace),
      ),
      http.get(`${API_URL}/workspaces/1/channels`, async () =>
        HttpResponse.json(mockWorkspaces[0].channels),
      ),
      http.post(`${API_URL}/workspaces/1/channels`, async () => {
        mockWorkspaces[0].channels.push(newChannel);
        HttpResponse.json(newChannel);
      }),
      http.get(`${API_URL}/channels/10/messages`, async () =>
        HttpResponse.json(mockWorkspaces[0].channels[0].messages),
      ),
      http.post(`${API_URL}/channels/10/messages`, async () => {
        mockWorkspaces[0].channels[0].messages.push(newMessage);
        HttpResponse.json(newMessage);
      }),
      // http.delete(`${API_URL}/messages/101`, async () => {
      //   const messageId = '101'
      //   const workspace = mockWorkspaces[0];
      //   const channel = workspace.channels[0];
      // const messageIndex = channel
      //   .messages.findIndex((msg) => msg.id === '101');

      //   if (messageIndex !== -1) {
      //     channel.messages.splice(messageIndex, 1);
      //     return HttpResponse.json({ success: true });
      //   }
      // }),
  );
};

// vi.mock('@mui/material', async (importOriginal) => {
//   const mod = await importOriginal();
//   return {
//     ...mod,
//     useMediaQuery: vi.fn(() => true),
//   };
// });

// vi.mock('react-router-dom', async (importOriginal) => {
//   const mod = await importOriginal();
//   return {
//     ...mod,
//     useNavigate: vi.fn(),
//   };
// });
