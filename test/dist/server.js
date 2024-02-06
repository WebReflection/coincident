Promise.withResolvers||(Promise.withResolvers=function(){var e,t,n=new this((function(n,r){e=n,t=r}));return{resolve:e,reject:t,promise:n}});const e="c6a44870-ba80-403d-9b07-9746659ffbe8",t="M"+e,n="T"+e,r="apply",s="construct",o="defineProperty",a="deleteProperty",c="get",i="getOwnPropertyDescriptor",l="getPrototypeOf",u="has",f="isExtensible",p="ownKeys",g="preventExtensions",d="set",y="setPrototypeOf",w="delete",h="array",m="function",b="null",v="number",E="object",S="string",M="symbol",P="undefined",{isArray:k}=Array,T=(e,t)=>t,O=e=>typeof e===m?(e=>e())(e):e;function x(){return this}const A=(e,t)=>e===h?[t]:{t:e,v:t},W=(e,t=T)=>{let n=typeof e,r=e;return n===E&&(k(e)?(n=h,r=e.at(0)):({t:n,v:r}=e)),t(n,r)},j=(e,t)=>e===m?t:A(e,t),L=(e,t=j)=>{const n=null===e?b:typeof e;return t(n===E&&k(e)?h:n,e)},{defineProperty:R,deleteProperty:B,getOwnPropertyDescriptor:I,getPrototypeOf:$,isExtensible:D,ownKeys:N,preventExtensions:_,set:J,setPrototypeOf:U}=Reflect,{assign:C,create:z}=Object,F=$(Int8Array),K=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},Y=e=>t=>L(t,((t,n)=>{switch(t){case b:return A(b,n);case E:if(n===globalThis)return A(t,null);case h:case m:return e(t,n);case"boolean":case v:case S:case P:case"bigint":return A(t,n);case M:{if(H.has(n))return A(t,H.get(n));let e=Symbol.keyFor(n);if(e)return A(t,`.${e}`)}}throw new TypeError(`Unable to handle this ${t}: ${String(n)}`)})),H=new Map(N(Symbol).filter((e=>typeof Symbol[e]===M)).map((e=>[Symbol[e],e]))),q=e=>{if(e.startsWith("."))return Symbol.for(e.slice(1));for(const[t,n]of H)if(n===e)return t},G=e=>e,Q="object"==typeof self?self:globalThis,V=e=>((e,t)=>{const n=(t,n)=>(e.set(n,t),t),r=s=>{if(e.has(s))return e.get(s);const[o,a]=t[s];switch(o){case 0:case-1:return n(a,s);case 1:{const e=n([],s);for(const t of a)e.push(r(t));return e}case 2:{const e=n({},s);for(const[t,n]of a)e[r(t)]=r(n);return e}case 3:return n(new Date(a),s);case 4:{const{source:e,flags:t}=a;return n(new RegExp(e,t),s)}case 5:{const e=n(new Map,s);for(const[t,n]of a)e.set(r(t),r(n));return e}case 6:{const e=n(new Set,s);for(const t of a)e.add(r(t));return e}case 7:{const{name:e,message:t}=a;return n(new Q[e](t),s)}case 8:return n(BigInt(a),s);case"BigInt":return n(Object(BigInt(a)),s)}return n(new Q[o](a),s)};return r})(new Map,e)(0),X="",{toString:Z}={},{keys:ee}=Object,te=e=>{const t=typeof e;if("object"!==t||!e)return[0,t];const n=Z.call(e).slice(8,-1);switch(n){case"Array":return[1,X];case"Object":return[2,X];case"Date":return[3,X];case"RegExp":return[4,X];case"Map":return[5,X];case"Set":return[6,X]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},ne=([e,t])=>0===e&&("function"===t||"symbol"===t),re=(e,{json:t,lossy:n}={})=>{const r=[];return((e,t,n,r)=>{const s=(e,t)=>{const s=r.push(e)-1;return n.set(t,s),s},o=r=>{if(n.has(r))return n.get(r);let[a,c]=te(r);switch(a){case 0:{let t=r;switch(c){case"bigint":a=8,t=r.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+c);t=null;break;case"undefined":return s([-1],r)}return s([a,t],r)}case 1:{if(c)return s([c,[...r]],r);const e=[],t=s([a,e],r);for(const t of r)e.push(o(t));return t}case 2:{if(c)switch(c){case"BigInt":return s([c,r.toString()],r);case"Boolean":case"Number":case"String":return s([c,r.valueOf()],r)}if(t&&"toJSON"in r)return o(r.toJSON());const n=[],i=s([a,n],r);for(const t of ee(r))!e&&ne(te(r[t]))||n.push([o(t),o(r[t])]);return i}case 3:return s([a,r.toISOString()],r);case 4:{const{source:e,flags:t}=r;return s([a,{source:e,flags:t}],r)}case 5:{const t=[],n=s([a,t],r);for(const[n,s]of r)(e||!ne(te(n))&&!ne(te(s)))&&t.push([o(n),o(s)]);return n}case 6:{const t=[],n=s([a,t],r);for(const n of r)!e&&ne(te(n))||t.push(o(n));return n}}const{message:i}=r;return s([a,{name:c,message:i}],r)};return o})(!(t||n),!!t,new Map,r)(e),r},{parse:se,stringify:oe}=JSON,ae={json:!0,lossy:!0};var ce=Object.freeze({__proto__:null,parse:e=>V(se(e)),stringify:e=>oe(re(e,ae))});const{isArray:ie}=Array;let{SharedArrayBuffer:le,window:ue}=globalThis,{notify:fe,wait:pe,waitAsync:ge}=Atomics,de=null;ge||(ge=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))}));try{new le(4)}catch(t){le=ArrayBuffer;const n=new WeakMap;if(ue){const t=new Map,{prototype:{postMessage:r}}=Worker,s=n=>{const r=n.data?.[e];if(!ie(r)){n.stopImmediatePropagation();const{id:e,sb:s}=r;t.get(e)(s)}};de=function(t,...o){const a=t?.[e];if(ie(a)){const[e,t]=a;n.set(t,e),this.addEventListener("message",s)}return r.call(this,t,...o)},ge=e=>({value:new Promise((r=>{t.set(n.get(e),r)})).then((r=>{t.delete(n.get(e)),n.delete(e);for(let t=0;t<r.length;t++)e[t]=r[t];return"ok"}))})}else{const t=(t,n)=>({[e]:{id:t,sb:n}});fe=e=>{postMessage(t(n.get(e),e))},addEventListener("message",(t=>{const r=t.data?.[e];if(ie(r)){const[e,t]=r;n.set(t,e)}}))}}
/*! (c) Andrea Giammarchi - ISC */const{Int32Array:ye,Map:we,Uint16Array:he}=globalThis,{BYTES_PER_ELEMENT:me}=ye,{BYTES_PER_ELEMENT:be}=he,ve=new WeakSet,Ee=new WeakMap,Se={value:{then:e=>e()}};let Me=0;const Pe=(t,{parse:n=JSON.parse,stringify:r=JSON.stringify,transform:s,interrupt:o}=JSON)=>{if(!Ee.has(t)){const a=de||t.postMessage,i=(n,...r)=>a.call(t,{[e]:r},{transfer:n}),l=typeof o===m?o:o?.handler,f=o?.delay||42,p=new TextDecoder("utf-16"),g=(e,t)=>e?ge(t,0):(l?((e,t,n)=>{for(;"timed-out"===pe(e,0,0,t);)n()})(t,f,l):pe(t,0),Se);let y=!1;Ee.set(t,new Proxy(new we,{[u]:(e,t)=>"string"==typeof t&&!t.startsWith("_"),[c]:(e,r)=>"then"===r?null:(...e)=>{const o=Me++;let a=new ye(new le(2*me)),c=[];ve.has(e.at(-1)||c)&&ve.delete(c=e.pop()),i(c,o,a,r,s?e.map(s):e);const l=t!==globalThis;let u=0;return y&&l&&(u=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),g(l,a).value.then((()=>{clearTimeout(u);const e=a[1];if(!e)return;const t=be*e;return a=new ye(new le(t+t%me)),i([],o,a),g(l,a).value.then((()=>n(p.decode(new he(a.buffer).slice(0,e)))))}))},[d](n,o,a){const c=typeof a;if(c!==m)throw new Error(`Unable to assign ${o} as ${c}`);if(!n.size){const o=new we;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(ie(a)){t.stopImmediatePropagation();const[e,c,...i]=a;let l;if(i.length){const[t,a]=i;if(n.has(t)){y=!0;try{const i=await n.get(t)(...a);if(void 0!==i){const t=r(s?s(i):i);o.set(e,t),c[1]=t.length}}catch(e){l=e}finally{y=!1}}else l=new Error(`Unsupported action: ${t}`);c[0]=1}else{const t=o.get(e);o.delete(e);for(let e=new he(c.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}if(fe(c,0),l)throw l}}))}return!!n.set(o,a)}}))}return Ee.get(t)},ke=(e,t)=>Pe(e,{...ce,...t});ke.transfer=Pe.transfer=(...e)=>(ve.add(e),e);const Te=new FinalizationRegistry((([e,t,n])=>{n&&console.debug(`Held value ${String(t)} not relevant anymore`),e(t)})),Oe=Object.create(null),xe=(e,t,{debug:n,handler:r,return:s,token:o=e}=Oe)=>{const a=s||new Proxy(e,r||Oe),c=[a,[t,e,!!n]];return!1!==o&&c.push(o),Te.register(...c),a};var Ae=(e,t)=>{const n=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;R(EventTarget.prototype,"addEventListener",{value(t,r,...s){return s.at(0)?.invoke&&(n.has(this)||n.set(this,new Map),n.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,r,...s)}})}const b=t&&(e=>{const{currentTarget:t,target:r,type:s}=e;for(const o of n.get(t||r)?.get(s)||[])e[o]()});return function(n,k,T,...O){let x=0,j=this?.transform||G;const L=new Map,H=new Map,{[T]:Q}=n,V=O.length?C(z(globalThis),...O):globalThis,X=Y(((e,t)=>{if(!L.has(t)){let n;for(;H.has(n=x++););L.set(t,n),H.set(n,e===m?t:j(t))}return A(e,L.get(t))})),Z=e=>{Q(w,A(S,e))},ee=(e,n)=>{switch(e){case E:if(null==n)return V;case h:if(typeof n===v)return H.get(n);if(!(n instanceof F))for(const e in n)n[e]=te(n[e]);return n;case m:if(typeof n===S){const e=H.get(n)?.deref();if(e)return e;const s=function(...e){return t&&e.at(0)instanceof Event&&b(...e),Q(r,A(m,n),X(this),e.map(X))};return H.set(n,new WeakRef(s)),xe(n,Z,{return:s,token:!1})}return H.get(n);case M:return q(n)}return n},te=e=>W(e,ee),ne={[r]:(e,t,n)=>X(e.apply(t,n)),[s]:(e,t)=>X(new e(...t)),[o]:(e,t,n)=>X(R(e,t,n)),[a]:(e,t)=>X(B(e,t)),[l]:e=>X($(e)),[c]:(e,t)=>X(e[t]),[i]:(e,t)=>{const n=I(e,t);return n?A(E,K(n,X)):A(P,n)},[u]:(e,t)=>X(t in e),[f]:e=>X(D(e)),[p]:e=>A(h,N(e).map(X)),[g]:e=>X(_(e)),[d]:(e,t,n)=>X(J(e,t,n)),[y]:(e,t)=>X(U(e,t)),[w](e){L.delete(H.get(e)),H.delete(e)}};return n[k]=(e,t,...n)=>{switch(e){case r:n[0]=te(n[0]),n[1]=n[1].map(te);break;case s:n[0]=n[0].map(te);break;case o:{const[e,t]=n;n[0]=te(e);const{get:r,set:s,value:o}=t;r&&(t.get=te(r)),s&&(t.set=te(s)),o&&(t.value=te(o));break}default:n=n.map(te)}return ne[e](te(t),...n)},{proxy:n,[e.toLowerCase()]:V,[`is${e}Proxy`]:()=>!1}}},We=Ae("Window",!0),je=e=>{let t=0;const n=new Map,b=new Map,P=Symbol();return function(k,T,j){const L=this?.transform||G,{[T]:R}=k,B=new Map,I=e=>{B.delete(e),R(w,$(e))},$=Y(((e,r)=>{if(P in r)return O(r[P]);if(e===m){if(r=L(r),!b.has(r)){let e;for(;b.has(e=String(t++)););n.set(r,e),b.set(e,r)}return A(e,n.get(r))}if(!(r instanceof F)){r=L(r);for(const e in r)r[e]=$(r[e])}return A(e,r)})),D=(e,t,n)=>{const r=B.get(n)?.deref();if(r)return r;const s=t===m?(e=>x.bind(e))(e):e,o=new Proxy(s,J);return B.set(n,new WeakRef(o)),xe(n,I,{return:o,token:!1})},N=e=>W(e,((t,n)=>{switch(t){case E:if(null===n)return globalThis;case h:return typeof n===v?D(e,t,n):n;case m:return typeof n===S?b.get(n):D(e,t,n);case M:return q(n)}return n})),_=(e,t,...n)=>N(R(e,O(t),...n)),J={[r]:(e,t,n)=>_(r,e,$(t),n.map($)),[s]:(e,t)=>_(s,e,t.map($)),[o]:(e,t,n)=>{const{get:r,set:s,value:a}=n;return typeof r===m&&(n.get=$(r)),typeof s===m&&(n.set=$(s)),typeof a===m&&(n.value=$(a)),_(o,e,$(t),n)},[a]:(e,t)=>_(a,e,$(t)),[l]:e=>_(l,e),[c]:(e,t)=>t===P?e:_(c,e,$(t)),[i]:(e,t)=>{const n=_(i,e,$(t));return n&&K(n,N)},[u]:(e,t)=>t===P||_(u,e,$(t)),[f]:e=>_(f,e),[p]:e=>_(p,e).map(N),[g]:e=>_(g,e),[d]:(e,t,n)=>_(d,e,$(t),$(n)),[y]:(e,t)=>_(y,e,$(t))};k[j]=(e,t,s,o)=>{switch(e){case r:return N(t).apply(N(s),o.map(N));case w:{const e=N(t);n.delete(b.get(e)),b.delete(e)}}};const U=new Proxy(A(E,null),J);return{[e.toLowerCase()]:U,[`is${e}Proxy`]:e=>typeof e===E&&!!e&&P in e,proxy:k}}},Le=je("Window"),Re=Ae("Server",!1),Be=je("Server"),Ie=typeof Worker===m?Worker:class{};const{notify:$e,wait:De}=Atomics,{parse:Ne,stringify:_e}=ce,Je=!!globalThis.process,Ue=new WeakMap,Ce=e=>{let t;return/^!(-?\d+)?/.test(e)&&(t=RegExp.$1,e=e.slice(1+t.length)),{id:t,result:e?Ne(e):void 0}},ze=Je?(e,t)=>e.on("connection",(e=>{e.once("message",(n=>{let s=0;const[o,a]=Ne(n),c=new Map,{[o]:i}=Re({[a]:async(t,...n)=>{const o=_e([t,...n]);if(t===r){const{promise:t,resolve:n}=Promise.withResolvers(),r=String(s++);return c.set(r,n),e.send("!"+r+o),await t}e.send("!"+o)}},o,a,t).proxy;e.on("close",(()=>{for(const[e,t]of c)t()})).on("message",(t=>{const{id:n,result:r}=Ce(String(t));if(n){const e=c.get(n);c.delete(n),e(r)}else e.send(_e(i(...r)))})).send("")}))})):(e,r,...s)=>{const o=ke(e,...s);if(!Ue.has(o)){const s=e instanceof Ie?Fe:Ke;Ue.set(o,s(e,o,t,n,r))}return Ue.get(o)};Je||(ze.transfer=ke.transfer);const Fe=(e,t,n,r,s)=>(e.addEventListener("message",(({data:[e,n]})=>{const r="M"+e,o="T"+e,{[o]:a}=t;let c;t[r]=(...e)=>new Promise((t=>{c=t,s.send(_e(e))})),s.addEventListener("message",(()=>{s.addEventListener("message",(async({data:e})=>{const{id:t,result:n}=Ce(e);if(null!=t){const e=a(...n);if(t){const n=await e;s.send("!"+t+(void 0===n?"":_e(n)))}}else c&&(c=c(n))})),n[0]=1,$e(n,0)}),{once:!0}),s.send(_e([r,o]))}),{once:!0}),We(t,n,r)),Ke=(e,t,n,r)=>{const s="S"+crypto.randomUUID(),o=new Int32Array(new SharedArrayBuffer(4));return e.postMessage([s,o]),De(o,0),C(Be(t,"M"+s,"T"+s),Le(t,n,r))};export{ze as default};
