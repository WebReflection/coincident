import coincident from '../../dist/shared-worker.js';

// define all port proxies exports
const proxies = coincident({
  proxy: {
    valueBack: () => Math.random(),
  }
});

// if needed to invoke some port main utility ...
addEventListener('connect', async ({ ports }) => {
  for (const port of ports) {
    const proxy = await proxies.get(port);
    // optionally define exported methods in here too
    proxy.other = () => 'hello shared worker';
    console.log(await proxy.greetings());
  }
});
