import { test, beforeAll, afterAll, beforeEach, afterEach, expect} from 'vitest';
import puppeteer from 'puppeteer';
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

  await page.goto('http://localhost:3000');

  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', 'anna@books.com');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'annaadmin');

  await page.waitForSelector('button[aria-label="Submit Button"]', { visible: true });
  await page.click('button[aria-label="Submit Button"]');

  await page.waitForSelector('button[aria-label="workspace menu"]', { visible: true });
  await page.click('button[aria-label="workspace menu"]');
});

afterEach(async () => {
  const childProcess = browser.process();
  if (childProcess) {
    await childProcess.kill(9);
  }
});

test('does not show workspaces user not in', async () => {
    const wsText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.MuiMenuItem-root'))
        .map(item => item.innerText.trim())
        .includes('Not Workspace');
    });

    expect(wsText).toBe(false);
});

test('shows workspaces user in', async () => {
    const ws1 = await page.waitForSelector(
        '::-p-text(WS 1)');
    expect(ws1).not.toBeNull();
    ws1.dispose();

    const ws2 = await page.waitForSelector(
        '::-p-text(WS 2)');
    expect(ws2).not.toBeNull();
    ws2.dispose();
  });

const click = async (selector) => {
    const clickable = await page.waitForSelector(selector);
    await clickable.click();
    clickable.dispose();
};

test('create new workspace', async () => {
    await click('::-p-text(Create Workspace)');

    await page.waitForSelector(
        '::-p-text(Name)');
    await page.type(
        '::-p-text(Name)', 'New Workspace');

    await page.waitForSelector(
        '::-p-text(Description)');
    await page.type(
        '::-p-text(Description)', 'test');
    
    await page.waitForSelector(
        'button[aria-label="Create"]');
    await page.click(
        'button[aria-label="Create"]');

    const ws = await page.waitForSelector(
        '::-p-text(New Workspace)');
    expect(ws).not.toBeNull();
    ws.dispose();
});

test('can click workspace', async () => {
  await click('::-p-text(WS 1)');

  const ws = await page.waitForSelector(
      '::-p-text(WS 1 Channel)');
  expect(ws).not.toBeNull();
  ws.dispose();
});