import coincident from '../esm/index.js';

const wrap = coincident(self);

// define a method that can be awaited from the main
// asking for a question in main while returning
wrap.sum = num => (num + parseInt(wrap.ask(`${num} + ... ?`), 10));
