const e="array",t="function",r="null",n="number",s="object",a="symbol",o="undefined",c="apply",l="construct",i="defineProperty",u="deleteProperty",f="get",p="getOwnPropertyDescriptor",y="getPrototypeOf",d="has",w="isExtensible",g="ownKeys",h="preventExtensions",b="set",E="setPrototypeOf";var v=Object.freeze({__proto__:null,APPLY:c,CONSTRUCT:l,DEFINE_PROPERTY:i,DELETE_PROPERTY:u,GET:f,GET_OWN_PROPERTY_DESCRIPTOR:p,GET_PROTOTYPE_OF:y,HAS:d,IS_EXTENSIBLE:w,OWN_KEYS:g,PREVENT_EXTENSION:h,SET:b,SET_PROTOTYPE_OF:E});function T(){return this}const m=new FinalizationRegistry((([e,t,r])=>{r&&console.debug(`Held value ${String(t)} not relevant anymore`),e(t)})),O=Object.create(null),{Object:P,Proxy:k,Reflect:S}=globalThis,{isArray:A}=Array,{ownKeys:R}=S,{create:x,hasOwn:_,values:M}=P,I=(r,n)=>n===e?r[0]:n===t?r():n===s?r.$:r,j=(e,t,r,n)=>{const s={type:{value:t}},a=_(e,"valueOf");for(const o of M(v)){let c=n(e[o]||S[o]);if(a&&o===f){const{valueOf:n}=e,{value:s}=c;c={value(e,a,...o){return a===r?n.call(this,I(e,t)):s.call(this,e,a,...o)}}}s[o]=c}return x(e,s)},$=(e,r,n,a=e)=>{if(a===e)switch(typeof e){case s:case o:a||(a=!1);case t:break;default:a=!1,r===e&&(r=P(e))}const c=new k(r,n),{destruct:l}=n;return l?((e,t,{debug:r,handler:n,return:s,token:a=e}=O)=>{const o=s||new Proxy(e,n||O),c=[o,[t,e,!!r]];return!1!==a&&c.push(a),m.register(...c),o})(e,l,{token:a,return:c}):c},N=t=>n=>{const a=typeof n;return a===s?n?t.get(n)?.[0]??(t=>A(t)?e:s)(n):r:a},W=e=>n=>{let a=typeof n;switch(a){case s:if(!n){a=r;break}case t:const o=e.get(n);o&&([a,n]=o)}return[a,n]},Y=e=>((e=>{m.unregister(e)})(e),e);var D=r=>{const n=new WeakMap,a=Symbol(),o={},c=(e,t,r)=>(n.set(e,[t,r]),e),l={proxy:o,release:Y,pair:W(n),typeOf:N(n),isProxy:e=>n.has(e),valueOf:e=>e[a]??e.valueOf()};for(const n of R(r)){if(_(l,n))continue;const i=r[n];switch(n){case e:{const t=j(i,n,a,(e=>({value([t],...r){return e.call(this,t,...r)}})));o[n]=(r,...n)=>c($(r,[r],t,...n),e,r);break}case t:{const e=j(i,n,a,(e=>({value(t,...r){return e.call(this,t(),...r)}})));o[n]=(r,...n)=>{return c($(r,(s=r,T.bind(s)),e,...n),t,r);var s};break}case s:{const e=j(i,n,a,(e=>({value({$:t},...r){return e.call(this,t,...r)}})));o[n]=(t,...r)=>c($(t,{$:t},e,...r),s,t);break}default:{const e=j(i,n,a,(e=>({value:e})));o[n]=(t,...r)=>c($(t,t,e,...r),n,t);break}}}return l};let L=0;const B=new Map,C=new Map,F=e=>C.get(e),U=e=>{if(!B.has(e)){let t;for(;C.has(t=L++););B.set(e,t),C.set(t,e)}return B.get(e)},{ArrayBuffer:z,Atomics:H,Promise:G}=globalThis,{isArray:K}=Array,{create:X,getPrototypeOf:q,values:J}=Object,V=q(Int32Array),Q=X(H),Z=({currentTarget:e,type:t,origin:r,lastEventId:n,source:s,ports:a},o)=>e.dispatchEvent(new MessageEvent(t,{data:o,origin:r,lastEventId:n,source:s,ports:a})),ee=()=>G.withResolvers();let te=0;const re=new Map,ne=(e,t)=>class extends e{constructor(e,...r){super(e,...r),e instanceof t&&re.set(this,[te++,0,ee()])}},se=new WeakSet,ae=e=>(se.add(e),e),oe=(e,t)=>{const{data:r}=e,n=K(r)&&(r.at(0)===t||0===r.at(1)&&!t);return n&&(e.stopImmediatePropagation(),e.preventDefault()),n},ce=e=>null!==e&&"object"==typeof e&&!se.has(e),le=new WeakMap,ie=(e,t,r)=>{if(re.has(e))t.set(e,re.get(e)[0]);else if(!(e instanceof V||e instanceof z))for(const n of J(e))ce(n)&&!r.has(n)&&(r.add(n),ie(n,t,r))},ue=(...e)=>({value:new G((t=>{let r=new Worker("data:application/javascript,onmessage%3De%3D%3EpostMessage(!Atomics.wait(...e.data))");r.onmessage=()=>t("ok"),r.postMessage(e)}))}),fe=(e,t)=>{const r=re.get(e),[n,s,{promise:a}]=r;return r[1]=t,[n,a]};let{BigInt64Array:pe,Int32Array:ye,SharedArrayBuffer:de,addEventListener:we,postMessage:ge}=globalThis,he=!0,be=e=>e,Ee=!1;const ve=ee();try{new de(4),Q.waitAsync||(Q.waitAsync=ue),ve.resolve()}catch(e){const t=ge,r=we,n=[];let s="",a="";de=class extends z{},pe=ne(pe,de),ye=ne(ye,de),be=ae,Ee=!0,Q.notify=(e,r)=>{const[n]=(e=>le.get(e))(e);return t([s,1,e,n,r]),0},Q.waitAsync=(...e)=>{const[t,r]=fe(...e);return{value:r}},Q.wait=(e,t,...r)=>{const[n]=fe(e,t,...r),o=new XMLHttpRequest;o.responseType="json",o.open("POST",`${a}?sabayon`,!1),o.setRequestHeader("Content-Type","application/json"),o.send(`["${s}",${n},${t}]`);const{response:c}=o;re.delete(e);for(let t=0;t<c.length;t++)e[t]=c[t];return"ok"},r("message",(e=>{if(oe(e,s)){const[t,r,...n]=e.data;switch(r){case 0:s=t,a=n.at(0)?.serviceWorker||"",a||(Q.wait=null,ve.resolve());break;case 1:((e,t,r)=>{for(const[n,[s,a,{resolve:o}]]of re)if(t===s&&r===a){for(let t=0;t<e.length;t++)n[t]=e[t];re.delete(n),o("ok");break}})(...n);break;case 2:((e,t,r)=>{for(const[r,n]of t)le.set(r,[n,e.currentTarget]);Z(e,r)})(e,...n);break;case 3:ve.resolve()}}else if(he){const{currentTarget:t,type:r,origin:s,lastEventId:a,source:o,ports:c}=e;n.push([{currentTarget:t,type:r,origin:s,lastEventId:a,source:o,ports:c},e.data])}})),we=(e,...t)=>{if(r(e,...t),n.length)for(const e of n.splice(0))Z(...e)},ge=(e,...r)=>t(((e,t)=>{const r=new Map;return ce(t)&&ie(t,r,new Set),r.size?[e,2,r,t]:t})(s,e),...r)}await ve.promise,he=!1;const{BYTES_PER_ELEMENT:Te}=Int32Array,{BYTES_PER_ELEMENT:me}=Uint16Array,{notify:Oe}=Q,Pe=new TextDecoder("utf-16"),ke=new WeakSet,Se=(...e)=>(ke.add(e),e);let Ae="";const Re=(e,t,r,n)=>{const[s]=n,a=r.get(s);if(!a)throw new Error(`Unknown proxy.${s}()`);e(a,t,n)};let xe=0;const _e=([e,t,r,n,s,a,o,c,l],i)=>(...u)=>{let f=""!==Ae,p=0;f&&"="!==Ae[0]&&"-"!==Ae[0]&&(p=((e,t)=>setTimeout(console.warn,3e3,`💀🔒 - proxy.${e}() in proxy.${t}()`))(i,Ae));const y=xe++,d=[];ke.has(u.at(-1)||d)&&ke.delete(d=u.pop());const w=r(c?u.map(c):u);let g=t(2*Te);return o([e,2,i,y,g,w,n],{transfer:d}),l(g,0).value.then((()=>{f&&clearTimeout(p);const r=g[1];if(!r)return;const n=me*r;return g=t(n+n%Te),o([e,1,y,g]),l(g,0).value.then((()=>{const e=new Uint16Array(g.buffer),t=a?e.subarray(0,r):e.slice(0,r);return s(Pe.decode(t))}))}))},Me=(e,t)=>new Proxy(t,{get:(t,r)=>{let n;return"then"!==r&&(n=t.get(r),n||(n=_e(e,r),t.set(r,n))),n},set:(e,t,r)=>"then"!==t&&!!e.set(t,r)}),{wait:Ie,waitAsync:je}=Q;var $e=({parse:e,stringify:t,transform:r,interrupt:n}=JSON)=>{const s=((e,t)=>async(r,n,[s,a,o,c,l])=>{l&&(Ae=s);try{const s=await r(...c);if(void 0!==s){const r=e(t?t(s):s);n.set(a,r),o[1]=r.length}}finally{l&&(Ae=""),o[0]=1,Oe(o,0)}})(t,r),a=ee(),o=new Map,c=new Map;let l="",i=Ie;if(Ie&&n){const{handler:e,timeout:t=42}=n;i=(r,n,s)=>{for(;"timed-out"===(s=Ie(r,n,0,t));)e();return s}}return we("message",(t=>{if(oe(t,l)){const[n,u,...f]=t.data;switch(u){case 0:{const t=!!Ie;l=n,a.resolve({polyfill:Ee,sync:t,transfer:Se,proxy:Me([l,e=>new ye(new de(e)),be,t,e,Ee,ge,r,t?(...e)=>({value:{then:t=>t(i(...e))}}):je],o)});break}case 2:o.size?Re(s,c,o,f):setTimeout(Re,0,s,c,o,f);break;case 1:((e,[t,r])=>{const n=e.get(t);e.delete(t);for(let e=new Uint16Array(r.buffer),t=0,{length:s}=n;t<s;t++)e[t]=n.charCodeAt(t);Oe(r,0)})(c,f)}}})),a.promise},Ne=Object.fromEntries([e,"bigint","boolean",t,r,n,s,"string",a,o].map(((e,t)=>[e,t])));const We="destruct",{[g]:Ye}=Reflect,De=new Map(Ye(Symbol).filter((e=>typeof Symbol[e]===a)).map((e=>[Symbol[e],e]))),Le=e=>De.get(e)||`.${Symbol.keyFor(e)||""}`,Be="960fd6fe-ad03-40d1-a314-e58d84bce14f",Ce="="+Be,Fe="-"+Be,{[c]:Ue}=Reflect;var ze=async r=>{const o=await $e(r),v=r?.transform||(e=>e),{[Ce]:T}=o.proxy,m=new Map,O=(e,t)=>{let r=m.get(e)?.deref();return r||m.set(e,new WeakRef(r=t(e))),r},P=([r,o])=>{switch(r){case Ne[s]:return null==o?globalThis:typeof o===n?O(o,x.object):o;case Ne[e]:return typeof o===n?O(o,x.array):o;case Ne[t]:return typeof o===n?O(o,x.function):F(parseInt(o));case Ne[a]:return(e=>{if(e.startsWith("."))return Symbol.for(e.slice(1));for(const[t,r]of De)if(r===e)return t})(o);default:return o}},k=r=>{let[o,c]=M(r);switch(o){case s:if(c==globalThis||null==c)c=null;else if(typeof c===s&&!(c instanceof V)){c=v(c);for(const e in c)c[e]=k(c[e])}return[Ne[s],c];case e:return[Ne[e],typeof c===n?c:v(c).map(k)];case t:return[Ne[t],typeof c===t?String(U(v(c))):c];case a:return[Ne[a],Le(r)];default:return[Ne[o],c]}},S=(...e)=>P(T(...e)),A={[i]:(e,t,r)=>S(i,e,k(t),k(r)),[u]:(e,t)=>S(u,e,k(t)),[f]:(e,t)=>S(f,e,k(t)),[y]:e=>S(y,e),[p]:(e,t)=>{const r=S(p,e,k(t));if(r){const{get:e,set:t,value:n}=r;e&&(r.get=P(e)),t&&(r.set=P(t)),n&&(r.value=P(n))}return r},[d]:(e,t)=>S(d,e,k(t)),[w]:e=>S(w,e),[g]:e=>S(g,e).map(P),[h]:e=>S(h,e),[b]:(e,t,r)=>S(b,e,k(t),k(r)),[E]:(e,t)=>S(E,e,k(t)),[We](e){m.delete(e),T(We,e)}},R={object:A,array:A,function:{...A,[c]:(e,...t)=>S(c,e,...t.map(k)),[l]:(e,...t)=>S(l,e,...t.map(k))}},{proxy:x,isProxy:_,pair:M}=D(R),I=x.object(null);return o.proxy[Fe]=async(e,t,...r)=>{const s=parseInt(t);switch(e){case c:{const[e,t]=r;return k(await Ue(F(s),P(e),t.map(P)))}case We:(e=>{const[t,r]=typeof e===n?[C,B]:[B,C],s=t.has(e);s&&(r.delete(t.get(e)),t.delete(e))})(s)}},{...o,window:I,isWindowProxy:_}};export{ze as default};
