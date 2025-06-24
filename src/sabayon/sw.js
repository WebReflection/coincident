import BROADCAST_CHANNEL_UID from './bid.js';

import nextResolver from 'next-resolver';

const [next, resolve] = nextResolver();
const { stringify } = JSON;

const ok = value => new Response(`[${value.join(',')}]`);
const error = message => new Response(stringify(message));

const url = `${location.href}?sabayon`;
const bc = new BroadcastChannel(BROADCAST_CHANNEL_UID);
bc.onmessage = event => resolve.apply(null, event.data);

addEventListener('activate', e => e.waitUntil(clients.claim()));
addEventListener('install', () => skipWaiting());
addEventListener('fetch', event => {
  const { request: r } = event;
  if (r.method === 'POST' && r.url === url) {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.respondWith(r.json().then(
      ([wid, vid]) => {
        const [swid, promise] = next();
        bc.postMessage([swid, wid, vid]);
        return promise.then(ok, error);
      },
      error
    ));
  }
});
