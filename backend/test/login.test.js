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

import {it, beforeAll, afterAll} from 'vitest';
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

it('200 with good credentials', async () => {
  const credentials = {
    'email': 'anna@books.com',
    'password': 'annaadmin',
  };

  await request.post(`/api/v0/login`).send(credentials)
      .expect(200);
});

it('401 with bad email', async () => {
  const credentials = {
    'email': 'anna@test.com',
    'password': 'annaadmin',
  };

  await request.post(`/api/v0/login`).send(credentials)
      .expect(401);
});

it('401 with bad pw', async () => {
  const credentials = {
    'email': 'anna@books.com',
    'password': 'test',
  };

  await request.post(`/api/v0/login`).send(credentials)
      .expect(401);
});

it('400 with no credentials', async () => {
  const credentials = {
    'email': '',
    'password': '',
  };

  await request.post(`/api/v0/login`).send(credentials)
      .expect(400);
});
