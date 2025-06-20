import BROADCAST_CHANNEL_UID from './bid.js';

import nextResolver from 'next-resolver';

const { parse } = JSON;

const [next, resolve] = nextResolver();

const url = `${location.href}?sabayon`;
const bc = new BroadcastChannel(BROADCAST_CHANNEL_UID);
bc.onmessage = event => resolve.apply(null, event.data);

addEventListener('activate', e => e.waitUntil(clients.claim()));
addEventListener('install', () => skipWaiting());
addEventListener('fetch', async event => {
  const { request: r } = event;
  if (r.method === 'POST' && r.url === url) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const [swid, promise] = next();
    event.respondWith(
      new Promise(async resolve => {
        const [wid, vid] = parse(await r.text());
        bc.postMessage([swid, wid, vid]);
        resolve(promise);
      })
      .then(value => new Response(`[${value.join(',')}]`))
    );
  }
});
