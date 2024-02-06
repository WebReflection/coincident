# coincident

[![build](https://github.com/WebReflection/coincident/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/coincident/actions/workflows/node.js.yml)

<sup>**Social Media Photo by [bady abbas](https://unsplash.com/@bady) on [Unsplash](https://unsplash.com/)**</sup>

An [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) based [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to simplify, and synchronize, [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) related tasks.

#### Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <script type="module">
      import coincident from 'https://unpkg.com/coincident';
      const worker = new Worker('./worker.js', {type: 'module'});
      // set a sync or async callback to return a serializable answer
      coincident(worker).input = value => prompt(value);
    </script>
  </head>
</html>
```

```js
// worker.js
import coincident from 'https://unpkg.com/coincident';

console.log('asking for an input');
// pauses in a non blocking way the worker until the answer has been received
console.log('input', coincident(self).input('what is 1 + 2 ?'));
console.log('input received');
```

## API

The module exports a utility/helper able to *Proxy* once a generic *worker* or *globalThis* / *self* context, adding an unobtrusive listener, providing orchestration out of the box for bootstrapped *workers* that use such module.

#### Worker -> Main

```js
import coincident from 'coincident';
// or const coincident = require('coincident');

// on the main thread
const worker = new Worker('./any-worker.js');
coincident(worker).enabler = async (...args) => {
  // do something sync or async with received args
  return {some: 'value'};
};

// on the worker side
const result = coincident(self).enabler('one', {or_more: 'args'});
console.log(result);
// {some: 'value'}
```

The second optional argument of the `coincident(context[, JSON])` helper can be any *JSON* like namespace able to `parse` and `stringify` data, such as [flatted](https://www.npmjs.com/package/flatted) or [@ungap/structured-clone/json](https://github.com/ungap/structured-clone/#tojson) (or use `coincident/structured`).

Additionally, it can contain a `transform` callback that will be used to change arguments into something else via `(value: any) => any` operation per each of them.

Moreover, it can also contain an `interrupt` callback or object that will be used to check some internal state while waiting synchronously from a worker (it's not used when main invokes a worker, it's only used when workers invokes and wait-block itself for main).

**Additionally**, the exported function has a `coincident.tranfer(...buffers)` helper that if used as last argument of any worker demanded task will transfer buffers instead of cloning/copying these.

on top of that, the `setInterruptHandler(callback)` field allows any foreign code to periodically check on awaited main tasks, from a *worker*.

#### Main -> Worker

This module can also communicate from a *main* thread to a *worker*, but in this case the *main* thread needs to `await` for results because [Atomics.wait() cannot be used in main](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait).

```html
<script type="module">
  // main thread
  import coincident from 'coincident';
  const worker = new Worker('./worker.js', {type: 'module'});

  document.body.textContent = await coincident(worker).compute(1, 2);
</script>
```

```js
// worker.js
import coincident from 'coincident';

// expose a specific function to the main thread
coincident(self).compute = (a, b) => (a + b);
```


### coincident/structured

This entry point exports the exact same module except it uses [@ungap/structured-clone/json](https://github.com/ungap/structured-clone/#tojson) `parse` and `stringify` functions, allowing more complex, or recursive, objects to be passed along as result to, or from, the *worker*.

Please keep in mind not all complex types are supported by the polyfill but also any other export could use this version with ease:

```js
import * as JSON from '@ungap/structured-clone/json';
import coincident from 'coincident/uhtml';

// bootstrap in both main / workers like this
const {proxy, window, isWindowProxy} = coincident(self, JSON);

// that's it: structured-clone enabled for responses!
```


### coincident/window

This entry point exports the same `coincident` module (using *JSON* as default) **but** the utility returns an obejct with 3 fields:

  * **proxy** it's the usual proxy utility to expose or invoke functions defined in the main counter-part.
  * **window** it's the proxy that orchestrates access to the *main* world in *Workers*, including the ability to pass callbacks from the *Worker*, with the only caveat these will be inevitably executed asynchronously on the main thread, so that *Promise* or *thenable* work out of the box but *accessors* or defined callbacks will need to be awaited from the worker too. DOM listeners should be also handled with no issues but the `event` can't *preventDefault* or *stopPropagation* as the listener will be asynchronous too. All well known *Symbol* also cross boundaries so that `[...window.document.querySelectorAll('*')]` or any other *Symbol* based functionality should be preserved, as long as the `symbol` is known as runtime symbols can't cross paths in any meaningful way. In the *main* thread, this is just a reference to the `globalThis` object.
  * **isWindowProxy** is an utility that helps introspecting window proxies, callbacks, classes, or main thread references in general. This returns always `false` in the *main* thread.

While the initial utility/behavior is preserved on both sides via `proxy`, the *Worker* can seamlessly use `window` utility to operate on *DOM*, *localStorage*, or literally anything else, included *Promise* based operations, DOM listeners, and so on.


```html
<!-- main page -->
<script type="module">
  import coincident from 'coincident/window';
  const {proxy} = coincident(new Worker('./worker.js', {type: 'module'}));
</script>
```

```js
// The worker.js !!!
import coincident from 'coincident/window';

const {proxy, window, isWindowProxy} = coincident(self);
// the proxy can expose or answer to main proxy counter part

// ... but here is the fun part ...
const {document} = window;
document.body.innerHTML = '<h1>Hello World!</h1>';

document.body.appendChild(
  document.createElement('div')
).textContent = '😱';

const scoped = true;
document.body.addEventListener('click', event => {
  console.log(event.type, 'running in a worker', scoped);
});
```

See the [test/window.js](./test/window.js) file, try it [live](https://webreflection.github.io/coincident/test/window.html) or reach `http://localhost:8080/test/window.html` locally to play around this feature.

#### Extra features

Beside providing some handy utility, the `window` (and other exports such as `uhtml`) allows *Workers*' listeners to synchronously invoke methods on the **event** on the main thread, before the proxied worker function gets a chance to get executed (remember, functions form the *worker* are inevitably async when executed from *main*).

```js
document.body.addEventListener(
  'click',
  event => console.log(event.type),
  {invoke: ['preventDefault', 'stopImmediatePropagation']}
);
```

When options are passed, be sure these contains [all the details you need](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters) *plus* an `invoke` *string* or array of strings.


### coincident/uhtml

This export includes [uhtml](https://github.com/WebReflection/uhtml#readme) to fully drive reactive UI from a Worker.

The `uhtml` field is added to the returned object after `coincident(self)` call.

```html
<!-- main page -->
<script type="module">
  import coincident from 'coincident/window';
  const {proxy, uhtml} = coincident(new Worker('./worker.js', {type: 'module'}));
  // uhtml directly on main thread
  const {render, html} = uhtml;
</script>
```

```js
// The worker.js !!!
import coincident from 'coincident/window';

const {proxy, window, uhtml} = coincident(self);

// uhtml directly from the thread
const {render, html} = uhtml;

const {document} = window;

render(document.body, html`
  <h1>Hello uhtml!</h1>
`);
```

See [test/uhtml.js](./test/uhtml.js) page, try it [live](https://webreflection.github.io/coincident/test/uhtml.html), or test it locally via `http://localhost:8080/test/uhtml.html` after `npm run server`.


### coincident/server

<sup><sub>⚠️ **WARNING - THIS EXPORT SHOULD NOT BE PUBLICLY AVAILABLE**</sub></sup>

This export, automatically based on `structured` export to allow passing more complex data around, allows a *Worker* to drive not just the *main* thread (UI/DOM/global page namespace) but also a *server* such as *NodeJS* or *Bun* (both successfully tested) and likely more, as long as a *WebSocketServer* like reference is passed along while creating the connection.


**HTML example** - see [test/server/index.html](./test/server/index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>body{font-family:Arial, Helvetica, sans-serif}</style>
    <script type="module">
      // import the `/server` export
      import coincident from 'coincident/server';
      // define the worker super-chard with main/server power
      const w = new Worker('./worker.js', {type: 'module'});
      // pass along the socket to use for such interaction
      const ws = new WebSocket('ws://localhost:8080/');
      // retrieve usual `/window` utilities/helpers and move on
      const {proxy, window, isWindowProxy} = coincident(w, ws);
    </script>
</head>
</html>
```

**Worker example** - see [test/server/worker.js](./test/server/worker.js)
```js
import coincident from 'coincident/server';

const {
  proxy,            // the main thread (UI/DOM) proxy
  window,           // the window reference
  isWindowProxy,    // the window introspection helper
  server,           // the server reference
  isServerProxy,    // the server introspection helper
} = coincident(self);

// deal directly with the server modules out of the box
const os = server.require('os');

// deal directly with the main UI/DOM thread out of the box
window.document.body.innerHTML = `
  <h1>coincident/server</h1>
  <h2>Platform Info</h2>
  <ul>
    <li>Platform: ${os.platform()}</li>
    <li>Arch: ${os.arch()}</li>
    <li>CPUS: ${os.cpus().length}</li>
    <li>RAM: ${os.totalmem()}</li>
    <li>Free: ${os.freemem()}</li>
  </ul>
`;

```

**NodeJS / Bun example** - see [test/server/main.cjs](./test/server/main.cjs)
```js
const {createServer} = require('http');
const {join} = require('path');
const {WebSocketServer} = require('ws');

// static file server utility + headers for SharedArrayBuffer
const staticHandler = require('static-handler');
const handler = staticHandler(join(__dirname, '..', '..'), {
  'Access-Control-Allow-Origin': '*',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'cross-origin'
});

const server = createServer(handler);

// require the coincident export
const coincident = require('coincident/server');

// pass along the wss to instrument with listeners
// and a list of globals utilities to make available
// whenever the Worker tries to reach these
coincident(new WebSocketServer({server}), {require});

// bootstrap the server and that's it!
server.listen(8080, () => {
  console.log(`http://localhost:8080/test/server/`);
});
```

The main goal of this export is **IoT** related projects, *KIOSK* like project, *Electron* like project, *Tauri* integration, and so on ... there's the possibility to fully orchestrate from a worker listeners on the page that result into *Server* operations and so on and so forth, so please be aware while this is an **achievement unlocked** from my side, it's also potentially dangerous if used in any open space where evil attackers can try to operate Server side operations on "*your*" behalf, as if it was the *Worker* itself asking for such operations.

That being said, in Apps where no foreign code is allowed, this export unlocks an infinite amount of potentials for any sort of project.

Alternatively, please consider strict *CSP* rules to be sure no code evaluation can arrive from a console, from foreign injected files, from users' input, and so on.

Thanks for trying this feature out as no other projects (to date) can do in a cross platform, cross browser, cross environment way what this module currently offer.

### Local Only

If worried about possible foreign scripts doing weird things it is possible to use these headers instead so that only local files would be able to execute any content.

```js
{
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
}
```

### coincident/bun

Same as *coincident/server* except it's 100% based on *Bun* primitives (*websocket*):

```js
import { serve, file } from 'bun';
import coincidentWS from 'coincident/bun';

const port = 8080;
const headers =  {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

serve({
  port,
  fetch(req, server) {
    // upgrade sockets if possible
    if (server.upgrade(req)) return;
    // do anything else you'd do with Bun
    let path = '.' + new URL(req.url).pathname;
    if (path.endsWith('/')) path += 'index.html';
    return new Response(file(path), {headers});
  },
  // create automatically the websocket utility
  websocket: coincidentWS({import: name => import(name)}),
});

console.log(`http://localhost:${port}/test/server/`);
```

### A quick way to test SharedArrayBuffer

If you would like to just test locally *SharedArrayBuffer* you can also use [mini-coi](https://github.com/WebReflection/mini-coi#readme), now enriched with a *CLI* that bootstraps locally in a snap:

```sh
npx mini-coi .

# or even ...
bunx mini-coi .
```

If you would like to bring *SharedArrayBuffer* to your GitHub pages or any other hosting space where you can't configure headers, you can use the *Service Worker* approach currently tested to work already here and elsewhere.

To copy the **script** that must be used on the page locally as Service Worker, you can also use *mini-coi*:

```sh
# put mini-coi.js into ./public/mini-coi.js
npx mini-coi -sw ./public/
```
