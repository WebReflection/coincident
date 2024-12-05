// ⚠️ THIS MAKES NO SENSE FOR AN ASYNC ONLY WORKER

// import { DESTRUCT } from 'js-proxy/traps';

// import { MAIN, WORKER } from './constants.js';
// import DEBUG from '../debug.js';

// import coincident from '../shared-worker.js';
// import proxyWorker from '../proxy/worker.js';

// export default options => {
//   const proxies = coincident(options);

//   addEventListener('connect', ({ ports }) => {
//     for (const port of ports) {
//       const promise = proxies.get(port);
//       proxies.set(port, promise.then(proxy => {
//         const { isProxy, global, method } = proxyWorker(
//           proxy[MAIN],
//           options?.transform || ((o) => o)
//         );
//         proxy[WORKER] = method;
//         if (DEBUG) {
//           const debug = proxy[WORKER];
//           proxy[WORKER] = (TRAP, ...args) => {
//             const destructing = TRAP === DESTRUCT;
//             const method = destructing ? console.warn : console.log;
//             method('Worker before', TRAP, ...args);
//             const result = debug(TRAP, ...args);
//             if (!destructing) method('Worker after', TRAP, result);
//             return result;
//           };
//         }
//         return { proxy, window: global, isWindowProxy: isProxy };
//       }));
//     }
//   });

//   return proxies;
// };
