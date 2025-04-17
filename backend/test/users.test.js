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

const email = 'anna@books.com';
const annaId = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

it('200 status', async () => {
  const res = await request
      .get(`/api/v0/users/email/${email}`);

  expect(res.status).toBe(200);
});

it('can get id', async () => {
  const res = await request
      .get(`/api/v0/users/email/${email}`);

  expect(res.body.id).toBe(annaId);
});

it('404 with bad email', async () => {
  const res = await request
      .get(`/api/v0/users/email/123`);

  expect(res.status).toBe(400);
});
