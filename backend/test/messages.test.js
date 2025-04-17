/*
#######################################################################
#
# Copyright (C) 2020-2025 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {expect, it, beforeAll, afterAll} from 'vitest';
import supertest from 'supertest';
import http from 'http';

import * as db from './db.js';
import app from '../src/app.js';

let server;
let request;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll(async () => {
  db.close();
  await server.close();
});

const credentials = {
  'email': 'anna@books.com',
  'password': 'annaadmin',
};

const newMessage = {
  'content': 'string',
};

// General channel of "Anna Test" workspace
const channelId = '550e8400-e29b-41d4-a716-446655440004';

it('can get messages and 200', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const messagesRes = await request
      .get(`/api/v0/channels/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`);

  expect(messagesRes.status).toBe(200);
  expect(Array.isArray(messagesRes.body)).toBe(true);
});

it('401 when missing token for get', async () => {
  await request.post('/api/v0/login')
      .send(credentials);

  await request.get(`/api/v0/channels/${channelId}/messages`)
      .expect(401);
});

it('401 when bad channel for get', async () => {
  await request.post('/api/v0/login')
      .send(credentials);

  await request.get(`/api/v0/channels/123/messages`)
      .expect(401);
});

it('can create message and 201', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const messagesRes = await request
      .post(`/api/v0/channels/${channelId}/messages`)
      .send(newMessage)
      .set('Authorization', `Bearer ${token}`);

  expect(messagesRes.status).toBe(201);
});

it('can create message with correct values', async () => {
  const annaId = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const messagesRes = await request
      .post(`/api/v0/channels/${channelId}/messages`)
      .send(newMessage)
      .set('Authorization', `Bearer ${token}`);

  expect(messagesRes.body)
      .toHaveProperty('id');
  expect(messagesRes.body.user_id)
      .toBe(annaId);
  expect(messagesRes.body.channel_id)
      .toBe(channelId);
  expect(messagesRes.body.data.content)
      .toBe(newMessage.content);
});

it('status 400 for post with no values', async () => {
  const badMessage = {};

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const messagesRes = await request
      .post(`/api/v0/channels/${channelId}/messages`)
      .send(badMessage)
      .set('Authorization', `Bearer ${token}`);

  expect(messagesRes.status).toBe(400);
});

it('status 401 for post with no token', async () => {
  await request
      .post('/api/v0/login')
      .send(credentials);

  const messagesRes = await request
      .post(`/api/v0/channels/${channelId}/messages`)
      .send(newMessage);

  expect(messagesRes.status).toBe(401);
});

it('status 400 for post with bad channel', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const messagesRes = await request
      .post(`/api/v0/channels/123/messages`)
      .send(newMessage)
      .set('Authorization', `Bearer ${token}`);

  expect(messagesRes.status).toBe(400);
});

it('can delete message and 204', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const createdMessage = await request
      .post(`/api/v0/channels/${channelId}/messages/`)
      .send(newMessage)
      .set('Authorization', `Bearer ${token}`);

  const createdId = createdMessage.body.id;

  const messageRes = await request
      .delete(`/api/v0/messages/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

  expect(messageRes.status).toBe(204);

  const messages = await request
      .get(`/api/v0/channels/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`);

  const messageIds = messages.body
      .map((message) => message.id);
  expect(messageIds).not.toContain(createdId);
});

it('400 with bad message id for delete', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const messageRes = await request
      .delete(`/api/v0/messages/123`)
      .set('Authorization', `Bearer ${token}`);

  expect(messageRes.status).toBe(400);
});
