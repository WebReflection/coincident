import coincident from '../../dist/window/sync.js';

const sync = coincident('./target.js', { worker: true });
sync.for('./source.js');
sync.for('./source.js');
