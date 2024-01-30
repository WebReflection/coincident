Promise.withResolvers||(Promise.withResolvers=function(){var e,t,r=new this((function(r,n){e=r,t=n}));return{resolve:e,reject:t,promise:r}});const e="77dbeded-64e9-43f4-908d-415617779b8d",t="M"+e,r="T"+e,n="apply",s="construct",o="defineProperty",a="deleteProperty",c="get",i="getOwnPropertyDescriptor",u="getPrototypeOf",l="has",f="isExtensible",p="ownKeys",g="preventExtensions",y="set",d="setPrototypeOf",w="delete",h="array",m="function",b="null",v="number",S="object",E="string",M="symbol",P="undefined",{isArray:k}=Array,T=(e,t)=>t,O=e=>typeof e===m?(e=>e())(e):e;function x(){return this}const A=(e,t)=>e===h?[t]:{t:e,v:t},j=(e,t=T)=>{let r=typeof e,n=e;return r===S&&(k(e)?(r=h,n=e.at(0)):({t:r,v:n}=e)),t(r,n)},W=(e,t)=>e===m?t:A(e,t),R=(e,t=W)=>{const r=null===e?b:typeof e;return t(r===S&&k(e)?h:r,e)},{defineProperty:$,deleteProperty:B,getOwnPropertyDescriptor:I,getPrototypeOf:L,isExtensible:D,ownKeys:N,preventExtensions:_,set:J,setPrototypeOf:U}=Reflect,{assign:C,create:z}=Object,F=L(Int8Array),K=(e,t)=>{const{get:r,set:n,value:s}=e;return r&&(e.get=t(r)),n&&(e.set=t(n)),s&&(e.value=t(s)),e},Y=e=>t=>R(t,((t,r)=>{switch(t){case b:return A(b,r);case S:if(r===globalThis)return A(t,null);case h:case m:return e(t,r);case"boolean":case v:case E:case P:case"bigint":return A(t,r);case M:{if(H.has(r))return A(t,H.get(r));let e=Symbol.keyFor(r);if(e)return A(t,`.${e}`)}}throw new TypeError(`Unable to handle this ${t}: ${String(r)}`)})),H=new Map(N(Symbol).filter((e=>typeof Symbol[e]===M)).map((e=>[Symbol[e],e]))),q=e=>{if(e.startsWith("."))return Symbol.for(e.slice(1));for(const[t,r]of H)if(r===e)return t},G=e=>e,Q="object"==typeof self?self:globalThis,V=e=>((e,t)=>{const r=(t,r)=>(e.set(r,t),t),n=s=>{if(e.has(s))return e.get(s);const[o,a]=t[s];switch(o){case 0:case-1:return r(a,s);case 1:{const e=r([],s);for(const t of a)e.push(n(t));return e}case 2:{const e=r({},s);for(const[t,r]of a)e[n(t)]=n(r);return e}case 3:return r(new Date(a),s);case 4:{const{source:e,flags:t}=a;return r(new RegExp(e,t),s)}case 5:{const e=r(new Map,s);for(const[t,r]of a)e.set(n(t),n(r));return e}case 6:{const e=r(new Set,s);for(const t of a)e.add(n(t));return e}case 7:{const{name:e,message:t}=a;return r(new Q[e](t),s)}case 8:return r(BigInt(a),s);case"BigInt":return r(Object(BigInt(a)),s)}return r(new Q[o](a),s)};return n})(new Map,e)(0),X="",{toString:Z}={},{keys:ee}=Object,te=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const r=Z.call(e).slice(8,-1);switch(r){case"Array":return[1,X];case"Object":return[2,X];case"Date":return[3,X];case"RegExp":return[4,X];case"Map":return[5,X];case"Set":return[6,X]}return r.includes("Array")?[1,r]:r.includes("Error")?[7,r]:[2,r]},re=([e,t])=>0===e&&("function"===t||"symbol"===t),ne=(e,{json:t,lossy:r}={})=>{const n=[];return((e,t,r,n)=>{const s=(e,t)=>{const s=n.push(e)-1;return r.set(t,s),s},o=n=>{if(r.has(n))return r.get(n);let[a,c]=te(n);switch(a){case 0:{let t=n;switch(c){case"bigint":a=8,t=n.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+c);t=null;break;case"undefined":return s([-1],n)}return s([a,t],n)}case 1:{if(c)return s([c,[...n]],n);const e=[],t=s([a,e],n);for(const t of n)e.push(o(t));return t}case 2:{if(c)switch(c){case"BigInt":return s([c,n.toString()],n);case"Boolean":case"Number":case"String":return s([c,n.valueOf()],n)}if(t&&"toJSON"in n)return o(n.toJSON());const r=[],i=s([a,r],n);for(const t of ee(n))!e&&re(te(n[t]))||r.push([o(t),o(n[t])]);return i}case 3:return s([a,n.toISOString()],n);case 4:{const{source:e,flags:t}=n;return s([a,{source:e,flags:t}],n)}case 5:{const t=[],r=s([a,t],n);for(const[r,s]of n)(e||!re(te(r))&&!re(te(s)))&&t.push([o(r),o(s)]);return r}case 6:{const t=[],r=s([a,t],n);for(const r of n)!e&&re(te(r))||t.push(o(r));return r}}const{message:i}=n;return s([a,{name:c,message:i}],n)};return o})(!(t||r),!!t,new Map,n)(e),n},{parse:se,stringify:oe}=JSON,ae={json:!0,lossy:!0};var ce=Object.freeze({__proto__:null,parse:e=>V(se(e)),stringify:e=>oe(ne(e,ae))}),ie=e=>({value:new Promise((t=>{let r=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");r.onmessage=t,r.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:ue,Map:le,SharedArrayBuffer:fe,Uint16Array:pe}=globalThis,{BYTES_PER_ELEMENT:ge}=ue,{BYTES_PER_ELEMENT:ye}=pe,{isArray:de}=Array,{notify:we,wait:he,waitAsync:me}=Atomics,be=new WeakSet,ve=new WeakMap,Se={value:{then:e=>e()}};let Ee=0;const Me=(t,{parse:r=JSON.parse,stringify:n=JSON.stringify,transform:s,interrupt:o}=JSON)=>{if(!ve.has(t)){const a=(r,...n)=>t.postMessage({[e]:n},{transfer:r}),i=typeof o===m?o:o?.handler,u=o?.delay||42,f=new TextDecoder("utf-16"),p=(e,t)=>e?(me||ie)(t,0):(i?((e,t,r)=>{for(;"timed-out"===he(e,0,0,t);)r()})(t,u,i):he(t,0),Se);let g=!1;ve.set(t,new Proxy(new le,{[l]:(e,t)=>"string"==typeof t&&!t.startsWith("_"),[c]:(e,n)=>"then"===n?null:(...e)=>{const o=Ee++;let c=new ue(new fe(2*ge)),i=[];be.has(e.at(-1)||i)&&be.delete(i=e.pop()),a(i,o,c,n,s?e.map(s):e);const u=t!==globalThis;let l=0;return g&&u&&(l=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${n}(...args) is awaited`)),p(u,c).value.then((()=>{clearTimeout(l);const e=c[1];if(!e)return;const t=ye*e;return c=new ue(new fe(t+t%ge)),a([],o,c),p(u,c).value.then((()=>r(f.decode(new pe(c.buffer).slice(0,e)))))}))},[y](r,o,a){const c=typeof a;if(c!==m)throw new Error(`Unable to assign ${o} as ${c}`);if(!r.size){const o=new le;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(de(a)){t.stopImmediatePropagation();const[e,c,...i]=a;let u;if(i.length){const[t,a]=i;if(r.has(t)){g=!0;try{const i=await r.get(t)(...a);if(void 0!==i){const t=n(s?s(i):i);o.set(e,t),c[1]=t.length}}catch(e){u=e}finally{g=!1}}else u=new Error(`Unsupported action: ${t}`);c[0]=1}else{const t=o.get(e);o.delete(e);for(let e=new pe(c.buffer),r=0;r<t.length;r++)e[r]=t.charCodeAt(r)}if(we(c,0),u)throw u}}))}return!!r.set(o,a)}}))}return ve.get(t)},Pe=(e,t)=>Me(e,{...ce,...t});Pe.transfer=Me.transfer=(...e)=>(be.add(e),e);const ke=new FinalizationRegistry((([e,t,r])=>{r&&console.debug(`Held value ${String(t)} not relevant anymore`),e(t)})),Te=Object.create(null),Oe=(e,t,{debug:r,return:n,token:s=e}=Te)=>{const o=n||new Proxy(e,Te),a=[o,[t,e,!!r]];return!1!==s&&a.push(s),ke.register(...a),o};var xe=(e,t)=>{const r=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;$(EventTarget.prototype,"addEventListener",{value(t,n,...s){return s.at(0)?.invoke&&(r.has(this)||r.set(this,new Map),r.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,n,...s)}})}const b=t&&(e=>{const{currentTarget:t,target:n,type:s}=e;for(const o of r.get(t||n)?.get(s)||[])e[o]()});return function(r,k,T,...O){let x=0,W=this?.transform||G;const R=new Map,H=new Map,{[T]:Q}=r,V=O.length?C(z(globalThis),...O):globalThis,X=Y(((e,t)=>{if(!R.has(t)){let r;for(;H.has(r=x++););R.set(t,r),H.set(r,e===m?t:W(t))}return A(e,R.get(t))})),Z=e=>{Q(w,A(E,e))},ee=(e,r)=>{switch(e){case S:if(null==r)return V;case h:if(typeof r===v)return H.get(r);if(!(r instanceof F))for(const e in r)r[e]=te(r[e]);return r;case m:if(typeof r===E){const e=H.get(r)?.deref();if(e)return e;const s=function(...e){return t&&e.at(0)instanceof Event&&b(...e),Q(n,A(m,r),X(this),e.map(X))};return H.set(r,new WeakRef(s)),Oe(r,Z,{return:s,token:!1})}return H.get(r);case M:return q(r)}return r},te=e=>j(e,ee),re={[n]:(e,t,r)=>X(e.apply(t,r)),[s]:(e,t)=>X(new e(...t)),[o]:(e,t,r)=>X($(e,t,r)),[a]:(e,t)=>X(B(e,t)),[u]:e=>X(L(e)),[c]:(e,t)=>X(e[t]),[i]:(e,t)=>{const r=I(e,t);return r?A(S,K(r,X)):A(P,r)},[l]:(e,t)=>X(t in e),[f]:e=>X(D(e)),[p]:e=>A(h,N(e).map(X)),[g]:e=>X(_(e)),[y]:(e,t,r)=>X(J(e,t,r)),[d]:(e,t)=>X(U(e,t)),[w](e){R.delete(H.get(e)),H.delete(e)}};return r[k]=(e,t,...r)=>{switch(e){case n:r[0]=te(r[0]),r[1]=r[1].map(te);break;case s:r[0]=r[0].map(te);break;case o:{const[e,t]=r;r[0]=te(e);const{get:n,set:s,value:o}=t;n&&(t.get=te(n)),s&&(t.set=te(s)),o&&(t.value=te(o));break}default:r=r.map(te)}return re[e](te(t),...r)},{proxy:r,[e.toLowerCase()]:V,[`is${e}Proxy`]:()=>!1}}},Ae=xe("Window",!0),je=e=>{let t=0;const r=new Map,b=new Map,P=Symbol();return function(k,T,W){const R=this?.transform||G,{[T]:$}=k,B=new Map,I=e=>{B.delete(e),$(w,L(e))},L=Y(((e,n)=>{if(P in n)return O(n[P]);if(e===m){if(n=R(n),!b.has(n)){let e;for(;b.has(e=String(t++)););r.set(n,e),b.set(e,n)}return A(e,r.get(n))}if(!(n instanceof F)){n=R(n);for(const e in n)n[e]=L(n[e])}return A(e,n)})),D=(e,t,r)=>{const n=B.get(r)?.deref();if(n)return n;const s=t===m?(e=>x.bind(e))(e):e,o=new Proxy(s,J);return B.set(r,new WeakRef(o)),Oe(r,I,{return:o,token:!1})},N=e=>j(e,((t,r)=>{switch(t){case S:if(null===r)return globalThis;case h:return typeof r===v?D(e,t,r):r;case m:return typeof r===E?b.get(r):D(e,t,r);case M:return q(r)}return r})),_=(e,t,...r)=>N($(e,O(t),...r)),J={[n]:(e,t,r)=>_(n,e,L(t),r.map(L)),[s]:(e,t)=>_(s,e,t.map(L)),[o]:(e,t,r)=>{const{get:n,set:s,value:a}=r;return typeof n===m&&(r.get=L(n)),typeof s===m&&(r.set=L(s)),typeof a===m&&(r.value=L(a)),_(o,e,L(t),r)},[a]:(e,t)=>_(a,e,L(t)),[u]:e=>_(u,e),[c]:(e,t)=>t===P?e:_(c,e,L(t)),[i]:(e,t)=>{const r=_(i,e,L(t));return r&&K(r,N)},[l]:(e,t)=>t===P||_(l,e,L(t)),[f]:e=>_(f,e),[p]:e=>_(p,e).map(N),[g]:e=>_(g,e),[y]:(e,t,r)=>_(y,e,L(t),L(r)),[d]:(e,t)=>_(d,e,L(t))};k[W]=(e,t,s,o)=>{switch(e){case n:return N(t).apply(N(s),o.map(N));case w:{const e=N(t);r.delete(b.get(e)),b.delete(e)}}};const U=new Proxy(A(S,null),J);return{[e.toLowerCase()]:U,[`is${e}Proxy`]:e=>typeof e===S&&!!e&&P in e,proxy:k}}},We=je("Window"),Re=xe("Server",!1),$e=je("Server"),Be=typeof Worker===m?Worker:class{};const{notify:Ie,wait:Le}=Atomics,{parse:De,stringify:Ne}=ce,_e=!!globalThis.process,Je=new WeakMap,Ue=e=>{let t;return/^!(-?\d+)?/.test(e)&&(t=RegExp.$1,e=e.slice(1+t.length)),{id:t,result:e?De(e):void 0}},Ce=_e?(e,t)=>e.on("connection",(e=>{e.once("message",(r=>{let s=0;const[o,a]=De(r),c=new Map,{[o]:i}=Re({[a]:async(t,...r)=>{const o=Ne([t,...r]);if(t===n){const{promise:t,resolve:r}=Promise.withResolvers(),n=String(s++);return c.set(n,r),e.send("!"+n+o),await t}e.send("!"+o)}},o,a,t).proxy;e.on("close",(()=>{for(const[e,t]of c)t()})).on("message",(t=>{const{id:r,result:n}=Ue(String(t));if(r){const e=c.get(r);c.delete(r),e(n)}else e.send(Ne(i(...n)))})).send("")}))})):(e,n,...s)=>{const o=Pe(e,...s);if(!Je.has(o)){const s=e instanceof Be?ze:Fe;Je.set(o,s(e,o,t,r,n))}return Je.get(o)};_e||(Ce.transfer=Pe.transfer);const ze=(e,t,r,n,s)=>(e.addEventListener("message",(({data:[e,r]})=>{const n="M"+e,o="T"+e,{[o]:a}=t;let c;t[n]=(...e)=>new Promise((t=>{c=t,s.send(Ne(e))})),s.addEventListener("message",(()=>{s.addEventListener("message",(async({data:e})=>{const{id:t,result:r}=Ue(e);if(null!=t){const e=a(...r);if(t){const r=await e;s.send("!"+t+(void 0===r?"":Ne(r)))}}else c&&(c=c(r))})),r[0]=1,Ie(r,0)}),{once:!0}),s.send(Ne([n,o]))}),{once:!0}),Ae(t,r,n)),Fe=(e,t,r,n)=>{const s="S"+crypto.randomUUID(),o=new Int32Array(new SharedArrayBuffer(4));return e.postMessage([s,o]),Le(o,0),C($e(t,"M"+s,"T"+s),We(t,r,n))};export{Ce as default};
