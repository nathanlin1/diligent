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

it('can get workspaces and 200', async () => {
  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const workspacesRes = await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`);

  expect(workspacesRes.status).toBe(200);
  expect(Array.isArray(workspacesRes.body)).toBe(true);
});

it('401 when missing token for get', async () => {
  await request.post('/api/v0/login')
      .send(credentials);

  await request.get('/api/v0/workspaces')
      .expect(401);
});

it('can create workspace and 201', async () => {
  const newWorkspace = {
    'name': 'test workspace',
    'description': 'string',
  };

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const workspacesRes = await request
      .post('/api/v0/workspaces')
      .send(newWorkspace)
      .set('Authorization', `Bearer ${token}`);

  expect(workspacesRes.status).toBe(201);
});

it('can create workspace with correct values', async () => {
  const annaId = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

  const newWorkspace = {
    'name': 'test workspace',
    'description': 'string',
  };

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const workspacesRes = await request
      .post('/api/v0/workspaces')
      .send(newWorkspace)
      .set('Authorization', `Bearer ${token}`);

  expect(workspacesRes.body)
      .toHaveProperty('id');
  expect(workspacesRes.body.owner_id)
      .toBe(annaId);
  expect(workspacesRes.body.data.name)
      .toBe(newWorkspace.name);
  expect(workspacesRes.body.data.description)
      .toBe(newWorkspace.description);
});

it('puts member in correct workspace', async () => {
  const newWorkspace = {
    'name': 'member test',
    'description': 'string',
  };

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  await request
      .post('/api/v0/workspaces')
      .send(newWorkspace)
      .set('Authorization', `Bearer ${token}`);

  const workspacesRes = await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`);

  const workspaceNames = workspacesRes.body
      .map((workspace) => workspace.name);
  expect(workspaceNames).toContain(newWorkspace.name);
});

it('status 400 for post with no values', async () => {
  const newWorkspace = {};

  const res = await request
      .post('/api/v0/login')
      .send(credentials);

  const token = res.body.token;

  const workspacesRes = await request
      .post('/api/v0/workspaces')
      .send(newWorkspace)
      .set('Authorization', `Bearer ${token}`);

  expect(workspacesRes.status).toBe(400);
});

it('status 401 for post with no token', async () => {
  const newWorkspace = {};

  await request
      .post('/api/v0/login')
      .send(credentials);

  const workspacesRes = await request
      .post('/api/v0/workspaces')
      .send(newWorkspace);

  expect(workspacesRes.status).toBe(401);
});
