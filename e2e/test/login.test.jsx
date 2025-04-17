import { test, beforeAll, afterAll, beforeEach, afterEach, expect} from 'vitest';
import puppeteer, { KnownDevices } from 'puppeteer';
import path from 'path';
import express from 'express';
import http from 'http';

import 'dotenv/config';
import app from '../../backend/src/app.js';

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/assets', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'dist', 'assets')))
      .get('*', function (req, res) {
        res.sendFile('index.html',
          { root: path.join(__dirname, '..', '..', 'frontend', 'dist') });
      }),
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll(async () => {
  await backend.close();
  await frontend.close();
  setImmediate(function () {
    frontend.emit('close');
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
  const iPhone = KnownDevices['iPhone SE'];
  await page.emulate(iPhone);

  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  const childProcess = browser.process();
  if (childProcess) {
    await childProcess.kill(9);
  }
});

test('login with good credentials', async () => {
  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', 'anna@books.com');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'annaadmin');

  await page.waitForSelector('button[aria-label="Submit Button"]', { visible: true });
  await page.click('button[aria-label="Submit Button"]');

  await page.waitForNavigation();

  const currUrl = await page.url();
  expect(currUrl).toBe('http://localhost:3000/');
});

test('login with bad credentials', async () => {
  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', 'anna@books.com');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'test');

  await page.waitForSelector('button[aria-label="Submit Button"]', { visible: true });
  await page.click('button[aria-label="Submit Button"]');

  const currUrl = await page.url();
  expect(currUrl).toBe('http://localhost:3000/login');
});

test('can logout', async () => {
  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', 'anna@books.com');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'annaadmin');

  await page.waitForSelector('button[aria-label="Submit Button"]', { visible: true });
  await page.click('button[aria-label="Submit Button"]');
  
  await page.waitForSelector('button[aria-label="Logout"]', { visible: true });
  await page.click('button[aria-label="Logout"]');

  const header = await page.waitForSelector(
    '::-p-text(Login)');
  expect(header).not.toBeNull();
  header.dispose();
},);