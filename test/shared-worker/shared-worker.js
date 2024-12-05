import coincident from '../../dist/shared-worker.js';

const proxies = coincident();

addEventListener('connect', async ({ ports }) => {
  for (const port of ports) {
    const proxy = await proxies.get(port);
    proxy.valueBack = () => Math.random();
    console.log(await proxy.greetings());
  }
});
