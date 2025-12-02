import { MAIN_WS, WORKER_WS } from '../src/server/constants.js';

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

writeFileSync(
  join(import.meta.dirname, '..', 'src', 'server', 'constants.py'),
  `MAIN_WS = ${JSON.stringify(MAIN_WS)}
WORKER_WS = ${JSON.stringify(WORKER_WS)}
`
);
