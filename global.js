var e="4c9d14a5-5462-4074-b208-d8633aa2f6e9",t=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,"+encodeURIComponent("onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))"));n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:n,Map:r,SharedArrayBuffer:s,Uint16Array:a}=globalThis,{BYTES_PER_ELEMENT:o}=n,{BYTES_PER_ELEMENT:i}=a,{isArray:c}=Array,{notify:l,wait:p,waitAsync:f}=Atomics,{fromCharCode:u}=String,g=(e,n)=>e?(f||t)(n,0):(p(n,0),{value:{then:e=>e()}}),y=new WeakSet,w=new WeakMap;let d=0;const h=(t,{parse:p,stringify:f}=JSON)=>{if(!w.has(t)){const h=(n,...r)=>t.postMessage({[e]:r},{transfer:n});w.set(t,new Proxy(new r,{get:(e,r)=>"then"===r?null:(...e)=>{const c=d++;let l=new n(new s(o)),f=[];y.has(e.at(-1)||f)&&y.delete(f=e.pop()),h(f,c,l,r,e);const w=t instanceof Worker;return g(w,l).value.then((()=>{const e=l[0];if(!e)return;const t=i*e;return l=new n(new s(t+t%o)),h([],c,l),g(w,l).value.then((()=>p(u(...new a(l.buffer).slice(0,e)))))}))},set(n,s,o){if(!n.size){const s=new r;t.addEventListener("message",(async t=>{const r=t.data?.[e];if(c(r)){t.stopImmediatePropagation();const[e,o,...i]=r;if(i.length){const[t,r]=i;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);{const a=f(await n.get(t)(...r));a&&(s.set(e,a),o[0]=a.length)}}else{const t=s.get(e);s.delete(e);for(let e=new a(o.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}l(o,0)}}))}return!!n.set(s,o)}}))}return w.get(t)};h.transfer=(...e)=>(y.add(e),e);const m="object",v="function",b="number",E="string",M="undefined",P="symbol",{defineProperty:k,getOwnPropertyDescriptor:S,getPrototypeOf:T,isExtensible:x,ownKeys:A,preventExtensions:W,set:R,setPrototypeOf:O}=Reflect,L=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},C=(e,t)=>[e,t],U=e=>t=>{const n=typeof t;switch(n){case m:if(null==t)return C("null",t);case v:return e(n,t);case"boolean":case b:case E:case M:case"bigint":return C(n,t);case P:if(_.has(t))return C(n,_.get(t))}throw new Error(`Unable to handle this ${n} type`)},_=new Map(A(Symbol).filter((e=>typeof Symbol[e]===P)).map((e=>[Symbol[e],e]))),z=e=>{for(const[t,n]of _)if(n===e)return t},B="apply",I="construct",N="defineProperty",j="deleteProperty",D="get",F="getOwnPropertyDescriptor",K="getPrototypeOf",Y="has",$="isExtensible",G="ownKeys",J="preventExtensions",q="set",H="setPrototypeOf",Q="delete";let V=0;const X=new Map,Z=new Map,ee=new WeakMap,{addEventListener:te}=EventTarget.prototype;k(EventTarget.prototype,"addEventListener",{value(e,t,...n){return n.at(0)?.invoke&&(ee.has(this)||ee.set(this,new Map),ee.get(this).set(e,[].concat(n[0].invoke)),delete n[0].invoke),te.call(this,e,t,...n)}});const ne=U(((e,t)=>{if(!X.has(t)){let e;for(;Z.has(e=V++););X.set(t,e),Z.set(e,t)}return C(e,X.get(t))}));var re=(e,t,n)=>{const{[n]:r}=e,s=new FinalizationRegistry((e=>{r(Q,C(E,e))})),a=([e,t])=>{switch(e){case m:return null==t?globalThis:typeof t===b?Z.get(t):t;case v:if(typeof t===E){if(!Z.has(t)){const e=function(...e){return e.at(0)instanceof Event&&(e=>{const{currentTarget:t,target:n,type:r}=e;for(const s of ee.get(t||n)?.get(r)||[])e[s]()})(...e),r(B,C(v,t),ne(this),e.map(ne))},n=new WeakRef(e);Z.set(t,n),s.register(e,t,n)}return Z.get(t).deref()}return Z.get(t);case P:return z(t)}return t},o={[B]:(e,t,n)=>ne(e.apply(t,n)),[I]:(e,t)=>ne(new e(...t)),[N]:(e,t,n)=>ne(k(e,t,n)),[j]:(e,t)=>ne(delete e[t]),[K]:e=>ne(T(e)),[D]:(e,t)=>ne(e[t]),[F]:(e,t)=>{const n=S(e,t);return n?C(m,L(n,ne)):C(M,n)},[Y]:(e,t)=>ne(t in e),[$]:e=>ne(x(e)),[G]:e=>C(m,A(e).map(ne)),[J]:e=>ne(W(e)),[q]:(e,t,n)=>ne(R(e,t,n)),[H]:(e,t)=>ne(O(e,t)),[Q](e){X.delete(Z.get(e)),Z.delete(e)}};return e[t]=(e,t,...n)=>{switch(e){case B:n[0]=a(n[0]),n[1]=n[1].map(a);break;case I:n[0]=n[0].map(a);break;case N:{const[e,t]=n;n[0]=a(e);const{get:r,set:s,value:o}=t;r&&(t.get=a(r)),s&&(t.set=a(s)),o&&(t.value=a(o));break}default:n=n.map(a)}return o[e](a(t),...n)},e};const se=e=>typeof e===v?e():e,ae=U(((e,t)=>{if(oe in t)return se(t[oe]);if(e===v){if(!le.has(t)){let e;for(;le.has(e=String(ie++)););ce.set(t,e),le.set(e,t)}return C(e,ce.get(t))}return C(e,t)})),oe=Symbol();let ie=0;const ce=new Map,le=new Map;var pe=(e,t,n)=>{const{[t]:r}=e,s=new Map,a=new FinalizationRegistry((e=>{s.delete(e),r(Q,ae(e))})),o=e=>{const[t,n]=e;if(!s.has(n)){const r=t===v?fe.bind(e):e,o=new Proxy(r,l),i=new WeakRef(o);s.set(n,i),a.register(o,n,i)}return s.get(n).deref()},i=e=>{const[t,n]=e;switch(t){case m:return typeof n===b?o(e):n;case v:return typeof n===E?le.get(n):o(e);case P:return z(n)}return n},c=(e,t,...n)=>i(r(e,se(t),...n)),l={[B]:(e,t,n)=>c(B,e,ae(t),n.map(ae)),[I]:(e,t)=>c(I,e,t.map(ae)),[N]:(e,t,n)=>{const{get:r,set:s,value:a}=n;return typeof r===v&&(n.get=ae(r)),typeof s===v&&(n.set=ae(s)),typeof a===v&&(n.value=ae(a)),c(N,e,ae(t),n)},[j]:(e,t)=>c(j,e,ae(t)),[K]:e=>c(K,e),[D]:(e,t)=>t===oe?e:c(D,e,ae(t)),[F]:(e,t)=>{const n=c(F,e,ae(t));return n&&L(n,i)},[Y]:(e,t)=>t===oe||c(Y,e,ae(t)),[$]:e=>c($,e),[G]:e=>c(G,e).map(i),[J]:e=>c(J,e),[q]:(e,t,n)=>c(q,e,ae(t),ae(n)),[H]:(e,t)=>c(H,e,ae(t))};return e[n]=(e,t,n,r)=>{switch(e){case B:return i(t).apply(i(n),r.map(i));case Q:{const e=i(t);ce.delete(le.get(e)),le.delete(e)}}},{proxy:e,global:new Proxy([m,null],l),isGlobal:e=>typeof e===m&&!!e&&oe in e}};function fe(){return this}const ue=e+"M",ge=e+"T",ye=new WeakMap,we=(e,...t)=>{const n=h(e,...t);if(!ye.has(n)){const t=e instanceof Worker?re:pe;ye.set(n,t(n,ue,ge))}return ye.get(n)};we.transfer=h.transfer;export{we as default};
