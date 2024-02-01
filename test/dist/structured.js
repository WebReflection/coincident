const e="object"==typeof self?self:globalThis,t=t=>((t,s)=>{const n=(e,s)=>(t.set(s,e),e),r=a=>{if(t.has(a))return t.get(a);const[o,c]=s[a];switch(o){case 0:case-1:return n(c,a);case 1:{const e=n([],a);for(const t of c)e.push(r(t));return e}case 2:{const e=n({},a);for(const[t,s]of c)e[r(t)]=r(s);return e}case 3:return n(new Date(c),a);case 4:{const{source:e,flags:t}=c;return n(new RegExp(e,t),a)}case 5:{const e=n(new Map,a);for(const[t,s]of c)e.set(r(t),r(s));return e}case 6:{const e=n(new Set,a);for(const t of c)e.add(r(t));return e}case 7:{const{name:t,message:s}=c;return n(new e[t](s),a)}case 8:return n(BigInt(c),a);case"BigInt":return n(Object(BigInt(c)),a)}return n(new e[o](c),a)};return r})(new Map,t)(0),s="",{toString:n}={},{keys:r}=Object,a=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const r=n.call(e).slice(8,-1);switch(r){case"Array":return[1,s];case"Object":return[2,s];case"Date":return[3,s];case"RegExp":return[4,s];case"Map":return[5,s];case"Set":return[6,s]}return r.includes("Array")?[1,r]:r.includes("Error")?[7,r]:[2,r]},o=([e,t])=>0===e&&("function"===t||"symbol"===t),c=(e,{json:t,lossy:s}={})=>{const n=[];return((e,t,s,n)=>{const c=(e,t)=>{const r=n.push(e)-1;return s.set(t,r),r},i=n=>{if(s.has(n))return s.get(n);let[u,f]=a(n);switch(u){case 0:{let t=n;switch(f){case"bigint":u=8,t=n.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+f);t=null;break;case"undefined":return c([-1],n)}return c([u,t],n)}case 1:{if(f)return c([f,[...n]],n);const e=[],t=c([u,e],n);for(const t of n)e.push(i(t));return t}case 2:{if(f)switch(f){case"BigInt":return c([f,n.toString()],n);case"Boolean":case"Number":case"String":return c([f,n.valueOf()],n)}if(t&&"toJSON"in n)return i(n.toJSON());const s=[],l=c([u,s],n);for(const t of r(n))!e&&o(a(n[t]))||s.push([i(t),i(n[t])]);return l}case 3:return c([u,n.toISOString()],n);case 4:{const{source:e,flags:t}=n;return c([u,{source:e,flags:t}],n)}case 5:{const t=[],s=c([u,t],n);for(const[s,r]of n)(e||!o(a(s))&&!o(a(r)))&&t.push([i(s),i(r)]);return s}case 6:{const t=[],s=c([u,t],n);for(const s of n)!e&&o(a(s))||t.push(i(s));return s}}const{message:l}=n;return c([u,{name:f,message:l}],n)};return i})(!(t||s),!!t,new Map,n)(e),n},{parse:i,stringify:u}=JSON,f={json:!0,lossy:!0};var l=Object.freeze({__proto__:null,parse:e=>t(i(e)),stringify:e=>u(c(e,f))});const g="function",p="077d73a2-2406-4ea9-85cc-6a2b19e8fef8",{isArray:w}=Array;let{SharedArrayBuffer:d,window:h}=globalThis,{notify:y,wait:b,waitAsync:m}=Atomics,E=null;m||(m=e=>({value:new Promise((t=>{let s=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");s.onmessage=t,s.postMessage(e)}))}));try{new d(4)}catch(e){d=ArrayBuffer;const t=new WeakMap;if(h){const e=new Map,{prototype:{postMessage:s}}=Worker,n=async t=>{const s=t.data?.[p];if(!w(s)){t.stopImmediatePropagation();const{id:n,sb:r}=s;e.get(n)(r)}};E=function(e,...r){const a=e?.[p];if(w(a)){const[e,s]=a;t.set(s,e),this.addEventListener("message",n)}return s.call(this,e,...r)},m=s=>({value:new Promise((n=>{e.set(t.get(s),n)})).then((n=>{e.delete(t.get(s)),t.delete(s);for(let e=0;e<n.length;e++)s[e]=n[e];return"ok"}))})}else{const e=(e,t)=>({[p]:{id:e,sb:t}});y=s=>{postMessage(e(t.get(s),s))},addEventListener("message",(async e=>{const s=e.data?.[p];if(w(s)){const[e,n]=s;t.set(n,e)}}))}}
/*! (c) Andrea Giammarchi - ISC */const{Int32Array:S,Map:M,Uint16Array:A}=globalThis,{BYTES_PER_ELEMENT:v}=S,{BYTES_PER_ELEMENT:O}=A,T=new WeakSet,k=new WeakMap,B={value:{then:e=>e()}};let j=0;const N=(e,{parse:t=JSON.parse,stringify:s=JSON.stringify,transform:n,interrupt:r}=JSON)=>{if(!k.has(e)){const a=E||e.postMessage,o=(t,...s)=>a.call(e,{[p]:s},{transfer:t}),c=typeof r===g?r:r?.handler,i=r?.delay||42,u=new TextDecoder("utf-16"),f=(e,t)=>e?m(t,0):(c?((e,t,s)=>{for(;"timed-out"===b(e,0,0,t);)s()})(t,i,c):b(t,0),B);let l=!1;k.set(e,new Proxy(new M,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(s,r)=>"then"===r?null:(...s)=>{const a=j++;let c=new S(new d(2*v)),i=[];T.has(s.at(-1)||i)&&T.delete(i=s.pop()),o(i,a,c,r,n?s.map(n):s);const g=e!==globalThis;let p=0;return l&&g&&(p=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),f(g,c).value.then((()=>{clearTimeout(p);const e=c[1];if(!e)return;const s=O*e;return c=new S(new d(s+s%v)),o([],a,c),f(g,c).value.then((()=>t(u.decode(new A(c.buffer).slice(0,e)))))}))},set(t,r,a){const o=typeof a;if(o!==g)throw new Error(`Unable to assign ${r} as ${o}`);if(!t.size){const r=new M;e.addEventListener("message",(async e=>{const a=e.data?.[p];if(w(a)){e.stopImmediatePropagation();const[o,c,...i]=a;let u;if(i.length){const[e,a]=i;if(t.has(e)){l=!0;try{const i=await t.get(e)(...a);if(void 0!==i){const e=s(n?n(i):i);r.set(o,e),c[1]=e.length}}catch(e){u=e}finally{l=!1}}else u=new Error(`Unsupported action: ${e}`);c[0]=1}else{const e=r.get(o);r.delete(o);for(let t=new A(c.buffer),s=0;s<e.length;s++)t[s]=e.charCodeAt(s)}if(y(c,0),u)throw u}}))}return!!t.set(r,a)}}))}return k.get(e)},_=(e,t)=>N(e,{...l,...t});_.transfer=N.transfer=(...e)=>(T.add(e),e);export{_ as default};
