const{ArrayBuffer:e,Atomics:t,Promise:s}=globalThis,{isArray:r}=Array,{create:n,getPrototypeOf:a,values:o}=Object,c=a(Int32Array),i=n(t),l=({currentTarget:e,type:t,origin:s,lastEventId:r,source:n,ports:a},o)=>e.dispatchEvent(new MessageEvent(t,{data:o,origin:s,lastEventId:r,source:n,ports:a})),p=()=>s.withResolvers();let u=0;const f=new Map,d=(e,t)=>class extends e{constructor(e,...s){super(e,...s),e instanceof t&&f.set(this,[u++,0,p()])}},y=new WeakSet,w=e=>(y.add(e),e),g=(e,t)=>{const{data:s}=e,n=r(s)&&(s.at(0)===t||0===s.at(1)&&!t);return n&&(e.stopImmediatePropagation(),e.preventDefault()),n},h=e=>null!==e&&"object"==typeof e&&!y.has(e),v=new WeakMap,m=(t,s,r)=>{if(f.has(t))s.set(t,f.get(t)[0]);else if(!(t instanceof c||t instanceof e))for(const e of o(t))h(e)&&!r.has(e)&&(r.add(e),m(e,s,r))},E=(...e)=>({value:new s((t=>{let s=new Worker("data:application/javascript,onmessage%3De%3D%3EpostMessage(!Atomics.wait(...e.data))");s.onmessage=()=>t("ok"),s.postMessage(e)}))}),A=(e,t)=>{const s=f.get(e),[r,n,{promise:a}]=s;return s[1]=t,[r,a]};let{BigInt64Array:T,Int32Array:k,SharedArrayBuffer:b,addEventListener:M,postMessage:x}=globalThis,I=!0,S=e=>e,P=!1;const $=p();try{new b(4),i.waitAsync||(i.waitAsync=E),$.resolve()}catch(t){const s=x,r=M,n=[];let a="",o="";b=class extends e{},T=d(T,b),k=d(k,b),S=w,P=!0,i.notify=(e,t)=>{const[r]=(e=>v.get(e))(e);return s([a,1,e,r,t]),0},i.waitAsync=(...e)=>{const[t,s]=A(...e);return{value:s}},i.wait=(e,t,...s)=>{const[r]=A(e,t,...s),n=new XMLHttpRequest;n.responseType="json",n.open("POST",`${o}?sabayon`,!1),n.setRequestHeader("Content-Type","application/json"),n.send(`["${a}",${r},${t}]`);const{response:c}=n;f.delete(e);for(let t=0;t<c.length;t++)e[t]=c[t];return"ok"},r("message",(e=>{if(g(e,a)){const[t,s,...r]=e.data;switch(s){case 0:a=t,o=r.at(0)?.serviceWorker||"",o||(i.wait=null,$.resolve());break;case 1:((e,t,s)=>{for(const[r,[n,a,{resolve:o}]]of f)if(t===n&&s===a){for(let t=0;t<e.length;t++)r[t]=e[t];f.delete(r),o("ok");break}})(...r);break;case 2:((e,t,s)=>{for(const[s,r]of t)v.set(s,[r,e.currentTarget]);l(e,s)})(e,...r);break;case 3:$.resolve()}}else if(I){const{currentTarget:t,type:s,origin:r,lastEventId:a,source:o,ports:c}=e;n.push([{currentTarget:t,type:s,origin:r,lastEventId:a,source:o,ports:c},e.data])}})),M=(e,...t)=>{if(r(e,...t),n.length)for(const e of n.splice(0))l(...e)},x=(e,...t)=>s(((e,t)=>{const s=new Map;return h(t)&&m(t,s,new Set),s.size?[e,2,s,t]:t})(a,e),...t)}await $.promise,I=!1;const{BYTES_PER_ELEMENT:j}=Int32Array,{BYTES_PER_ELEMENT:B}=Uint16Array,{notify:R}=i,W=new TextDecoder("utf-16"),D=new WeakSet,L=(...e)=>(D.add(e),e);let O="";const U=(e,t,s,r)=>{const[n]=r,a=s.get(n);if(!a)throw new Error(`Unknown proxy.${n}()`);e(a,t,r)};let _=0;const N=([e,t,s,r,n,a,o,c,i],l)=>(...p)=>{let u=""!==O,f=0;u&&"="!==O[0]&&"-"!==O[0]&&(f=((e,t)=>setTimeout(console.warn,3e3,`💀🔒 - proxy.${e}() in proxy.${t}()`))(l,O));const d=_++,y=[];D.has(p.at(-1)||y)&&D.delete(y=p.pop());const w=s(c?p.map(c):p);let g=t(2*j);return o([e,2,l,d,g,w,r],{transfer:y}),i(g,0).value.then((()=>{u&&clearTimeout(f);const s=g[1];if(!s)return;const r=B*s;return g=t(r+r%j),o([e,1,d,g]),i(g,0).value.then((()=>{const e=new Uint16Array(g.buffer),t=a?e.subarray(0,s):e.slice(0,s);return n(W.decode(t))}))}))},q=(e,t)=>new Proxy(t,{get:(t,s)=>{let r;return"then"!==s&&(r=t.get(s),r||(r=N(e,s),t.set(s,r))),r},set:(e,t,s)=>"then"!==t&&!!e.set(t,s)}),{wait:z,waitAsync:C}=i;var H=({parse:e,stringify:t,transform:s,interrupt:r}=JSON)=>{const n=((e,t)=>async(s,r,[n,a,o,c,i])=>{i&&(O=n);try{const n=await s(...c);if(void 0!==n){const s=e(t?t(n):n);r.set(a,s),o[1]=s.length}}finally{i&&(O=""),o[0]=1,R(o,0)}})(t,s),a=p(),o=new Map,c=new Map;let i="",l=z;if(z&&r){const{handler:e,timeout:t=42}=r;l=(s,r,n)=>{for(;"timed-out"===(n=z(s,r,0,t));)e();return n}}return M("message",(t=>{if(g(t,i)){const[r,p,...u]=t.data;switch(p){case 0:{const t=!!z;i=r,a.resolve({polyfill:P,sync:t,transfer:L,proxy:q([i,e=>new k(new b(e)),S,t,e,P,x,s,t?(...e)=>({value:{then:t=>t(l(...e))}}):C],o)});break}case 2:o.size?U(n,c,o,u):setTimeout(U,0,n,c,o,u);break;case 1:((e,[t,s])=>{const r=e.get(t);e.delete(t);for(let e=new Uint16Array(s.buffer),t=0,{length:n}=r;t<n;t++)e[t]=r.charCodeAt(t);R(s,0)})(c,u)}}})),a.promise};export{H as default};
