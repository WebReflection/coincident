# coincident

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

**Additionally**, the exported function has a `coincident.tranfer(...buffers)` helper that if used as last argument of any worker demanded task will transfer buffers instead of cloning/copying these.

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

See the [test/window.js](./test/window.js) file or reach `http://localhost:8080/test/window.html` locally to play around this feature.

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

See [test/uhtml.js](./test/uhtml.js) page or test it locally via `http://localhost:8080/test/uhtml.html` after `npm run server`.
