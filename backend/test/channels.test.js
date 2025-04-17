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

const workspaceId = '550e8400-e29b-41d4-a716-446655440002';

const credentials = {
  'email': 'anna@books.com',
  'password': 'annaadmin',
};

it('can get channels and 200', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const channelsRes = await request
      .get(`/api/v0/workspaces/${workspaceId}/channels`)
      .set('Authorization', `Bearer ${token}`);

  expect(channelsRes.status).toBe(200);
  expect(Array.isArray(channelsRes.body)).toBe(true);
});

it('401 when missing token for get', async () => {
  await request.post('/api/v0/login')
      .send(credentials);

  await request.get(`/api/v0/workspaces/${workspaceId}/channels`)
      .expect(401);
});

it('can create channel and 201', async () => {
  const newChannel = {
    'name': 'test channel',
    'description': 'string',
  };

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const channelRes = await request
      .post(`/api/v0/workspaces/${workspaceId}/channels`)
      .send(newChannel)
      .set('Authorization', `Bearer ${token}`);

  expect(channelRes.status).toBe(201);
});

it('can create channel with correct values', async () => {
  const newChannel = {
    'name': 'test workspace',
    'description': 'string',
  };

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const channelRes = await request
      .post(`/api/v0/workspaces/${workspaceId}/channels`)
      .send(newChannel)
      .set('Authorization', `Bearer ${token}`);

  expect(channelRes.body)
      .toHaveProperty('id');
  expect(channelRes.body.workspace_id)
      .toBe(workspaceId);
  expect(channelRes.body.data.name)
      .toBe(newChannel.name);
  expect(channelRes.body.data.description)
      .toBe(newChannel.description);
});

it('status 400 for post with no values', async () => {
  const newChannel = {};

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const channelRes = await request
      .post(`/api/v0/workspaces/${workspaceId}/channels`)
      .send(newChannel)
      .set('Authorization', `Bearer ${token}`);

  expect(channelRes.status).toBe(400);
});

it('status 401 for post with no token', async () => {
  const newChannel = {
    'name': 'test workspace',
    'description': 'string',
  };

  await request
      .post('/api/v0/login')
      .send(credentials);

  const res = await request
      .post(`/api/v0/workspaces/${workspaceId}/channels`)
      .send(newChannel);

  expect(res.status).toBe(401);
});
