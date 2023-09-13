Promise.withResolvers||(Promise.withResolvers=function(){var e,t,n=new this((function(n,r){e=n,t=r}));return{resolve:e,reject:t,promise:n}});const e="3099687a-04a9-4406-a08e-fd1602cb2a81",t="M"+e,n="T"+e,r="apply",s="construct",o="defineProperty",a="deleteProperty",c="get",i="getOwnPropertyDescriptor",u="getPrototypeOf",l="has",f="isExtensible",p="ownKeys",g="preventExtensions",y="set",w="setPrototypeOf",d="delete",h="object",m="function",b="number",v="string",E="undefined",S="symbol",{defineProperty:M,getOwnPropertyDescriptor:P,getPrototypeOf:A,isExtensible:T,ownKeys:k,preventExtensions:x,set:O,setPrototypeOf:R}=Reflect,{assign:j,create:W}=Object,B=A(Int8Array),I="isArray",L=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},_=(e,t)=>[e,t],D=e=>t=>{const n=typeof t;switch(n){case h:if(null==t)return _("null",t);if(t===globalThis)return _(h,null);case m:return e(n,t);case"boolean":case b:case v:case E:case"bigint":return _(n,t);case S:if(C.has(t))return _(n,C.get(t))}throw new Error(`Unable to handle this ${n} type`)},C=new Map(k(Symbol).filter((e=>typeof Symbol[e]===S)).map((e=>[Symbol[e],e]))),N=e=>{for(const[t,n]of C)if(n===e)return t};function $(){return this}const z="object"==typeof self?self:globalThis,U=e=>((e,t)=>{const n=(t,n)=>(e.set(n,t),t),r=s=>{if(e.has(s))return e.get(s);const[o,a]=t[s];switch(o){case 0:case-1:return n(a,s);case 1:{const e=n([],s);for(const t of a)e.push(r(t));return e}case 2:{const e=n({},s);for(const[t,n]of a)e[r(t)]=r(n);return e}case 3:return n(new Date(a),s);case 4:{const{source:e,flags:t}=a;return n(new RegExp(e,t),s)}case 5:{const e=n(new Map,s);for(const[t,n]of a)e.set(r(t),r(n));return e}case 6:{const e=n(new Set,s);for(const t of a)e.add(r(t));return e}case 7:{const{name:e,message:t}=a;return n(new z[e](t),s)}case 8:return n(BigInt(a),s);case"BigInt":return n(Object(BigInt(a)),s)}return n(new z[o](a),s)};return r})(new Map,e)(0),J="",{toString:F}={},{keys:K}=Object,Y=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const n=F.call(e).slice(8,-1);switch(n){case"Array":return[1,J];case"Object":return[2,J];case"Date":return[3,J];case"RegExp":return[4,J];case"Map":return[5,J];case"Set":return[6,J]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},q=([e,t])=>0===e&&("function"===t||"symbol"===t),G=(e,{json:t,lossy:n}={})=>{const r=[];return((e,t,n,r)=>{const s=(e,t)=>{const s=r.push(e)-1;return n.set(t,s),s},o=r=>{if(n.has(r))return n.get(r);let[a,c]=Y(r);switch(a){case 0:{let t=r;switch(c){case"bigint":a=8,t=r.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+c);t=null;break;case"undefined":return s([-1],r)}return s([a,t],r)}case 1:{if(c)return s([c,[...r]],r);const e=[],t=s([a,e],r);for(const t of r)e.push(o(t));return t}case 2:{if(c)switch(c){case"BigInt":return s([c,r.toString()],r);case"Boolean":case"Number":case"String":return s([c,r.valueOf()],r)}if(t&&"toJSON"in r)return o(r.toJSON());const n=[],i=s([a,n],r);for(const t of K(r))!e&&q(Y(r[t]))||n.push([o(t),o(r[t])]);return i}case 3:return s([a,r.toISOString()],r);case 4:{const{source:e,flags:t}=r;return s([a,{source:e,flags:t}],r)}case 5:{const t=[],n=s([a,t],r);for(const[n,s]of r)(e||!q(Y(n))&&!q(Y(s)))&&t.push([o(n),o(s)]);return n}case 6:{const t=[],n=s([a,t],r);for(const n of r)!e&&q(Y(n))||t.push(o(n));return n}}const{message:i}=r;return s([a,{name:c,message:i}],r)};return o})(!(t||n),!!t,new Map,r)(e),r},{parse:H,stringify:Q}=JSON,V={json:!0,lossy:!0};var X=Object.freeze({__proto__:null,parse:e=>U(H(e)),stringify:e=>Q(G(e,V))}),Z=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:ee,Map:te,SharedArrayBuffer:ne,Uint16Array:re}=globalThis,{BYTES_PER_ELEMENT:se}=ee,{BYTES_PER_ELEMENT:oe}=re,{isArray:ae}=Array,{notify:ce,wait:ie,waitAsync:ue}=Atomics,{fromCharCode:le}=String,fe=(e,t)=>e?(ue||Z)(t,0):(ie(t,0),{value:{then:e=>e()}}),pe=new WeakSet,ge=new WeakMap;let ye=0;const we=(t,{parse:n,stringify:r,transform:s}=JSON)=>{if(!ge.has(t)){const o=(n,...r)=>t.postMessage({[e]:r},{transfer:n});let a=!1;ge.set(t,new Proxy(new te,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(e,r)=>"then"===r?null:(...e)=>{const c=ye++;let i=new ee(new ne(se)),u=[];pe.has(e.at(-1)||u)&&pe.delete(u=e.pop()),o(u,c,i,r,s?e.map(s):e);const l=t!==globalThis;let f=0;return a&&l&&(f=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),fe(l,i).value.then((()=>{clearTimeout(f);const e=i[0];if(!e)return;const t=oe*e;return i=new ee(new ne(t+t%se)),o([],c,i),fe(l,i).value.then((()=>n(le(...new re(i.buffer).slice(0,e)))))}))},set(n,o,c){if(!n.size){const o=new te;t.addEventListener("message",(async t=>{const c=t.data?.[e];if(ae(c)){t.stopImmediatePropagation();const[e,i,...u]=c;if(u.length){const[t,c]=u;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);a=!0;try{const a=await n.get(t)(...c);if(void 0!==a){const t=r(s?s(a):a);o.set(e,t),i[0]=t.length}}finally{a=!1}}else{const t=o.get(e);o.delete(e);for(let e=new re(i.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}ce(i,0)}}))}return!!n.set(o,c)}}))}return ge.get(t)},de=(e,t)=>we(e,{...X,...t});de.transfer=we.transfer=(...e)=>(pe.add(e),e);var he=(e,t)=>{const n=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;M(EventTarget.prototype,"addEventListener",{value(t,r,...s){return s.at(0)?.invoke&&(n.has(this)||n.set(this,new Map),n.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,r,...s)}})}const I=t&&(e=>{const{currentTarget:t,target:r,type:s}=e;for(const o of n.get(t||r)?.get(s)||[])e[o]()});return(n,C,$,...z)=>{let U=0;const J=new Map,F=new Map,{[$]:K}=n,Y=z.length?j(W(globalThis),...z):globalThis,q=D(((e,t)=>{if(!J.has(t)){let e;for(;F.has(e=U++););J.set(t,e),F.set(e,t)}return _(e,J.get(t))})),G=new FinalizationRegistry((e=>{K(d,_(v,e))})),H=([e,n])=>{switch(e){case h:if(null==n)return Y;if(typeof n===b)return F.get(n);if(!(n instanceof B))for(const e in n)n[e]=H(n[e]);return n;case m:if(typeof n===v){if(!F.has(n)){const e=function(...e){return t&&e.at(0)instanceof Event&&I(...e),K(r,_(m,n),q(this),e.map(q))},s=new WeakRef(e);F.set(n,s),G.register(e,n,s)}return F.get(n).deref()}return F.get(n);case S:return N(n)}return n},Q={[r]:(e,t,n)=>q(e.apply(t,n)),[s]:(e,t)=>q(new e(...t)),[o]:(e,t,n)=>q(M(e,t,n)),[a]:(e,t)=>q(delete e[t]),[u]:e=>q(A(e)),[c]:(e,t)=>q(e[t]),[i]:(e,t)=>{const n=P(e,t);return n?_(h,L(n,q)):_(E,n)},[l]:(e,t)=>q(t in e),[f]:e=>q(T(e)),[p]:e=>_(h,k(e).map(q)),[g]:e=>q(x(e)),[y]:(e,t,n)=>q(O(e,t,n)),[w]:(e,t)=>q(R(e,t)),[d](e){J.delete(F.get(e)),F.delete(e)}};return n[C]=(e,t,...n)=>{switch(e){case r:n[0]=H(n[0]),n[1]=n[1].map(H);break;case s:n[0]=n[0].map(H);break;case o:{const[e,t]=n;n[0]=H(e);const{get:r,set:s,value:o}=t;r&&(t.get=H(r)),s&&(t.set=H(s)),o&&(t.value=H(o));break}default:n=n.map(H)}return Q[e](H(t),...n)},{proxy:n,[e.toLowerCase()]:Y,[`is${e}Proxy`]:()=>!1}}},me=he("Window",!0),be=e=>{let t=0;const n=new Map,E=new Map,P=Symbol(),A=e=>typeof e===m?e():e,T=e=>typeof e===h&&!!e&&P in e,k=Array[I],x=D(((e,r)=>{if(P in r)return A(r[P]);if(e===m){if(!E.has(r)){let e;for(;E.has(e=String(t++)););n.set(r,e),E.set(e,r)}return _(e,n.get(r))}if(!(r instanceof B))for(const e in r)r[e]=x(r[e]);return _(e,r)}));return(t,O,R)=>{const{[O]:j}=t,W=new Map,B=new FinalizationRegistry((e=>{W.delete(e),j(d,x(e))})),_=e=>{const[t,n]=e;if(!W.has(n)){const r=t===m?$.bind(e):e,s=new Proxy(r,z),o=new WeakRef(s);W.set(n,o),B.register(s,n,o)}return W.get(n).deref()},D=e=>{const[t,n]=e;switch(t){case h:return null===n?globalThis:typeof n===b?_(e):n;case m:return typeof n===v?E.get(n):_(e);case S:return N(n)}return n},C=(e,t,...n)=>D(j(e,A(t),...n)),z={[r]:(e,t,n)=>C(r,e,x(t),n.map(x)),[s]:(e,t)=>C(s,e,t.map(x)),[o]:(e,t,n)=>{const{get:r,set:s,value:a}=n;return typeof r===m&&(n.get=x(r)),typeof s===m&&(n.set=x(s)),typeof a===m&&(n.value=x(a)),C(o,e,x(t),n)},[a]:(e,t)=>C(a,e,x(t)),[u]:e=>C(u,e),[c]:(e,t)=>t===P?e:C(c,e,x(t)),[i]:(e,t)=>{const n=C(i,e,x(t));return n&&L(n,D)},[l]:(e,t)=>t===P||C(l,e,x(t)),[f]:e=>C(f,e),[p]:e=>C(p,e).map(D),[g]:e=>C(g,e),[y]:(e,t,n)=>C(y,e,x(t),x(n)),[w]:(e,t)=>C(w,e,x(t))};t[R]=(e,t,s,o)=>{switch(e){case r:return D(t).apply(D(s),o.map(D));case d:{const e=D(t);n.delete(E.get(e)),E.delete(e)}}};const U=new Proxy([h,null],z),J=U.Array[I];return M(Array,I,{value:e=>T(e)?J(e):k(e)}),{[e.toLowerCase()]:U,[`is${e}Proxy`]:T,proxy:t}}},ve=be("Window"),Ee=he("Server",!1),Se=be("Server"),Me="function"==typeof Worker?Worker:class{};const{parse:Pe,stringify:Ae}=X,Te=!!globalThis.process,ke=new WeakMap,xe=e=>{let t;return/^!(-?\d+)?/.test(e)&&(t=RegExp.$1,e=e.slice(1+t.length)),{id:t,result:e?Pe(e):void 0}},Oe=Te?(e,t)=>e.on("connection",(e=>{e.once("message",(n=>{let s=0;const[o,a]=Pe(n),c=new Map,{[o]:i}=Ee({[a]:async(t,...n)=>{const o=Ae([t,...n]);if(t===r){const{promise:t,resolve:n}=Promise.withResolvers(),r=String(s++);return c.set(r,n),e.send("!"+r+o),await t}e.send("!"+o)}},o,a,t).proxy;e.on("close",(()=>{for(const[e,t]of c)t()})).on("message",(t=>{const{id:n,result:r}=xe(String(t));if(n){const e=c.get(n);c.delete(n),e(r)}else e.send(Ae(i(...r)))})).send("")}))})):(e,r)=>{const s=de(e);if(!ke.has(s)){const o=e instanceof Me?Re:je;ke.set(s,o(e,s,t,n,r))}return ke.get(s)};Te||(Oe.transfer=de.transfer);const Re=(e,t,n,r,s)=>(e.addEventListener("message",(({data:[e,n]})=>{const r="M"+e,o="T"+e,{[o]:a}=t;let c;t[r]=(...e)=>new Promise((t=>{c=t,s.send(Ae(e))})),s.addEventListener("message",(()=>{s.addEventListener("message",(async({data:e})=>{const{id:t,result:n}=xe(e);if(null!=t){const e=a(...n);if(t){const n=await e;s.send("!"+t+(void 0===n?"":Ae(n)))}}else c=c(n)})),Atomics.notify(n,0)}),{once:!0}),s.send(Ae([r,o]))}),{once:!0}),me(t,n,r)),je=(e,t,n,r)=>{const s="S"+crypto.randomUUID(),o=new Int32Array(new SharedArrayBuffer(4));return e.postMessage([s,o]),Atomics.wait(o),j(Se(t,"M"+s,"T"+s),ve(t,n,r))};export{Oe as default};
