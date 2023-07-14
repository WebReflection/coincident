import h from 'https://esm.sh/virtual-dom/h';

import { createElement } from './worker-utils.js';

const render = count => h(
    'div',
    {
        style: {
            textAlign: 'center',
            lineHeight: (100 + count) + 'px',
            border: '1px solid red',
            width: (100 + count) + 'px',
            height: (100 + count) + 'px'
        }
    },
    [
        String(count)
    ]
);

let count = 0;
const element = createElement(render(count)).in('body');

setInterval(function () {
    element.update(render(++count));
}, 1000);
