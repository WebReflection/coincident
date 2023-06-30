require('@ungap/with-resolvers');
const { join } = require('node:path');
const { scripts } = require(join(__dirname, '..', 'package.json'));
const { test, expect } = require('@playwright/test');

// amount of ms to be sure the server is running
const BOOT_DELAY = 500;

const pages = new WeakMap;
const server = {
  ...Promise.withResolvers(),
  process: null
};

test.beforeAll(() => {
  server.process = require('child_process').exec(scripts.server);
});

test.afterAll(() => {
  server.process.kill();
});

test.beforeEach(async ({ page }) => {
  const {resolve, promise} = Promise.withResolvers();
  page.once('worker', worker => {
    // don't wait for explicitly closed workers
    worker.once('close', resolve);
    // give the worker enough time to be parsed and do stuff
    setTimeout(resolve, BOOT_DELAY / 4);
  });
  pages.set(page, promise);
  await server.promise;
  // no worker case
  setTimeout(resolve, BOOT_DELAY / 2);
});

setTimeout(server.resolve, BOOT_DELAY);


test('has title', async ({ page }) => {
  await page.goto('http://localhost:8080/test/integration/');
  await expect(page).toHaveTitle(/coincident/);
});

test('has worker working', async ({ page }) => {
  await page.goto('http://localhost:8080/test/integration/');
  await pages.get(page);
  const result = await page.evaluate(() => document.body.textContent);
  await expect(result.trim()).toBe('Greetingstrue');
});

test('worker can set classes', async ({ page }) => {
  await page.goto('http://localhost:8080/test/integration/');
  await page.waitForSelector('html.ready');
});
