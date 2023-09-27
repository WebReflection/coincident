const e="object"==typeof self?self:globalThis,t=t=>((t,r)=>{const s=(e,r)=>(t.set(r,e),e),n=a=>{if(t.has(a))return t.get(a);const[o,c]=r[a];switch(o){case 0:case-1:return s(c,a);case 1:{const e=s([],a);for(const t of c)e.push(n(t));return e}case 2:{const e=s({},a);for(const[t,r]of c)e[n(t)]=n(r);return e}case 3:return s(new Date(c),a);case 4:{const{source:e,flags:t}=c;return s(new RegExp(e,t),a)}case 5:{const e=s(new Map,a);for(const[t,r]of c)e.set(n(t),n(r));return e}case 6:{const e=s(new Set,a);for(const t of c)e.add(n(t));return e}case 7:{const{name:t,message:r}=c;return s(new e[t](r),a)}case 8:return s(BigInt(c),a);case"BigInt":return s(Object(BigInt(c)),a)}return s(new e[o](c),a)};return n})(new Map,t)(0),r="",{toString:s}={},{keys:n}=Object,a=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const n=s.call(e).slice(8,-1);switch(n){case"Array":return[1,r];case"Object":return[2,r];case"Date":return[3,r];case"RegExp":return[4,r];case"Map":return[5,r];case"Set":return[6,r]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},o=([e,t])=>0===e&&("function"===t||"symbol"===t),c=(e,{json:t,lossy:r}={})=>{const s=[];return((e,t,r,s)=>{const c=(e,t)=>{const n=s.push(e)-1;return r.set(t,n),n},i=s=>{if(r.has(s))return r.get(s);let[u,f]=a(s);switch(u){case 0:{let t=s;switch(f){case"bigint":u=8,t=s.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+f);t=null;break;case"undefined":return c([-1],s)}return c([u,t],s)}case 1:{if(f)return c([f,[...s]],s);const e=[],t=c([u,e],s);for(const t of s)e.push(i(t));return t}case 2:{if(f)switch(f){case"BigInt":return c([f,s.toString()],s);case"Boolean":case"Number":case"String":return c([f,s.valueOf()],s)}if(t&&"toJSON"in s)return i(s.toJSON());const r=[],l=c([u,r],s);for(const t of n(s))!e&&o(a(s[t]))||r.push([i(t),i(s[t])]);return l}case 3:return c([u,s.toISOString()],s);case 4:{const{source:e,flags:t}=s;return c([u,{source:e,flags:t}],s)}case 5:{const t=[],r=c([u,t],s);for(const[r,n]of s)(e||!o(a(r))&&!o(a(n)))&&t.push([i(r),i(n)]);return r}case 6:{const t=[],r=c([u,t],s);for(const r of s)!e&&o(a(r))||t.push(i(r));return r}}const{message:l}=s;return c([u,{name:f,message:l}],s)};return i})(!(t||r),!!t,new Map,s)(e),s},{parse:i,stringify:u}=JSON,f={json:!0,lossy:!0};var l=Object.freeze({__proto__:null,parse:e=>t(i(e)),stringify:e=>u(c(e,f))});const g="cb511e41-9ebf-4af3-a74a-83c295a50833";var p=e=>({value:new Promise((t=>{let r=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");r.onmessage=t,r.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:w,Map:h,SharedArrayBuffer:y,Uint16Array:d}=globalThis,{BYTES_PER_ELEMENT:b}=w,{BYTES_PER_ELEMENT:m}=d,{isArray:S}=Array,{notify:E,wait:A,waitAsync:O}=Atomics,{fromCharCode:M}=String,v=new WeakSet,T=new WeakMap;let j=0;const B=(e,{parse:t=JSON.parse,stringify:r=JSON.stringify,transform:s,interrupt:n}=JSON)=>{if(!T.has(e)){const a=(t,...r)=>e.postMessage({[g]:r},{transfer:t}),o="function"==typeof n?n:n?.handler||(()=>{}),c=n?.delay||42,i=(e,t)=>e?(O||p)(t,0):(((e,t,r)=>{for(;"timed-out"===A(e,0,0,t);)r()})(t,c,o),{value:{then:e=>e()}});let u=!1;T.set(e,new Proxy(new h,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(r,n)=>"then"===n?null:(...r)=>{const o=j++;let c=new w(new y(b)),f=[];v.has(r.at(-1)||f)&&v.delete(f=r.pop()),a(f,o,c,n,s?r.map(s):r);const l=e!==globalThis;let g=0;return u&&l&&(g=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${n}(...args) is awaited`)),i(l,c).value.then((()=>{clearTimeout(g);const e=c[0];if(!e)return;const r=m*e;return c=new w(new y(r+r%b)),a([],o,c),i(l,c).value.then((()=>t(M(...new d(c.buffer).slice(0,e)))))}))},set(t,n,a){if(!t.size){const n=new h;e.addEventListener("message",(async e=>{const a=e.data?.[g];if(S(a)){e.stopImmediatePropagation();const[o,c,...i]=a;if(i.length){const[e,a]=i;if(!t.has(e))throw new Error(`Unsupported action: ${e}`);u=!0;try{const i=await t.get(e)(...a);if(void 0!==i){const e=r(s?s(i):i);n.set(o,e),c[0]=e.length}}finally{u=!1}}else{const e=n.get(o);n.delete(o);for(let t=new d(c.buffer),r=0;r<e.length;r++)t[r]=e.charCodeAt(r)}E(c,0)}}))}return!!t.set(n,a)}}))}return T.get(e)},N=(e,t)=>B(e,{...l,...t});N.transfer=B.transfer=(...e)=>(v.add(e),e);export{N as default};
