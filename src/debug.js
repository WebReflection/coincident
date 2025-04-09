export default false;

// YAGNI (imho) - also no counterpart for the async case
// // ℹ️ for backward compatibility (never used to date)
// const interrupt = options?.interrupt;
// if (interrupt) {
//   const { handler, timeout = 42 } = interrupt;
//   waitSync = (sb, index, result) => {
//     while ((result = wait(sb, index, 0, timeout)) === 'timed-out')
//       handler();
//     return result;
//   };
// }
