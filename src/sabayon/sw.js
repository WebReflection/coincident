import { activate, fetch, install } from './listeners.js';

addEventListener('activate', activate);
addEventListener('fetch', fetch);
addEventListener('install', install);
