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

  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', 'anna@books.com');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'annaadmin');

  await page.waitForSelector('button[aria-label="Submit Button"]', { visible: true });
  await page.click('button[aria-label="Submit Button"]');

  await page.waitForNavigation()

  const generalChannel = await page.waitForSelector('::-p-text(General)',
    {visible: true});
  await generalChannel.click();
});

afterEach(async () => {
  const childProcess = browser.process();
  if (childProcess) {
    await childProcess.kill(9);
  }
});

test('can send a message', async () => {
    await page.waitForSelector('input[type="messagebox"]', { visible: true });
    await page.type('input[type="messagebox"]', 'test msg');

    const sendButton = await page.waitForSelector('::-p-text(Send)',
        {visible: true});
      await sendButton.click();

    const newMessage = await page.waitForSelector('::-p-text(test msg)',
    {visible: true});
    expect(newMessage).not.toBeNull();
});

test('can delete a message', async () => {
    await page.waitForSelector('input[type="messagebox"]', { visible: true });
    await page.type('input[type="messagebox"]', 'test msg');

    const sendButton = await page.waitForSelector('::-p-text(Send)',
        {visible: true});
      await sendButton.click();

    const newMessage = await page.waitForSelector('::-p-text(test msg)',
    {visible: true});
    await newMessage.hover()

    const delMessage = await page.waitForSelector('button[aria-label="delete message"]',
        {visible: true});
    await delMessage.click()

    const isMessageDeleted = await page.evaluate(() => {
        const message = Array.from(document.querySelectorAll('*')).find((el) => el.textContent === 'test msg');
        return !message; 
      });
    
      expect(isMessageDeleted).toBe(true);
});