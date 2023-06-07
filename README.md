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

The module exports a utility/helper able to *Proxy* once a generic *worker* or *globalThis* / *self* context, adding an unobtrusive listener, in the *worker* case, on the main thread, providing orchestration out of the box for bootstrapped *workers* that use such module.

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


### coincident/structured

This entry point exports the exact same module except it uses [@ungap/structured-clone/json](https://github.com/ungap/structured-clone/#tojson) `parse` and `stringify` functions, allowing more complex, or recursive, objects to be passed along as result to the *worker*.

Please keep in mind not all complex types are supported by the polyfill.
