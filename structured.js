const e="object"==typeof self?self:globalThis,t=t=>((t,r)=>{const s=(e,r)=>(t.set(r,e),e),n=a=>{if(t.has(a))return t.get(a);const[o,c]=r[a];switch(o){case 0:case-1:return s(c,a);case 1:{const e=s([],a);for(const t of c)e.push(n(t));return e}case 2:{const e=s({},a);for(const[t,r]of c)e[n(t)]=n(r);return e}case 3:return s(new Date(c),a);case 4:{const{source:e,flags:t}=c;return s(new RegExp(e,t),a)}case 5:{const e=s(new Map,a);for(const[t,r]of c)e.set(n(t),n(r));return e}case 6:{const e=s(new Set,a);for(const t of c)e.add(n(t));return e}case 7:{const{name:t,message:r}=c;return s(new e[t](r),a)}case 8:return s(BigInt(c),a);case"BigInt":return s(Object(BigInt(c)),a)}return s(new e[o](c),a)};return n})(new Map,t)(0),r="",{toString:s}={},{keys:n}=Object,a=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const n=s.call(e).slice(8,-1);switch(n){case"Array":return[1,r];case"Object":return[2,r];case"Date":return[3,r];case"RegExp":return[4,r];case"Map":return[5,r];case"Set":return[6,r]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},o=([e,t])=>0===e&&("function"===t||"symbol"===t),c=(e,{json:t,lossy:r}={})=>{const s=[];return((e,t,r,s)=>{const c=(e,t)=>{const n=s.push(e)-1;return r.set(t,n),n},u=s=>{if(r.has(s))return r.get(s);let[i,f]=a(s);switch(i){case 0:{let t=s;switch(f){case"bigint":i=8,t=s.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+f);t=null;break;case"undefined":return c([-1],s)}return c([i,t],s)}case 1:{if(f)return c([f,[...s]],s);const e=[],t=c([i,e],s);for(const t of s)e.push(u(t));return t}case 2:{if(f)switch(f){case"BigInt":return c([f,s.toString()],s);case"Boolean":case"Number":case"String":return c([f,s.valueOf()],s)}if(t&&"toJSON"in s)return u(s.toJSON());const r=[],l=c([i,r],s);for(const t of n(s))!e&&o(a(s[t]))||r.push([u(t),u(s[t])]);return l}case 3:return c([i,s.toISOString()],s);case 4:{const{source:e,flags:t}=s;return c([i,{source:e,flags:t}],s)}case 5:{const t=[],r=c([i,t],s);for(const[r,n]of s)(e||!o(a(r))&&!o(a(n)))&&t.push([u(r),u(n)]);return r}case 6:{const t=[],r=c([i,t],s);for(const r of s)!e&&o(a(r))||t.push(u(r));return r}}const{message:l}=s;return c([i,{name:f,message:l}],s)};return u})(!(t||r),!!t,new Map,s)(e),s},{parse:u,stringify:i}=JSON,f={json:!0,lossy:!0};var l=Object.freeze({__proto__:null,parse:e=>t(u(e)),stringify:e=>i(c(e,f))});const g="1c9b79f5-1bdd-476e-869f-dcdcb32c9674";var p=e=>({value:new Promise((t=>{let r=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");r.onmessage=t,r.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:w,Map:h,SharedArrayBuffer:d,Uint16Array:y}=globalThis,{BYTES_PER_ELEMENT:b}=w,{BYTES_PER_ELEMENT:m}=y,{isArray:E}=Array,{notify:S,wait:A,waitAsync:M}=Atomics,{fromCharCode:O}=String,j=(e,t)=>e?(M||p)(t,0):(A(t,0),{value:{then:e=>e()}}),v=new WeakSet,B=new WeakMap;let _=0;const k=(e,{parse:t,stringify:r}=JSON)=>{if(!B.has(e)){const s=(t,...r)=>e.postMessage({[g]:r},{transfer:t});B.set(e,new Proxy(new h,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(r,n)=>"then"===n?null:(...r)=>{const a=_++;let o=new w(new d(b)),c=[];v.has(r.at(-1)||c)&&v.delete(c=r.pop()),s(c,a,o,n,r);const u=e instanceof Worker;return j(u,o).value.then((()=>{const e=o[0];if(!e)return;const r=m*e;return o=new w(new d(r+r%b)),s([],a,o),j(u,o).value.then((()=>t(O(...new y(o.buffer).slice(0,e)))))}))},set(t,s,n){if(!t.size){const s=new h;e.addEventListener("message",(async e=>{const n=e.data?.[g];if(E(n)){e.stopImmediatePropagation();const[a,o,...c]=n;if(c.length){const[e,n]=c;if(!t.has(e))throw new Error(`Unsupported action: ${e}`);{const c=r(await t.get(e)(...n));c&&(s.set(a,c),o[0]=c.length)}}else{const e=s.get(a);s.delete(a);for(let t=new y(o.buffer),r=0;r<e.length;r++)t[r]=e.charCodeAt(r)}S(o,0)}}))}return!!t.set(s,n)}}))}return B.get(e)},I=e=>k(e,l);I.transfer=k.transfer=(...e)=>(v.add(e),e);export{I as default};
