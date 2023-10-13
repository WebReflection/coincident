require('@ungap/with-resolvers');
const { join } = require('node:path');
const { scripts } = require(join(__dirname, '..', 'package.json'));
const { test, expect } = require('@playwright/test');

// amount of ms to be sure the server is running
const WORKER_DELAY = 50;

const pages = new WeakMap;
const server = {
  ...Promise.withResolvers(),
  process: null
};

test.beforeAll(() => {
  const [command, ...args] = scripts.server.split(/\s+/);
  server.process = require('child_process').spawn(command, args, {
    cwd: join(__dirname, '..'),
  });
  server.process.stdout.on('data', server.resolve);
  // this is to ignore dangling server around
  // (tests will fail if not pointing at the right localhost)
  server.process.stderr.on('data', server.resolve);
});

test.afterAll(() => {
  server.process.kill();
});

test.beforeEach(async ({ page }) => {
  const {resolve, promise} = Promise.withResolvers();
  page.once('worker', worker => {
    // give the worker enough time to be parsed and do stuff
    setTimeout(resolve, WORKER_DELAY);
  });
  pages.set(page, promise);
  await server.promise;
  // no worker case (wait twice to be sure)
  setTimeout(resolve, WORKER_DELAY * 2);
});

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8080/test/integration/');
  await expect(page).toHaveTitle(/coincident/);
});

test('has worker working', async ({ page }) => {
  await page.goto('http://localhost:8080/test/integration/');
  await page.waitForSelector('html.ready');
  const result = await page.evaluate(() => document.body.textContent);
  await expect(result.trim()).toBe('Greetingstrue');
});

test('worker can set classes', async ({ page }) => {
  await page.goto('http://localhost:8080/test/integration/');
  await page.waitForSelector('html.ready');
});
