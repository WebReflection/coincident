# coincident

<sup>**Social Media Photo by [bady abbas](https://unsplash.com/@bady) on [Unsplash](https://unsplash.com/)**</sup>

An [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) based [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to simplify, and synchronize, [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) related tasks.

- - -

# Coincident V4

This is the latest iteration of this module where everything is explained in [the related merge request](https://github.com/WebReflection/coincident/pull/58) and it can be summarized as such:

  * there is one default encoder/decoder that brings the best of all worlds out of the box
  * there are more utilities that helps reducing roundtrips
  * views and buffers are compatible and fast by default
  * the whole *FFI* is now 100% code covered in its dedicated, dependency-free, project

- - -

### API

##### main

```js
import coincident from 'coincident/main';

const {
  // the Worker to be used (this extends the global one and add proxy)
  Worker:globalThis.Worker & { proxy: Proxy },
  // true if SharedArrayBuffer and sync operations are usable
  native:boolean,
  // a utility to transfer buffers directly via `postMessage`
  // use this at the end of any proxied function signature/call
  transfer:(...buffers:ArrayBuffer[]) => buffers,
} = coincident({
  // an optional way to transform values before sending these elsewhere
  transform: value => any,
  // an optional way to encode any value as binary
  // reflected-ffi/encoder as default
  encoder: reflectedFFIEncoder,
  // if `false` disable/ignore the transfer ability (perf boost)
  transfer:boolean,
});
```

##### worker

```js
import coincident from 'coincident/worker';

const {
  // the proxy to invoke sync or async main thread exposed utility
  // it can expose utilities itself too that the main can invoke
  proxy: Proxy,
  // true if SharedArrayBuffer and sync operations are usable
  native:boolean,
  // a utility to transfer buffers directly via `postMessage`
  // use this at the end of any proxied function signature/call
  transfer:(...buffers:ArrayBuffer[]) => buffers,
  // a way to directly transfer a value as it is
  direct: value => value,
} = coincident({
  // an optional way to transform values before sending these elsewhere
  transform: value => any,
  // an optional way to decode any bonary as value
  // reflected-ffi/decoder as default
  decoder: reflectedFFIDirectDecoder,
  // if `false` disable/ignore the transfer ability (perf boost)
  transfer:boolean,
  // optional minimum SharedArrayBuffer size
  minByteLength: 0x7FFF,
  // optional maximum SharedArrayBuffer size
  maxByteLength: 0x1000000,
});
```

#### window/worker

It returns as part of the object literal also `window`, usable only when `native` is `true`, and `isWindowProxy` which returns `true` or `false` accordingly if the tested reference is from the main thread or not.


#### server/worker

It returns as part of the object literal what `window/worker` returns but also `server`, usable only when `native` is `true`, and `isServerProxy` which returns `true` or `false` accordingly if the tested reference is from the backend or not.

- - -

## V2 API

Following the description of all different imports to use either on the *main* or the *worker* thread.

### coincident/main

This is the *import* that provides the ability to expose *main* thread's callbacks to the *worker* thread and to also await callbacks exposed via the *worker* code.

```js
import coincident from 'coincident/main';

const {
  // the Worker to be used (this extends the global one)
  Worker,
  // a boolean indicating if shared array buffer is supported
  native,
  // a utility to transfer values directly via `postMessage`
  // (...args: Transferable[]) => Transferable[]
  transfer,
} = coincident({
  // an optional utility to transform values (FFI / Proxy related)
  transform: value => value,
});
```

#### coincident/main - Worker class

The `Worker` class returned by `coincident()` has these features:

  * it always starts a *Worker* as `{ type: "module" }` <sup><sub>( mostly because the worker needs to `await coincident()` on bootstrap )</sub></sup>
  * it optionally accepts a `{ serviceWorker: "../sw.js" }` to help *sabayon* falling back to synchronous behavior, which is mandatory to use any *DOM* or `window` related functionality
  * it provides to each instance a `proxy` reference where utilities, as *callbacks*, can be assigned or asynchronously awaited if exposed within *worker*'s code

```js
const { proxy } = new Worker('./worker.js');

// can be invoked from the worker
proxy.location = () => location.href;

// exposed via worker code
await proxy.compute();
```

### coincident/worker

This is the *import* that provides the ability to expose *worker* thread's callbacks to the *main* thread and to also directly invoke callbacks exposed via the *main* proxied reference.

```js
import coincident from 'coincident/worker';

const {
  // the counter-part of the main worker.proxy reference
  proxy,
  // a boolean indicating if shared array buffer is supported
  native,
  // a utility to transfer values directly via `postMessage`
  // (...args: Transferable[]) => Transferable[]
  transfer,
  // a way to transfer a value directly as it is
  direct: value => value,
  // a namespace to batch multiple operations into a single roundtrip
  ffi: {
    assign, query, gather, evaluate,
  }
} = await coincident({
  // an optional utility to transform values (FFI / Proxy related)
  transform: value => value,
});

// exposed to the main thread
proxy.compute = async () => {
  // super expensive task ...
  return 'result';
};

// consumed from the main thread
// synchronous if COI is enabled or
// the Service Worker was passed
console.log(proxy.location());
```

- - -

## Window

These exports and their `coincident/dist/...` pre-optimized counter-parts allow *coincident* to drive, from a *Worker* the *main* thread and operate directly on it.

### coincident/window/main

When the *worker* code expects the *main* `window` reference, this import is needed to allow just that.

```js
import coincident from 'coincident/window/main';
//                                 ^^^^^^

const { Worker, polyfill, transfer } = coincident();
```

The signature, on the *main* thread, is identical.

### coincident/window/worker

On the *worker* side, this import is also identical to the non-window variant but it's returned namespace, after bootstrap, contains two extra utilities:

```js
import coincident from 'coincident/window/worker';
//                                 ^^^^^^

const {
  proxy, native, transfer,
  // it's a synchronous, Atomic.wait based, Proxy
  // to the actual globalThis reference on the main
  window,
  // it's an introspection helper that returns `true`
  // only when a reference points at the main thread
  // (value: any) => boolean
  isWindowProxy,
} = await coincident();

// direct synchronous access to the main `window`
console.log(window.location.href);

window.document.body.textContent = 'Hello World 👋';
```

- - -

## Server

These exports and their `coincident/dist/...` pre-optimized counter-parts allow *coincident* to drive, from a *Worker* both the *main* thread and operate directly on the running *server* too.

---

#### ⚠️ WARNING

This feature exists mostly to enable *Kiosk* or *IoT* related projects and it should not be publicly available as any malicious *worker* code could fully take over the server or harm the service.

---

### coincident/server

This is what *node* or *bun* or others should import to instrument connected *WebSockets*.

```js
import coincident from 'coincident/server';

// Bun example
serve({
  port,
  fetch,
  // here coincident options should have
  // a "truthy" bun 🐰
  websocket: coincident({ bun: true })
});

// NodeJS ⬡ or any other with `ws` module as example
import { WebSocketServer } from 'ws';
const server = ...;
coincident({
  // the `wss` property must be there
  wss: new WebSocketServer({ server })
});
```

The `coincident` utility here simply instruments every connected *WebSocket* to react on `message` and `close` events.

### coincident/server/main

When the *worker* code expects both the *main* `window` and the `server` references, this import is needed to allow just that.

```js
import coincident from 'coincident/server/main';
//                                 ^^^^^^

const { Worker, polyfill, transfer } = coincident({
  ws: 'ws://localhotst:8080/'
  //   ^^^^^^^^^^^^^^^^^^^^^
});
```

The signature, on the *main* thread, is identical *except* the WebSocket *url* must be provided during initialization.

### coincident/server/worker

On the *worker* side, this import is also identical to the window variant but it's returned namespace, after bootstrap, contains two extra utilities:

```js
import coincident from 'coincident/server/worker';
//                                 ^^^^^^

const {
  proxy, native, transfer,
  window, isWindowProxy,
  // it's a synchronous, Atomic.wait based, Proxy
  // to the actual globalThis reference on the server
  server,
  // it's an introspection helper that returns `true`
  // only when a reference points at the server
  // (value: any) => boolean
  isServerProxy,
  // a namespace with both FFIs (direct methods are window only)
  ffi: {
    assign, gather, query, evaluate,
    window: { ... }, // replicates above
    server: { ... }, // brings above to the server
  }
} = await coincident();

// direct synchronous access to the main `server`
server.console.log('Hello World 👋');

// example of module import
const os = await server.import('os');
console.log(os.platform());
```

- - -

<details id="performance">
  <summary><strong>A note about performance</strong></summary>
  <div markdown=1>

Every single property retrieved via the `window` reference is a whole *worker* ↔ *main* roundtrip and this is inevitable. There is no "*smart caching*" ability backed in the project, because everytrhing could be suddenly different at any point in time due side effects that both the worker, or the main thread, could have around previously retrieved references.

Especially when *SharedArrayBuffer* is polyfilled, and the `serviceWorker` provided as option, an average *PC* would perform up to ~1000 roundtrips per second. That seems like a lot but operations can easily pile up and make the program feel unnecessary slower than it could be (if run on the *main* thread directly, as comparison).

When native *SharedArrayBuffer* is enabled though, an average *PC* would be able to do ~50000 (50x) roundtrips per second .... and yet that could also easily degrade with more complex logic involved.

An easy way to prevent repeated roundtrips, when we already assume a reference will not change by any mean over time, we can take over that "*smart caching*" explicit operation:

```js
const { window } = await coincident();

const { document } = window;
const { head, body } = document;

// any time we need to change the content
body.textContent = 'Hello World 👋';
```

Please note that because those references won't likely ever change on the *main* thread, there are also no *memory leaks* hazard, and that's true with every other reference that might live forefer on the *main* thread.


  </div>
</details>

- - -

### About 💀🔒 Deadlock Message

This module allows different worlds to expose utilities that can be invoked elsewhere and there are two ways this can work:

  * `Atomics.wait` is usable, from a *worker*, and it will be preferred over `Atomics.waitAsync` for the simple reason that it unlocks much more than trivial *async* exchanges between the two worlds. In this case, if the worker is invoking a foreign exposed utility, it will be fully unresponsive until that utility returned a value and there's no possible workaround. When this happens, the module understands that the requested utility comes from a *worker* that is paused until such invoke returns, and if this invoke relies on a *synchronous* *worker* utility there won't be any chance to complete that request: the *worker* is stuck and the *main* can't use it until is not stuck anymore. In this case, an error is thrown with details around which *worker* utility was invoked while the *main* utility was executing, and the program won't just block itself forever. This is the most meaningful and reasonable deadlock case to `throw` errors unconditionally ... but ...
  * if this module runs without `Atomics.wait` ability, meaning no *COI* headers are enabled and no `serviceWorker` fallback has been used, it is possible for a *main* exported utility to query a *worker* exported utility one once executed, assuming there is no recursion in doing so (i.e. the *worker* calls `main()` that internally calls `worker()` which in turns calls `main()` again). These cases are rather infinite loops/recursions than deadlocks but if you are sure your *main* utility is invoking something in the *worker* that won't cause such infinite recursion, no *deadlock* error would be shown, as that would not be the case, strictly speaking, but also recursions won't be tracked so ... be careful with your logic!

As rule of thumb, do not ever invoke other world utilities while one of your exported utility is executing, so that code will be guaranteed to work in both `Atomics.wait` and `Atomics.waitAsync` scenarios without ever worrying about future deadlock, once all headers are available or the `serviceWorker` helper will be used.

It is, however, always possible to execute foreign utilities on the next tick, micro-task, timeout, idle state or listener, so that if a *main* exposed utility needs to invoke a *worker* utility right after, there are ways to do that.

### About SharedArrayBuffer

Unfortunately not enabled by default on the Web, the *SharedArrayBuffer* primitive requires either special *headers* permissions to be trusted or a *polyfill* that can always enable the *async* abilities of the *Atomics* specifications and eventually grant the *sync* abilities too, as long as a *ServiceWorker* able to handle those requests is installed.

This primitive is needed to enable notifications about data cross realms, notifications that are expected to be *sync*, in the best case scenario, or *async* as least possible fallback.

#### Enable both sync & async SharedArrayBuffer features

This is the preferred way to use this module or any module depending on it, meaning all headers to enable *SAB* are in place. To do so:

  * be sure your server is providing those headers as explained in *MDN*
  * bootstrap a local server that provides such headers for local tests: `npx mini-coi ./` is all you need to enable these headers locally, but the utility doesn't do much more than serving files with those headers enabled
  * use `<script src="./mini-coi.js"></script>` on top of your `<head>` node in your *HTML* templates to use automatically a *ServiceWorker* that force-enable those headers for any request made frm any client. This woks on *GitHub* pages too, and every other static files handler for local projects
  * use the *ServiceWorker* logic enabled out of the box by passing the file `npx sabayon ./public/sw.js` to *Worker* constructors, so that such *SW* can be used to polyfill the *sync* case
  * provide your own *ServiceWorker* file whenever a *Worker* is created, out of the `{ serviceWorker: '../sw.js' }` extra option, as long as it imports utilities from [sabayon](https://github.com/WebReflection/sabayon#readme), as explained in its [ServiceWorker related details](https://github.com/WebReflection/sabayon?tab=readme-ov-file#service-worker)

The latter 2 points will inevitably fallback to a *polyfilled* version of the native possible performance but it should be *good enough* to enable your logic around *workers* invoking, or reaching, synchronous *main* thread related tasks.

#### Enable only async SharedArrayBuffer features

This module by default does fallback to a *SAB* polyfill, meaning *async* notification of any buffer are still granted to be executed or succeed, thanks to [sabayon](https://github.com/WebReflection/sabayon#readme) underlying module.

This scenario is **ideal** when:

  * no special headers are allowed in your project
  * no *Serviceworker* is allowed in your project
  * you only need to *await* *asynchronous* utilities from a *Worker*, never the other way around
  * you never need to reach, or execute, code on the *main* thread, from a *worker*

As long as these enabled use cases are clear, here the caveats:

  * your *worker* can't ever reach directly anything coming from the *main* thread
  * your *worker* doesn't ever receive a *main* thread reference as an argument

If all of this is clear, it's possible to use *coincident* module as bridge between *worker* exported features / utilities consumed asynchronously by the *main* thread any time it needs to.

This still unlocks tons of use cases out there, but it's definitively a constrained and limited experience.
