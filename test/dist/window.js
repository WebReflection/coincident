const e="566fc334-5147-4e86-bb9b-c7d24c13127d",t="M"+e,n="T"+e,r="array",s="function",o="null",a="number",i="object",c="string",l="symbol",f="undefined",u="apply",p="construct",g="defineProperty",y="deleteProperty",d="get",w="getOwnPropertyDescriptor",h="getPrototypeOf",b="has",m="isExtensible",v="ownKeys",E="preventExtensions",k="set",P="setPrototypeOf",M="delete",{isArray:T}=Array;let{SharedArrayBuffer:S,window:x}=globalThis,{notify:W,wait:A,waitAsync:O}=Atomics,$=null;O||(O=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))}));try{new S(4)}catch(t){S=ArrayBuffer;const n=new WeakMap;if(x){const t=new Map,{prototype:{postMessage:r}}=Worker,s=n=>{const r=n.data?.[e];if(!T(r)){n.stopImmediatePropagation();const{id:e,sb:s}=r;t.get(e)(s)}};$=function(t,...o){const a=t?.[e];if(T(a)){const[e,t]=a;n.set(t,e),this.addEventListener("message",s)}return r.call(this,t,...o)},O=e=>({value:new Promise((r=>{t.set(n.get(e),r)})).then((r=>{t.delete(n.get(e)),n.delete(e);for(let t=0;t<r.length;t++)e[t]=r[t];return"ok"}))})}else{const t=(t,n)=>({[e]:{id:t,sb:n}});W=e=>{postMessage(t(n.get(e),e))},addEventListener("message",(t=>{const r=t.data?.[e];if(T(r)){const[e,t]=r;n.set(t,e)}}))}}
/*! (c) Andrea Giammarchi - ISC */const{Int32Array:L,Map:D,Uint16Array:R}=globalThis,{BYTES_PER_ELEMENT:B}=L,{BYTES_PER_ELEMENT:C}=R,N=new WeakSet,_=new WeakMap,j={value:{then:e=>e()}};let I=0;const U=(t,{parse:n=JSON.parse,stringify:r=JSON.stringify,transform:o,interrupt:a}=JSON)=>{if(!_.has(t)){const i=$||t.postMessage,c=(n,...r)=>i.call(t,{[e]:r},{transfer:n}),l=typeof a===s?a:a?.handler,f=a?.delay||42,u=new TextDecoder("utf-16"),p=(e,t)=>e?O(t,0):(l?((e,t,n)=>{for(;"timed-out"===A(e,0,0,t);)n()})(t,f,l):A(t,0),j);let g=!1;_.set(t,new Proxy(new D,{[b]:(e,t)=>"string"==typeof t&&!t.startsWith("_"),[d]:(e,r)=>"then"===r?null:(...e)=>{const s=I++;let a=new L(new S(2*B)),i=[];N.has(e.at(-1)||i)&&N.delete(i=e.pop()),c(i,s,a,r,o?e.map(o):e);const l=t!==globalThis;let f=0;return g&&l&&(f=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),p(l,a).value.then((()=>{clearTimeout(f);const e=a[1];if(!e)return;const t=C*e;return a=new L(new S(t+t%B)),c([],s,a),p(l,a).value.then((()=>n(u.decode(new R(a.buffer).slice(0,e)))))}))},[k](n,a,i){const c=typeof i;if(c!==s)throw new Error(`Unable to assign ${a} as ${c}`);if(!n.size){const s=new D;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(T(a)){t.stopImmediatePropagation();const[e,i,...c]=a;let l;if(c.length){const[t,a]=c;if(n.has(t)){g=!0;try{const c=await n.get(t)(...a);if(void 0!==c){const t=r(o?o(c):c);s.set(e,t),i[1]=t.length}}catch(e){l=e}finally{g=!1}}else l=new Error(`Unsupported action: ${t}`);i[0]=1}else{const t=s.get(e);s.delete(e);for(let e=new R(i.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}if(W(i,0),l)throw l}}))}return!!n.set(a,i)}}))}return _.get(t)};U.transfer=(...e)=>(N.add(e),e);const{isArray:J}=Array,z=(e,t)=>t,F=e=>typeof e===s?(e=>e())(e):e;function K(){return this}const Y=(e,t)=>e===r?[t]:{t:e,v:t},H=(e,t=z)=>{let n=typeof e,s=e;return n===i&&(J(e)?(n=r,s=e.at(0)):({t:n,v:s}=e)),t(n,s)},q=(e,t)=>e===s?t:Y(e,t),G=(e,t=q)=>{const n=null===e?o:typeof e;return t(n===i&&J(e)?r:n,e)},Q=new FinalizationRegistry((([e,t,n])=>{n&&console.debug(`Held value ${String(t)} not relevant anymore`),e(t)})),V=Object.create(null),X=(e,t,{debug:n,handler:r,return:s,token:o=e}=V)=>{const a=s||new Proxy(e,r||V),i=[a,[t,e,!!n]];return!1!==o&&i.push(o),Q.register(...i),a},{defineProperty:Z,deleteProperty:ee,getOwnPropertyDescriptor:te,getPrototypeOf:ne,isExtensible:re,ownKeys:se,preventExtensions:oe,set:ae,setPrototypeOf:ie}=Reflect,{assign:ce,create:le}=Object,fe=ne(Int8Array),ue=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},pe=e=>t=>G(t,((t,n)=>{switch(t){case o:return Y(o,n);case i:if(n===globalThis)return Y(t,null);case r:case s:return e(t,n);case"boolean":case a:case c:case f:case"bigint":return Y(t,n);case l:{if(ge.has(n))return Y(t,ge.get(n));let e=Symbol.keyFor(n);if(e)return Y(t,`.${e}`)}}throw new TypeError(`Unable to handle this ${t}: ${String(n)}`)})),ge=new Map(se(Symbol).filter((e=>typeof Symbol[e]===l)).map((e=>[Symbol[e],e]))),ye=e=>{if(e.startsWith("."))return Symbol.for(e.slice(1));for(const[t,n]of ge)if(n===e)return t},de=e=>e;var we=(e=>{const t=new WeakMap;{const{addEventListener:e}=EventTarget.prototype;Z(EventTarget.prototype,"addEventListener",{value(n,r,...s){return s.at(0)?.invoke&&(t.has(this)||t.set(this,new Map),t.get(this).set(n,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,n,r,...s)}})}return function(n,o,T,...S){let x=0,W=this?.transform||de;const A=new Map,O=new Map,{[T]:$}=n,L=S.length?ce(le(globalThis),...S):globalThis,D=pe(((e,t)=>{if(!A.has(t)){let n;for(;O.has(n=x++););A.set(t,n),O.set(n,e===s?t:W(t))}return Y(e,A.get(t))})),R=e=>{$(M,Y(c,e))},B=(e,n)=>{switch(e){case i:if(null==n)return L;case r:if(typeof n===a)return O.get(n);if(!(n instanceof fe))for(const e in n)n[e]=C(n[e]);return n;case s:if(typeof n===c){const e=O.get(n)?.deref();if(e)return e;const r=function(...e){return e.at(0)instanceof Event&&(e=>{const{currentTarget:n,target:r,type:s}=e;for(const o of t.get(n||r)?.get(s)||[])e[o]()})(...e),$(u,Y(s,n),D(this),e.map(D))};return O.set(n,new WeakRef(r)),X(n,R,{return:r,token:!1})}return O.get(n);case l:return ye(n)}return n},C=e=>H(e,B),N={[u]:(e,t,n)=>D(e.apply(t,n)),[p]:(e,t)=>D(new e(...t)),[g]:(e,t,n)=>D(Z(e,t,n)),[y]:(e,t)=>D(ee(e,t)),[h]:e=>D(ne(e)),[d]:(e,t)=>D(e[t]),[w]:(e,t)=>{const n=te(e,t);return n?Y(i,ue(n,D)):Y(f,n)},[b]:(e,t)=>D(t in e),[m]:e=>D(re(e)),[v]:e=>Y(r,se(e).map(D)),[E]:e=>D(oe(e)),[k]:(e,t,n)=>D(ae(e,t,n)),[P]:(e,t)=>D(ie(e,t)),[M](e){A.delete(O.get(e)),O.delete(e)}};return n[o]=(e,t,...n)=>{switch(e){case u:n[0]=C(n[0]),n[1]=n[1].map(C);break;case p:n[0]=n[0].map(C);break;case g:{const[e,t]=n;n[0]=C(e);const{get:r,set:s,value:o}=t;r&&(t.get=C(r)),s&&(t.set=C(s)),o&&(t.value=C(o));break}default:n=n.map(C)}return N[e](C(t),...n)},{proxy:n,[e.toLowerCase()]:L,[`is${e}Proxy`]:()=>!1}}})("Window"),he=(e=>{let t=0;const n=new Map,o=new Map,f=Symbol();return function(T,S,x){const W=this?.transform||de,{[S]:A}=T,O=new Map,$=e=>{O.delete(e),A(M,L(e))},L=pe(((e,r)=>{if(f in r)return F(r[f]);if(e===s){if(r=W(r),!o.has(r)){let e;for(;o.has(e=String(t++)););n.set(r,e),o.set(e,r)}return Y(e,n.get(r))}if(!(r instanceof fe)){r=W(r);for(const e in r)r[e]=L(r[e])}return Y(e,r)})),D=(e,t,n)=>{const r=O.get(n)?.deref();if(r)return r;const o=t===s?(e=>K.bind(e))(e):e,a=new Proxy(o,C);return O.set(n,new WeakRef(a)),X(n,$,{return:a,token:!1})},R=e=>H(e,((t,n)=>{switch(t){case i:if(null===n)return globalThis;case r:return typeof n===a?D(e,t,n):n;case s:return typeof n===c?o.get(n):D(e,t,n);case l:return ye(n)}return n})),B=(e,t,...n)=>R(A(e,F(t),...n)),C={[u]:(e,t,n)=>B(u,e,L(t),n.map(L)),[p]:(e,t)=>B(p,e,t.map(L)),[g]:(e,t,n)=>{const{get:r,set:o,value:a}=n;return typeof r===s&&(n.get=L(r)),typeof o===s&&(n.set=L(o)),typeof a===s&&(n.value=L(a)),B(g,e,L(t),n)},[y]:(e,t)=>B(y,e,L(t)),[h]:e=>B(h,e),[d]:(e,t)=>t===f?e:B(d,e,L(t)),[w]:(e,t)=>{const n=B(w,e,L(t));return n&&ue(n,R)},[b]:(e,t)=>t===f||B(b,e,L(t)),[m]:e=>B(m,e),[v]:e=>B(v,e).map(R),[E]:e=>B(E,e),[k]:(e,t,n)=>B(k,e,L(t),L(n)),[P]:(e,t)=>B(P,e,L(t))};T[x]=(e,t,r,s)=>{switch(e){case u:return R(t).apply(R(r),s.map(R));case M:{const e=R(t);n.delete(o.get(e)),o.delete(e)}}};const N=new Proxy(Y(i,null),C);return{[e.toLowerCase()]:N,[`is${e}Proxy`]:e=>typeof e===i&&!!e&&f in e,proxy:T}}})("Window"),be=typeof Worker===s?Worker:class{};const me=new WeakMap,ve=(e,...r)=>{const s=U(e,...r);if(!me.has(s)){const o=e instanceof be?we:he;me.set(s,o.call(r.at(0),s,t,n))}return me.get(s)};ve.transfer=U.transfer;export{ve as default};
