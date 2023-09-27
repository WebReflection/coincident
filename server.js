Promise.withResolvers||(Promise.withResolvers=function(){var e,t,n=new this((function(n,r){e=n,t=r}));return{resolve:e,reject:t,promise:n}});const e="5f50bb1c-57c3-47af-b36a-392fe80f8803",t="M"+e,n="T"+e,r="apply",s="construct",o="defineProperty",a="deleteProperty",c="get",i="getOwnPropertyDescriptor",u="getPrototypeOf",f="has",l="isExtensible",p="ownKeys",g="preventExtensions",y="set",w="setPrototypeOf",d="delete",h="object",m="function",b="number",v="string",E="undefined",S="symbol",{defineProperty:M,getOwnPropertyDescriptor:P,getPrototypeOf:A,isExtensible:T,ownKeys:k,preventExtensions:O,set:x,setPrototypeOf:R}=Reflect,{assign:j,create:W}=Object,B=A(Int8Array),I="isArray",L=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},N=(e,t)=>[e,t],_=e=>t=>{const n=typeof t;switch(n){case h:if(null==t)return N("null",t);if(t===globalThis)return N(h,null);case m:return e(n,t);case"boolean":case b:case v:case E:case"bigint":return N(n,t);case S:if(D.has(t))return N(n,D.get(t))}throw new Error(`Unable to handle this ${n} type`)},D=new Map(k(Symbol).filter((e=>typeof Symbol[e]===S)).map((e=>[Symbol[e],e]))),C=e=>{for(const[t,n]of D)if(n===e)return t};function J(){return this}const $="object"==typeof self?self:globalThis,z=e=>((e,t)=>{const n=(t,n)=>(e.set(n,t),t),r=s=>{if(e.has(s))return e.get(s);const[o,a]=t[s];switch(o){case 0:case-1:return n(a,s);case 1:{const e=n([],s);for(const t of a)e.push(r(t));return e}case 2:{const e=n({},s);for(const[t,n]of a)e[r(t)]=r(n);return e}case 3:return n(new Date(a),s);case 4:{const{source:e,flags:t}=a;return n(new RegExp(e,t),s)}case 5:{const e=n(new Map,s);for(const[t,n]of a)e.set(r(t),r(n));return e}case 6:{const e=n(new Set,s);for(const t of a)e.add(r(t));return e}case 7:{const{name:e,message:t}=a;return n(new $[e](t),s)}case 8:return n(BigInt(a),s);case"BigInt":return n(Object(BigInt(a)),s)}return n(new $[o](a),s)};return r})(new Map,e)(0),U="",{toString:F}={},{keys:K}=Object,Y=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const n=F.call(e).slice(8,-1);switch(n){case"Array":return[1,U];case"Object":return[2,U];case"Date":return[3,U];case"RegExp":return[4,U];case"Map":return[5,U];case"Set":return[6,U]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},q=([e,t])=>0===e&&("function"===t||"symbol"===t),G=(e,{json:t,lossy:n}={})=>{const r=[];return((e,t,n,r)=>{const s=(e,t)=>{const s=r.push(e)-1;return n.set(t,s),s},o=r=>{if(n.has(r))return n.get(r);let[a,c]=Y(r);switch(a){case 0:{let t=r;switch(c){case"bigint":a=8,t=r.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+c);t=null;break;case"undefined":return s([-1],r)}return s([a,t],r)}case 1:{if(c)return s([c,[...r]],r);const e=[],t=s([a,e],r);for(const t of r)e.push(o(t));return t}case 2:{if(c)switch(c){case"BigInt":return s([c,r.toString()],r);case"Boolean":case"Number":case"String":return s([c,r.valueOf()],r)}if(t&&"toJSON"in r)return o(r.toJSON());const n=[],i=s([a,n],r);for(const t of K(r))!e&&q(Y(r[t]))||n.push([o(t),o(r[t])]);return i}case 3:return s([a,r.toISOString()],r);case 4:{const{source:e,flags:t}=r;return s([a,{source:e,flags:t}],r)}case 5:{const t=[],n=s([a,t],r);for(const[n,s]of r)(e||!q(Y(n))&&!q(Y(s)))&&t.push([o(n),o(s)]);return n}case 6:{const t=[],n=s([a,t],r);for(const n of r)!e&&q(Y(n))||t.push(o(n));return n}}const{message:i}=r;return s([a,{name:c,message:i}],r)};return o})(!(t||n),!!t,new Map,r)(e),r},{parse:H,stringify:Q}=JSON,V={json:!0,lossy:!0};var X=Object.freeze({__proto__:null,parse:e=>z(H(e)),stringify:e=>Q(G(e,V))}),Z=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:ee,Map:te,SharedArrayBuffer:ne,Uint16Array:re}=globalThis,{BYTES_PER_ELEMENT:se}=ee,{BYTES_PER_ELEMENT:oe}=re,{isArray:ae}=Array,{notify:ce,wait:ie,waitAsync:ue}=Atomics,{fromCharCode:fe}=String,le=new WeakSet,pe=new WeakMap,ge={value:{then:e=>e()}},ye=()=>{};let we=0;const de=(t,{parse:n=JSON.parse,stringify:r=JSON.stringify,transform:s,interrupt:o}=JSON)=>{if(!pe.has(t)){const a=(n,...r)=>t.postMessage({[e]:r},{transfer:n}),c="function"==typeof o?o:o?.handler||ye,i=o?.delay||42,u=(e,t)=>e?(ue||Z)(t,0):(((e,t,n)=>{for(;"timed-out"===ie(e,0,0,t);)n()})(t,i,c),ge);let f=!1;pe.set(t,new Proxy(new te,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(e,r)=>"then"===r?null:(...e)=>{const o=we++;let c=new ee(new ne(se)),i=[];le.has(e.at(-1)||i)&&le.delete(i=e.pop()),a(i,o,c,r,s?e.map(s):e);const l=t!==globalThis;let p=0;return f&&l&&(p=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),u(l,c).value.then((()=>{clearTimeout(p);const e=c[0];if(!e)return;const t=oe*e;return c=new ee(new ne(t+t%se)),a([],o,c),u(l,c).value.then((()=>n(fe(...new re(c.buffer).slice(0,e)))))}))},set(n,o,a){if(!n.size){const o=new te;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(ae(a)){t.stopImmediatePropagation();const[e,c,...i]=a;if(i.length){const[t,a]=i;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);f=!0;try{const i=await n.get(t)(...a);if(void 0!==i){const t=r(s?s(i):i);o.set(e,t),c[0]=t.length}}finally{f=!1}}else{const t=o.get(e);o.delete(e);for(let e=new re(c.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}ce(c,0)}}))}return!!n.set(o,a)}}))}return pe.get(t)},he=(e,t)=>de(e,{...X,...t});he.transfer=de.transfer=(...e)=>(le.add(e),e);var me=(e,t)=>{const n=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;M(EventTarget.prototype,"addEventListener",{value(t,r,...s){return s.at(0)?.invoke&&(n.has(this)||n.set(this,new Map),n.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,r,...s)}})}const I=t&&(e=>{const{currentTarget:t,target:r,type:s}=e;for(const o of n.get(t||r)?.get(s)||[])e[o]()});return(n,D,J,...$)=>{let z=0;const U=new Map,F=new Map,{[J]:K}=n,Y=$.length?j(W(globalThis),...$):globalThis,q=_(((e,t)=>{if(!U.has(t)){let e;for(;F.has(e=z++););U.set(t,e),F.set(e,t)}return N(e,U.get(t))})),G=new FinalizationRegistry((e=>{K(d,N(v,e))})),H=([e,n])=>{switch(e){case h:if(null==n)return Y;if(typeof n===b)return F.get(n);if(!(n instanceof B))for(const e in n)n[e]=H(n[e]);return n;case m:if(typeof n===v){if(!F.has(n)){const e=function(...e){return t&&e.at(0)instanceof Event&&I(...e),K(r,N(m,n),q(this),e.map(q))},s=new WeakRef(e);F.set(n,s),G.register(e,n,s)}return F.get(n).deref()}return F.get(n);case S:return C(n)}return n},Q={[r]:(e,t,n)=>q(e.apply(t,n)),[s]:(e,t)=>q(new e(...t)),[o]:(e,t,n)=>q(M(e,t,n)),[a]:(e,t)=>q(delete e[t]),[u]:e=>q(A(e)),[c]:(e,t)=>q(e[t]),[i]:(e,t)=>{const n=P(e,t);return n?N(h,L(n,q)):N(E,n)},[f]:(e,t)=>q(t in e),[l]:e=>q(T(e)),[p]:e=>N(h,k(e).map(q)),[g]:e=>q(O(e)),[y]:(e,t,n)=>q(x(e,t,n)),[w]:(e,t)=>q(R(e,t)),[d](e){U.delete(F.get(e)),F.delete(e)}};return n[D]=(e,t,...n)=>{switch(e){case r:n[0]=H(n[0]),n[1]=n[1].map(H);break;case s:n[0]=n[0].map(H);break;case o:{const[e,t]=n;n[0]=H(e);const{get:r,set:s,value:o}=t;r&&(t.get=H(r)),s&&(t.set=H(s)),o&&(t.value=H(o));break}default:n=n.map(H)}return Q[e](H(t),...n)},{proxy:n,[e.toLowerCase()]:Y,[`is${e}Proxy`]:()=>!1}}},be=me("Window",!0),ve=e=>{let t=0;const n=new Map,E=new Map,P=Symbol(),A=e=>typeof e===m?e():e,T=e=>typeof e===h&&!!e&&P in e,k=Array[I],O=_(((e,r)=>{if(P in r)return A(r[P]);if(e===m){if(!E.has(r)){let e;for(;E.has(e=String(t++)););n.set(r,e),E.set(e,r)}return N(e,n.get(r))}if(!(r instanceof B))for(const e in r)r[e]=O(r[e]);return N(e,r)}));return(t,x,R)=>{const{[x]:j}=t,W=new Map,B=new FinalizationRegistry((e=>{W.delete(e),j(d,O(e))})),N=e=>{const[t,n]=e;if(!W.has(n)){const r=t===m?J.bind(e):e,s=new Proxy(r,$),o=new WeakRef(s);W.set(n,o),B.register(s,n,o)}return W.get(n).deref()},_=e=>{const[t,n]=e;switch(t){case h:return null===n?globalThis:typeof n===b?N(e):n;case m:return typeof n===v?E.get(n):N(e);case S:return C(n)}return n},D=(e,t,...n)=>_(j(e,A(t),...n)),$={[r]:(e,t,n)=>D(r,e,O(t),n.map(O)),[s]:(e,t)=>D(s,e,t.map(O)),[o]:(e,t,n)=>{const{get:r,set:s,value:a}=n;return typeof r===m&&(n.get=O(r)),typeof s===m&&(n.set=O(s)),typeof a===m&&(n.value=O(a)),D(o,e,O(t),n)},[a]:(e,t)=>D(a,e,O(t)),[u]:e=>D(u,e),[c]:(e,t)=>t===P?e:D(c,e,O(t)),[i]:(e,t)=>{const n=D(i,e,O(t));return n&&L(n,_)},[f]:(e,t)=>t===P||D(f,e,O(t)),[l]:e=>D(l,e),[p]:e=>D(p,e).map(_),[g]:e=>D(g,e),[y]:(e,t,n)=>D(y,e,O(t),O(n)),[w]:(e,t)=>D(w,e,O(t))};t[R]=(e,t,s,o)=>{switch(e){case r:return _(t).apply(_(s),o.map(_));case d:{const e=_(t);n.delete(E.get(e)),E.delete(e)}}};const z=new Proxy([h,null],$),U=z.Array[I];return M(Array,I,{value:e=>T(e)?U(e):k(e)}),{[e.toLowerCase()]:z,[`is${e}Proxy`]:T,proxy:t}}},Ee=ve("Window"),Se=me("Server",!1),Me=ve("Server"),Pe="function"==typeof Worker?Worker:class{};const{parse:Ae,stringify:Te}=X,ke=!!globalThis.process,Oe=new WeakMap,xe=e=>{let t;return/^!(-?\d+)?/.test(e)&&(t=RegExp.$1,e=e.slice(1+t.length)),{id:t,result:e?Ae(e):void 0}},Re=ke?(e,t)=>e.on("connection",(e=>{e.once("message",(n=>{let s=0;const[o,a]=Ae(n),c=new Map,{[o]:i}=Se({[a]:async(t,...n)=>{const o=Te([t,...n]);if(t===r){const{promise:t,resolve:n}=Promise.withResolvers(),r=String(s++);return c.set(r,n),e.send("!"+r+o),await t}e.send("!"+o)}},o,a,t).proxy;e.on("close",(()=>{for(const[e,t]of c)t()})).on("message",(t=>{const{id:n,result:r}=xe(String(t));if(n){const e=c.get(n);c.delete(n),e(r)}else e.send(Te(i(...r)))})).send("")}))})):(e,r,...s)=>{const o=he(e,...s);if(!Oe.has(o)){const s=e instanceof Pe?je:We;Oe.set(o,s(e,o,t,n,r))}return Oe.get(o)};ke||(Re.transfer=he.transfer);const je=(e,t,n,r,s)=>(e.addEventListener("message",(({data:[e,n]})=>{const r="M"+e,o="T"+e,{[o]:a}=t;let c;t[r]=(...e)=>new Promise((t=>{c=t,s.send(Te(e))})),s.addEventListener("message",(()=>{s.addEventListener("message",(async({data:e})=>{const{id:t,result:n}=xe(e);if(null!=t){const e=a(...n);if(t){const n=await e;s.send("!"+t+(void 0===n?"":Te(n)))}}else c=c(n)})),Atomics.notify(n,0)}),{once:!0}),s.send(Te([r,o]))}),{once:!0}),be(t,n,r)),We=(e,t,n,r)=>{const s="S"+crypto.randomUUID(),o=new Int32Array(new SharedArrayBuffer(4));return e.postMessage([s,o]),Atomics.wait(o),j(Me(t,"M"+s,"T"+s),Ee(t,n,r))};export{Re as default};
