import express from 'express';
import {login} from './routes/auth.js';
import {getWorkspaces, createWorkspace} from './routes/workspaces.js';
import {getChannels, createChannel} from './routes/channels.js';
import {getMessages, createMessage, deleteMessage} from './routes/messages.js';
import {getUserByEmail} from './routes/users.js';
import {authenticate} from './authMiddleware.js';

const router = new express.Router();

router.get('/users/email/:email', getUserByEmail);

router.post('/login', login);

router.get('/workspaces', authenticate, getWorkspaces);
router.post('/workspaces', authenticate, createWorkspace);

router.get('/workspaces/:workspaceId/channels', authenticate, getChannels);
router.post('/workspaces/:workspaceId/channels', authenticate, createChannel);

router.get(
    '/channels/:channelId/messages',
    authenticate,
    getMessages,
);

router.post(
    '/channels/:channelId/messages',
    authenticate,
    createMessage,
);

router.delete(
    '/messages/:messageId',
    authenticate,
    deleteMessage,
);

export default router;
