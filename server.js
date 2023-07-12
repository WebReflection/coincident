Promise.withResolvers||(Promise.withResolvers=function(){var e,t,n=new this((function(n,r){e=n,t=r}));return{resolve:e,reject:t,promise:n}});const e="1ac71136-6b6e-4427-96f9-571519ee49f7",t="M"+e,n="T"+e,r="apply",s="construct",o="defineProperty",a="deleteProperty",c="get",i="getOwnPropertyDescriptor",u="getPrototypeOf",l="has",f="isExtensible",p="ownKeys",g="preventExtensions",y="set",w="setPrototypeOf",h="delete",d="object",m="function",b="number",v="string",E="undefined",S="symbol",{defineProperty:M,getOwnPropertyDescriptor:P,getPrototypeOf:A,isExtensible:T,ownKeys:k,preventExtensions:O,set:x,setPrototypeOf:R}=Reflect,{assign:j,create:W}=Object,B=A(Int8Array),I="isArray",L=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},_=(e,t)=>[e,t],D=e=>t=>{const n=typeof t;switch(n){case d:if(null==t)return _("null",t);if(t===globalThis)return _(d,null);case m:return e(n,t);case"boolean":case b:case v:case E:case"bigint":return _(n,t);case S:if(C.has(t))return _(n,C.get(t))}throw new Error(`Unable to handle this ${n} type`)},C=new Map(k(Symbol).filter((e=>typeof Symbol[e]===S)).map((e=>[Symbol[e],e]))),N=e=>{for(const[t,n]of C)if(n===e)return t};function z(){return this}const U="object"==typeof self?self:globalThis,$=e=>((e,t)=>{const n=(t,n)=>(e.set(n,t),t),r=s=>{if(e.has(s))return e.get(s);const[o,a]=t[s];switch(o){case 0:case-1:return n(a,s);case 1:{const e=n([],s);for(const t of a)e.push(r(t));return e}case 2:{const e=n({},s);for(const[t,n]of a)e[r(t)]=r(n);return e}case 3:return n(new Date(a),s);case 4:{const{source:e,flags:t}=a;return n(new RegExp(e,t),s)}case 5:{const e=n(new Map,s);for(const[t,n]of a)e.set(r(t),r(n));return e}case 6:{const e=n(new Set,s);for(const t of a)e.add(r(t));return e}case 7:{const{name:e,message:t}=a;return n(new U[e](t),s)}case 8:return n(BigInt(a),s);case"BigInt":return n(Object(BigInt(a)),s)}return n(new U[o](a),s)};return r})(new Map,e)(0),J="",{toString:F}={},{keys:K}=Object,Y=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const n=F.call(e).slice(8,-1);switch(n){case"Array":return[1,J];case"Object":return[2,J];case"Date":return[3,J];case"RegExp":return[4,J];case"Map":return[5,J];case"Set":return[6,J]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},q=([e,t])=>0===e&&("function"===t||"symbol"===t),G=(e,{json:t,lossy:n}={})=>{const r=[];return((e,t,n,r)=>{const s=(e,t)=>{const s=r.push(e)-1;return n.set(t,s),s},o=r=>{if(n.has(r))return n.get(r);let[a,c]=Y(r);switch(a){case 0:{let t=r;switch(c){case"bigint":a=8,t=r.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+c);t=null;break;case"undefined":return s([-1],r)}return s([a,t],r)}case 1:{if(c)return s([c,[...r]],r);const e=[],t=s([a,e],r);for(const t of r)e.push(o(t));return t}case 2:{if(c)switch(c){case"BigInt":return s([c,r.toString()],r);case"Boolean":case"Number":case"String":return s([c,r.valueOf()],r)}if(t&&"toJSON"in r)return o(r.toJSON());const n=[],i=s([a,n],r);for(const t of K(r))!e&&q(Y(r[t]))||n.push([o(t),o(r[t])]);return i}case 3:return s([a,r.toISOString()],r);case 4:{const{source:e,flags:t}=r;return s([a,{source:e,flags:t}],r)}case 5:{const t=[],n=s([a,t],r);for(const[n,s]of r)(e||!q(Y(n))&&!q(Y(s)))&&t.push([o(n),o(s)]);return n}case 6:{const t=[],n=s([a,t],r);for(const n of r)!e&&q(Y(n))||t.push(o(n));return n}}const{message:i}=r;return s([a,{name:c,message:i}],r)};return o})(!(t||n),!!t,new Map,r)(e),r},{parse:H,stringify:Q}=JSON,V={json:!0,lossy:!0};var X=Object.freeze({__proto__:null,parse:e=>$(H(e)),stringify:e=>Q(G(e,V))}),Z=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:ee,Map:te,SharedArrayBuffer:ne,Uint16Array:re}=globalThis,{BYTES_PER_ELEMENT:se}=ee,{BYTES_PER_ELEMENT:oe}=re,{isArray:ae}=Array,{notify:ce,wait:ie,waitAsync:ue}=Atomics,{fromCharCode:le}=String,fe=(e,t)=>e?(ue||Z)(t,0):(ie(t,0),{value:{then:e=>e()}}),pe=new WeakSet,ge=new WeakMap;let ye=0;const we=(t,{parse:n,stringify:r}=JSON)=>{if(!ge.has(t)){const s=(n,...r)=>t.postMessage({[e]:r},{transfer:n});ge.set(t,new Proxy(new te,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(e,r)=>"then"===r?null:(...e)=>{const o=ye++;let a=new ee(new ne(se)),c=[];pe.has(e.at(-1)||c)&&pe.delete(c=e.pop()),s(c,o,a,r,e);const i=t instanceof Worker;return fe(i,a).value.then((()=>{const e=a[0];if(!e)return;const t=oe*e;return a=new ee(new ne(t+t%se)),s([],o,a),fe(i,a).value.then((()=>n(le(...new re(a.buffer).slice(0,e)))))}))},set(n,s,o){if(!n.size){const s=new te;t.addEventListener("message",(async t=>{const o=t.data?.[e];if(ae(o)){t.stopImmediatePropagation();const[e,a,...c]=o;if(c.length){const[t,o]=c;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);{const c=r(await n.get(t)(...o));c&&(s.set(e,c),a[0]=c.length)}}else{const t=s.get(e);s.delete(e);for(let e=new re(a.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}ce(a,0)}}))}return!!n.set(s,o)}}))}return ge.get(t)},he=e=>we(e,X);he.transfer=we.transfer=(...e)=>(pe.add(e),e);var de=(e,t)=>{const n=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;M(EventTarget.prototype,"addEventListener",{value(t,r,...s){return s.at(0)?.invoke&&(n.has(this)||n.set(this,new Map),n.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,r,...s)}})}const I=t&&(e=>{const{currentTarget:t,target:r,type:s}=e;for(const o of n.get(t||r)?.get(s)||[])e[o]()});return(n,C,z,...U)=>{let $=0;const J=new Map,F=new Map,{[z]:K}=n,Y=U.length?j(W(globalThis),...U):globalThis,q=D(((e,t)=>{if(!J.has(t)){let e;for(;F.has(e=$++););J.set(t,e),F.set(e,t)}return _(e,J.get(t))})),G=new FinalizationRegistry((e=>{K(h,_(v,e))})),H=([e,n])=>{switch(e){case d:if(null==n)return Y;if(typeof n===b)return F.get(n);if(!(n instanceof B))for(const e in n)n[e]=H(n[e]);return n;case m:if(typeof n===v){if(!F.has(n)){const e=function(...e){return t&&e.at(0)instanceof Event&&I(...e),K(r,_(m,n),q(this),e.map(q))},s=new WeakRef(e);F.set(n,s),G.register(e,n,s)}return F.get(n).deref()}return F.get(n);case S:return N(n)}return n},Q={[r]:(e,t,n)=>q(e.apply(t,n)),[s]:(e,t)=>q(new e(...t)),[o]:(e,t,n)=>q(M(e,t,n)),[a]:(e,t)=>q(delete e[t]),[u]:e=>q(A(e)),[c]:(e,t)=>q(e[t]),[i]:(e,t)=>{const n=P(e,t);return n?_(d,L(n,q)):_(E,n)},[l]:(e,t)=>q(t in e),[f]:e=>q(T(e)),[p]:e=>_(d,k(e).map(q)),[g]:e=>q(O(e)),[y]:(e,t,n)=>q(x(e,t,n)),[w]:(e,t)=>q(R(e,t)),[h](e){J.delete(F.get(e)),F.delete(e)}};return n[C]=(e,t,...n)=>{switch(e){case r:n[0]=H(n[0]),n[1]=n[1].map(H);break;case s:n[0]=n[0].map(H);break;case o:{const[e,t]=n;n[0]=H(e);const{get:r,set:s,value:o}=t;r&&(t.get=H(r)),s&&(t.set=H(s)),o&&(t.value=H(o));break}default:n=n.map(H)}return Q[e](H(t),...n)},{proxy:n,[e.toLowerCase()]:Y,[`is${e}Proxy`]:()=>!1}}},me=de("Window",!0),be=e=>{let t=0;const n=new Map,E=new Map,P=Symbol(),A=e=>typeof e===m?e():e,T=e=>typeof e===d&&!!e&&P in e,k=Array[I],O=D(((e,r)=>{if(P in r)return A(r[P]);if(e===m){if(!E.has(r)){let e;for(;E.has(e=String(t++)););n.set(r,e),E.set(e,r)}return _(e,n.get(r))}if(!(r instanceof B))for(const e in r)r[e]=O(r[e]);return _(e,r)}));return(t,x,R)=>{const{[x]:j}=t,W=new Map,B=new FinalizationRegistry((e=>{W.delete(e),j(h,O(e))})),_=e=>{const[t,n]=e;if(!W.has(n)){const r=t===m?z.bind(e):e,s=new Proxy(r,U),o=new WeakRef(s);W.set(n,o),B.register(s,n,o)}return W.get(n).deref()},D=e=>{const[t,n]=e;switch(t){case d:return null===n?globalThis:typeof n===b?_(e):n;case m:return typeof n===v?E.get(n):_(e);case S:return N(n)}return n},C=(e,t,...n)=>D(j(e,A(t),...n)),U={[r]:(e,t,n)=>{const s=t?.[0]===globalThis?globalThis:t;return C(r,e,O(s),n.map(O))},[s]:(e,t)=>C(s,e,t.map(O)),[o]:(e,t,n)=>{const{get:r,set:s,value:a}=n;return typeof r===m&&(n.get=O(r)),typeof s===m&&(n.set=O(s)),typeof a===m&&(n.value=O(a)),C(o,e,O(t),n)},[a]:(e,t)=>C(a,e,O(t)),[u]:e=>C(u,e),[c]:(e,t)=>t===P?e:C(c,e,O(t)),[i]:(e,t)=>{const n=C(i,e,O(t));return n&&L(n,D)},[l]:(e,t)=>t===P||C(l,e,O(t)),[f]:e=>C(f,e),[p]:e=>C(p,e).map(D),[g]:e=>C(g,e),[y]:(e,t,n)=>C(y,e,O(t),O(n)),[w]:(e,t)=>C(w,e,O(t))};t[R]=(e,t,s,o)=>{switch(e){case r:return D(t).apply(D(s),o.map(D));case h:{const e=D(t);n.delete(E.get(e)),E.delete(e)}}};const $=new Proxy([d,null],U),J=$.Array[I];return M(Array,I,{value:e=>T(e)?J(e):k(e)}),{[e.toLowerCase()]:$,[`is${e}Proxy`]:T,proxy:t}}},ve=be("Window"),Ee=de("Server",!1),Se=be("Server");const{parse:Me,stringify:Pe}=X,Ae=!!globalThis.process,Te=new WeakMap,ke=e=>{let t;return/^!(-?\d+)?/.test(e)&&(t=RegExp.$1,e=e.slice(1+t.length)),{id:t,result:e?Me(e):void 0}},Oe=Ae?(e,t)=>e.on("connection",(e=>{e.once("message",(n=>{let s=0;const[o,a]=Me(n),c=new Map,{[o]:i}=Ee({[a]:async(t,...n)=>{const o=Pe([t,...n]);if(t===r){const{promise:t,resolve:n}=Promise.withResolvers(),r=String(s++);return c.set(r,n),e.send("!"+r+o),await t}e.send("!"+o)}},o,a,t).proxy;e.on("close",(()=>{for(const[e,t]of c)t()})).on("message",(t=>{const{id:n,result:r}=ke(String(t));if(n){const e=c.get(n);c.delete(n),e(r)}else e.send(Pe(i(...r)))})).send("")}))})):(e,r)=>{const s=he(e);if(!Te.has(s)){const o=e instanceof Worker?xe:Re;Te.set(s,o(e,s,t,n,r))}return Te.get(s)};Ae||(Oe.transfer=he.transfer);const xe=(e,t,n,r,s)=>(e.addEventListener("message",(({data:[e,n]})=>{const r="M"+e,o="T"+e,{[o]:a}=t;let c;t[r]=(...e)=>new Promise((t=>{c=t,s.send(Pe(e))})),s.addEventListener("message",(()=>{s.addEventListener("message",(async({data:e})=>{const{id:t,result:n}=ke(e);if(null!=t){const e=a(...n);if(t){const n=await e;s.send("!"+t+(void 0===n?"":Pe(n)))}}else c=c(n)})),Atomics.notify(n,0)}),{once:!0}),s.send(Pe([r,o]))}),{once:!0}),me(t,n,r)),Re=(e,t,n,r)=>{const s="S"+crypto.randomUUID(),o=new Int32Array(new SharedArrayBuffer(4));return e.postMessage([s,o]),Atomics.wait(o),j(Se(t,"M"+s,"T"+s),ve(t,n,r))};export{Oe as default};
