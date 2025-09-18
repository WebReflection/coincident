import BROADCAST_CHANNEL_UID from './bid.js';

import nextResolver from 'next-resolver';

const { isArray } = Array;
const { stringify } = JSON;
const [next, resolve] = nextResolver();
const stopImmediatePropagation = event => event.stopImmediatePropagation();

const ok = value => new Response(`[${value.join(',')}]`);
const error = message => new Response(stringify(message));

const { protocol, host, pathname } = location;
const url = `${protocol}//${host}${pathname}?sabayon`;
const bc = new BroadcastChannel(BROADCAST_CHANNEL_UID);
bc.onmessage = event => resolve.apply(null, event.data);

export const activate = event => event.waitUntil(clients.claim());

export const fetch = event => {
  const { request: r } = event;
  if (r.method === 'POST' && r.url === url) {
    stopImmediatePropagation(event);
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

addEventListener('message', event => {
  const { data } = event;
  if (isArray(data) && data.length === 2 && data[0] === BROADCAST_CHANNEL_UID) {
    stopImmediatePropagation(event);
  }
});
