# coincident

<sup>**Social Media Photo by [bady abbas](https://unsplash.com/@bady) on [Unsplash](https://unsplash.com/)**</sup>

An [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) based [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to simplify, and synchronize, [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) related tasks.

## API

Following the description of all different imports to use either on the *main* or the *worker* thread.

### coincident/main

This is the *import* that provides the ability to expose *main* thread's callbacks to the *worker* thread and to also await callbacks exposed via the *worker* code.

```js
import coincident from 'coincident/main';

const {
  // the Worker to be used (this extends the global one)
  Worker,
  // a boolean indicating if sabayon is being used
  polyfill,
  // a utility to transfer values directly via `postMessage`
  // (...args: Transferable[]) => Transferable[]
  transfer,
} = coincident({
  // a utility to parse text, default: JSON.parse
  parse: JSON.parse,
  // a utility to stringify values, default: JSON.stringify
  stringify: JSON.stringify,
  // an optional utility to transform values (FFI / Proxy related)
  transform: value => value,
});
```

#### coincident/main - Worker class

The `Worker` class returned by `coincident()` has these features:

  * it always starts a *Worker* as `{ type: "module" }` <sup>( mostly because the worker needs to `await coincident()` on bootstrap )</sup>
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
  // a boolean indicating if sabayon is being used
  polyfill,
  // a utility to transfer values directly via `postMessage`
  // (...args: Transferable[]) => Transferable[]
  transfer,
} = await coincident({
  // a utility to parse text, default: JSON.parse
  parse: JSON.parse,
  // a utility to stringify values, default: JSON.stringify
  stringify: JSON.stringify,
  // an optional utility to transform values (FFI / Proxy related)
  transform: value => value,
  // an optional interrupt reference that is used via `Atomic.wait(sb)`
  interrupt: { handler() {}, timeout: 42 },
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

The latter 2 points will inevitably fallback to a *polyfilled* version of the native possible performance but it should be *god enough* to enable your logic around *workers* invoking, or reaching, synchronous *main* thread related tasks.

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
