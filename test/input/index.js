import coincident from '../../dist/window/main.js';

const { Worker } = coincident();

const { proxy } = new Worker('./worker.js', { serviceWorker: '../sw.js' });

// sync way VS promise based (more Webbish)
// add a slash in front of the next line to see the form
//**/proxy.input = value => prompt(value);/*
proxy.input = placeholder => new Promise(resolve => {
    const [user, submit] = document.querySelectorAll('input');
    submit.addEventListener('click', event => {
    event.preventDefault();
    resolve(user.value.trim());
    }, {once: true});
    question.removeAttribute('hidden');
    user.placeholder = placeholder;
    user.focus();
});
//*/