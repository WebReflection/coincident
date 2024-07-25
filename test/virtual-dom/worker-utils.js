import diff from 'https://esm.sh/virtual-dom/diff';

import coincident from '../../dist/window/worker.js';

const { proxy } = await coincident();

const { createElement: $createElement, appendElement, patchElement } = proxy;

class Element {
    constructor(tree) {
        this.id = $createElement(tree);
        this.tree = tree;
    }
    in(selector) {
        appendElement(selector, this);
        return this;
    }
    update(tree) {
        patchElement(diff(this.tree, tree), this);
        this.tree = tree;
    }
}

export const createElement = tree => new Element(tree);
