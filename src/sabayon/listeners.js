import BROADCAST_CHANNEL_UID from './bid.js';

import nextResolver from 'next-resolver';

const [next, resolve] = nextResolver();
const { stringify } = JSON;

const options = {
  status: 200,
  statusText: 'OK',
  headers: {
    'Pragma': 'no-cache',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, max-age=0',
  },
};

const ok = value => new Response(`[${value.join(',')}]`, options);
const error = message => new Response(stringify(message), options);

const { protocol, host, pathname } = location;
const url = `${protocol}//${host}${pathname}?sabayon`;
const bc = new BroadcastChannel(BROADCAST_CHANNEL_UID);
bc.onmessage = event => resolve.apply(null, event.data);

export const activate = event => event.waitUntil(clients.claim());

export const fetch = event => {
  const { request: r } = event;
  if (r.method === 'POST' && r.url === url) {
    event.stopImmediatePropagation();
    event.respondWith(r.json().then(
      ([wid, vid]) => {
        const [swid, promise] = next();
        bc.postMessage([swid, wid, vid]);
        return promise.then(ok, error);
      },
      error
    ));
  }
};

export const install = () => skipWaiting();
