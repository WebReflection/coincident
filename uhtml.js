const e="cb511e41-9ebf-4af3-a74a-83c295a50833",t="M"+e,n="T"+e;var r=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:s,Map:o,SharedArrayBuffer:a,Uint16Array:i}=globalThis,{BYTES_PER_ELEMENT:l}=s,{BYTES_PER_ELEMENT:c}=i,{isArray:u}=Array,{notify:f,wait:p,waitAsync:d}=Atomics,{fromCharCode:g}=String,h=new WeakSet,y=new WeakMap;let w=0;const m=(t,{parse:n=JSON.parse,stringify:m=JSON.stringify,transform:b,interrupt:v}=JSON)=>{if(!y.has(t)){const E=(n,...r)=>t.postMessage({[e]:r},{transfer:n}),x="function"==typeof v?v:v?.handler||(()=>{}),k=v?.delay||42,A=(e,t)=>e?(d||r)(t,0):(((e,t,n)=>{for(;"timed-out"===p(e,0,0,t);)n()})(t,k,x),{value:{then:e=>e()}});let N=!1;y.set(t,new Proxy(new o,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(e,r)=>"then"===r?null:(...e)=>{const o=w++;let u=new s(new a(l)),f=[];h.has(e.at(-1)||f)&&h.delete(f=e.pop()),E(f,o,u,r,b?e.map(b):e);const p=t!==globalThis;let d=0;return N&&p&&(d=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),A(p,u).value.then((()=>{clearTimeout(d);const e=u[0];if(!e)return;const t=c*e;return u=new s(new a(t+t%l)),E([],o,u),A(p,u).value.then((()=>n(g(...new i(u.buffer).slice(0,e)))))}))},set(n,r,s){if(!n.size){const r=new o;t.addEventListener("message",(async t=>{const s=t.data?.[e];if(u(s)){t.stopImmediatePropagation();const[e,o,...a]=s;if(a.length){const[t,s]=a;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);N=!0;try{const a=await n.get(t)(...s);if(void 0!==a){const t=m(b?b(a):a);r.set(e,t),o[0]=t.length}}finally{N=!1}}else{const t=r.get(e);r.delete(e);for(let e=new i(o.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}f(o,0)}}))}return!!n.set(r,s)}}))}return y.get(t)};m.transfer=(...e)=>(h.add(e),e);const b="object",v="function",E="number",x="string",k="undefined",A="symbol",{defineProperty:N,getOwnPropertyDescriptor:T,getPrototypeOf:C,isExtensible:M,ownKeys:S,preventExtensions:O,set:P,setPrototypeOf:$}=Reflect,{assign:L,create:W}=Object,R=C(Int8Array),B="isArray",D=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},_=(e,t)=>[e,t],j=e=>t=>{const n=typeof t;switch(n){case b:if(null==t)return _("null",t);if(t===globalThis)return _(b,null);case v:return e(n,t);case"boolean":case E:case x:case k:case"bigint":return _(n,t);case A:if(z.has(t))return _(n,z.get(t))}throw new Error(`Unable to handle this ${n} type`)},z=new Map(S(Symbol).filter((e=>typeof Symbol[e]===A)).map((e=>[Symbol[e],e]))),F=e=>{for(const[t,n]of z)if(n===e)return t};function H(){return this}const I="apply",J="construct",U="defineProperty",K="deleteProperty",Y="get",q="getOwnPropertyDescriptor",G="getPrototypeOf",Q="has",V="isExtensible",X="ownKeys",Z="preventExtensions",ee="set",te="setPrototypeOf",ne="delete";var re=((e,t)=>{const n=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;N(EventTarget.prototype,"addEventListener",{value(t,r,...s){return s.at(0)?.invoke&&(n.has(this)||n.set(this,new Map),n.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,r,...s)}})}const r=t&&(e=>{const{currentTarget:t,target:r,type:s}=e;for(const o of n.get(t||r)?.get(s)||[])e[o]()});return(n,s,o,...a)=>{let i=0;const l=new Map,c=new Map,{[o]:u}=n,f=a.length?L(W(globalThis),...a):globalThis,p=j(((e,t)=>{if(!l.has(t)){let e;for(;c.has(e=i++););l.set(t,e),c.set(e,t)}return _(e,l.get(t))})),d=new FinalizationRegistry((e=>{u(ne,_(x,e))})),g=([e,n])=>{switch(e){case b:if(null==n)return f;if(typeof n===E)return c.get(n);if(!(n instanceof R))for(const e in n)n[e]=g(n[e]);return n;case v:if(typeof n===x){if(!c.has(n)){const e=function(...e){return t&&e.at(0)instanceof Event&&r(...e),u(I,_(v,n),p(this),e.map(p))},s=new WeakRef(e);c.set(n,s),d.register(e,n,s)}return c.get(n).deref()}return c.get(n);case A:return F(n)}return n},h={[I]:(e,t,n)=>p(e.apply(t,n)),[J]:(e,t)=>p(new e(...t)),[U]:(e,t,n)=>p(N(e,t,n)),[K]:(e,t)=>p(delete e[t]),[G]:e=>p(C(e)),[Y]:(e,t)=>p(e[t]),[q]:(e,t)=>{const n=T(e,t);return n?_(b,D(n,p)):_(k,n)},[Q]:(e,t)=>p(t in e),[V]:e=>p(M(e)),[X]:e=>_(b,S(e).map(p)),[Z]:e=>p(O(e)),[ee]:(e,t,n)=>p(P(e,t,n)),[te]:(e,t)=>p($(e,t)),[ne](e){l.delete(c.get(e)),c.delete(e)}};return n[s]=(e,t,...n)=>{switch(e){case I:n[0]=g(n[0]),n[1]=n[1].map(g);break;case J:n[0]=n[0].map(g);break;case U:{const[e,t]=n;n[0]=g(e);const{get:r,set:s,value:o}=t;r&&(t.get=g(r)),s&&(t.set=g(s)),o&&(t.value=g(o));break}default:n=n.map(g)}return h[e](g(t),...n)},{proxy:n,[e.toLowerCase()]:f,[`is${e}Proxy`]:()=>!1}}})("Window",!0),se=(e=>{let t=0;const n=new Map,r=new Map,s=Symbol(),o=e=>typeof e===v?e():e,a=e=>typeof e===b&&!!e&&s in e,i=Array[B],l=j(((e,a)=>{if(s in a)return o(a[s]);if(e===v){if(!r.has(a)){let e;for(;r.has(e=String(t++)););n.set(a,e),r.set(e,a)}return _(e,n.get(a))}if(!(a instanceof R))for(const e in a)a[e]=l(a[e]);return _(e,a)}));return(t,c,u)=>{const{[c]:f}=t,p=new Map,d=new FinalizationRegistry((e=>{p.delete(e),f(ne,l(e))})),g=e=>{const[t,n]=e;if(!p.has(n)){const r=t===v?H.bind(e):e,s=new Proxy(r,w),o=new WeakRef(s);p.set(n,o),d.register(s,n,o)}return p.get(n).deref()},h=e=>{const[t,n]=e;switch(t){case b:return null===n?globalThis:typeof n===E?g(e):n;case v:return typeof n===x?r.get(n):g(e);case A:return F(n)}return n},y=(e,t,...n)=>h(f(e,o(t),...n)),w={[I]:(e,t,n)=>y(I,e,l(t),n.map(l)),[J]:(e,t)=>y(J,e,t.map(l)),[U]:(e,t,n)=>{const{get:r,set:s,value:o}=n;return typeof r===v&&(n.get=l(r)),typeof s===v&&(n.set=l(s)),typeof o===v&&(n.value=l(o)),y(U,e,l(t),n)},[K]:(e,t)=>y(K,e,l(t)),[G]:e=>y(G,e),[Y]:(e,t)=>t===s?e:y(Y,e,l(t)),[q]:(e,t)=>{const n=y(q,e,l(t));return n&&D(n,h)},[Q]:(e,t)=>t===s||y(Q,e,l(t)),[V]:e=>y(V,e),[X]:e=>y(X,e).map(h),[Z]:e=>y(Z,e),[ee]:(e,t,n)=>y(ee,e,l(t),l(n)),[te]:(e,t)=>y(te,e,l(t))};t[u]=(e,t,s,o)=>{switch(e){case I:return h(t).apply(h(s),o.map(h));case ne:{const e=h(t);n.delete(r.get(e)),r.delete(e)}}};const m=new Proxy([b,null],w),k=m.Array[B];return N(Array,B,{value:e=>a(e)?k(e):i(e)}),{[e.toLowerCase()]:m,[`is${e}Proxy`]:a,proxy:t}}})("Window"),oe="function"==typeof Worker?Worker:class{};const ae=new WeakMap,ie=(e,...r)=>{const s=m(e,...r);if(!ae.has(s)){const r=e instanceof oe?re:se;ae.set(s,r(s,t,n))}return ae.get(s)};ie.transfer=m.transfer;class le extends WeakMap{set(e,t){return super.set(e,t),t}}
/*! (c) Andrea Giammarchi - ISC */const ce=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,ue=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g,fe=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,pe=/[\x01\x02]/g;var de=({document:e})=>{const{isArray:t,prototype:n}=Array,{indexOf:r}=n,{createDocumentFragment:s,createElement:o,createElementNS:a,createTextNode:i,createTreeWalker:l,importNode:c}=new Proxy({},{get:(t,n)=>e[n].bind(e)});let u;const f=(e,t)=>t?(e=>{u||(u=a("http://www.w3.org/2000/svg","svg")),u.innerHTML=e;const t=s();return t.append(...u.childNodes),t})(e):(e=>{const t=o("template");return t.innerHTML=e,t.content})(e),p=(t,n)=>111===t.nodeType?1/n<0?n?(({firstChild:t,lastChild:n})=>{const r=e.createRange();return r.setStartAfter(t),r.setEndAfter(n),r.deleteContents(),t})(t):t.lastChild:n?t.valueOf():t.firstChild:t,d=e=>null==e?e:e.valueOf(),g=(e,n)=>{let r,s,o=n.slice(2);return!(n in e)&&(s=n.toLowerCase())in e&&(o=s.slice(2)),n=>{const s=t(n)?n:[n,!1];r!==s[0]&&(r&&e.removeEventListener(o,r,s[1]),(r=s[0])&&e.addEventListener(o,r,s[1]))}},h=({childNodes:e},t)=>e[t],y=(e,t,n)=>((e,t,n,r,s)=>{const o=n.length;let a=t.length,i=o,l=0,c=0,u=null;for(;l<a||c<i;)if(a===l){const t=i<o?c?r(n[c-1],-0).nextSibling:r(n[i-c],0):s;for(;c<i;)e.insertBefore(r(n[c++],1),t)}else if(i===c)for(;l<a;)u&&u.has(t[l])||e.removeChild(r(t[l],-1)),l++;else if(t[l]===n[c])l++,c++;else if(t[a-1]===n[i-1])a--,i--;else if(t[l]===n[i-1]&&n[c]===t[a-1]){const s=r(t[--a],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[l++],-1).nextSibling),e.insertBefore(r(n[--i],1),s),t[a]=n[i]}else{if(!u){u=new Map;let e=c;for(;e<i;)u.set(n[e],e++)}if(u.has(t[l])){const s=u.get(t[l]);if(c<s&&s<i){let o=l,f=1;for(;++o<a&&o<i&&u.get(t[o])===s+f;)f++;if(f>s-c){const o=r(t[l],0);for(;c<s;)e.insertBefore(r(n[c++],1),o)}else e.replaceChild(r(n[c++],1),r(t[l++],-1))}else l++}else e.removeChild(r(t[l++],-1))}return n})(e.parentNode,t,n,p,e),w=(t,n)=>{switch(n[0]){case"?":return((e,t,n)=>r=>{const s=!!d(r);n!==s&&((n=s)?e.setAttribute(t,""):e.removeAttribute(t))})(t,n.slice(1),!1);case".":return((e,t)=>"dataset"===t?(({dataset:e})=>t=>{for(const n in t){const r=t[n];null==r?delete e[n]:e[n]=r}})(e):n=>{e[t]=n})(t,n.slice(1));case"@":return g(t,"on"+n.slice(1));case"o":if("n"===n[1])return g(t,n)}switch(n){case"ref":return(e=>{let t;return n=>{t!==n&&(t=n,"function"==typeof n?n(e):n.current=e)}})(t);case"aria":return(e=>t=>{for(const n in t){const r="role"===n?n:`aria-${n}`,s=t[n];null==s?e.removeAttribute(r):e.setAttribute(r,s)}})(t)}return((t,n)=>{let r,s=!0;const o=e.createAttributeNS(null,n);return e=>{const n=d(e);r!==n&&(null==(r=n)?s||(t.removeAttributeNode(o),s=!0):(o.value=n,s&&(t.setAttributeNodeNS(o),s=!1)))}})(t,n)};function m(e){const{type:n,path:r}=e,s=r.reduceRight(h,this);return"node"===n?(e=>{let n,r,s=[];const o=a=>{switch(typeof a){case"string":case"number":case"boolean":n!==a&&(n=a,r||(r=i("")),r.data=a,s=y(e,s,[r]));break;case"object":case"undefined":if(null==a){n!=a&&(n=a,s=y(e,s,[]));break}if(t(a)){n=a,0===a.length?s=y(e,s,[]):"object"==typeof a[0]?s=y(e,s,a):o(String(a));break}if(n!==a)if("ELEMENT_NODE"in a)n=a,s=y(e,s,11===a.nodeType?[...a.childNodes]:[a]);else{const e=a.valueOf();e!==a&&o(e)}break;case"function":o(a(e))}};return o})(s):"attr"===n?w(s,e.name):(e=>{let t;return n=>{const r=d(n);t!=r&&(t=r,e.textContent=null==r?"":r)}})(s)}const b=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(r.call(n.childNodes,e)),e=n,({parentNode:n}=e);return t},v="isµ",E=new le,x=/^(?:textarea|script|style|title|plaintext|xmp)$/,k=(e,t)=>{const n="svg"===e,r=((e,t,n)=>{let r=0;return e.join("").trim().replace(ue,((e,t,r,s)=>{let o=t+r.replace(fe,"=$2$1").trimEnd();return s.length&&(o+=n||ce.test(t)?" /":"></"+t),"<"+o+">"})).replace(pe,(e=>""===e?"\x3c!--"+t+r+++"--\x3e":t+r++))})(t,v,n),s=f(r,n),o=l(s,129),a=[],i=t.length-1;let c=0,u=`${v}${c}`;for(;c<i;){const e=o.nextNode();if(!e)throw`bad template: ${r}`;if(8===e.nodeType)e.data===u&&(a.push({type:"node",path:b(e)}),u=`${v}${++c}`);else{for(;e.hasAttribute(u);)a.push({type:"attr",path:b(e),name:e.getAttribute(u)}),e.removeAttribute(u),u=`${v}${++c}`;x.test(e.localName)&&e.textContent.trim()===`\x3c!--${u}--\x3e`&&(e.textContent="",a.push({type:"text",path:b(e)}),u=`${v}${++c}`)}}return{content:s,nodes:a}},A=(e,t)=>{const{content:n,nodes:r}=E.get(t)||E.set(t,k(e,t)),s=c(n,!0);return{content:s,updates:r.map(m,s)}},N=(e,{type:t,template:n,values:r})=>{const s=T(e,r);let{entry:o}=e;o&&o.template===n&&o.type===t||(e.entry=o=((e,t)=>{const{content:n,updates:r}=A(e,t);return{type:e,template:t,content:n,updates:r,wire:null}})(t,n));const{content:a,updates:i,wire:l}=o;for(let e=0;e<s;e++)i[e](r[e]);return l||(o.wire=(e=>{const{firstChild:t,lastChild:n}=e;if(t===n)return n||e;const{childNodes:r}=e,s=[...r];return{ELEMENT_NODE:1,nodeType:111,firstChild:t,lastChild:n,valueOf:()=>(r.length!==s.length&&e.append(...s),e)}})(a))},T=({stack:e},n)=>{const{length:r}=n;for(let s=0;s<r;s++){const r=n[s];r instanceof C?n[s]=N(e[s]||(e[s]={stack:[],entry:null,wire:null}),r):t(r)?T(e[s]||(e[s]={stack:[],entry:null,wire:null}),r):e[s]=null}return r<e.length&&e.splice(r),r};class C{constructor(e,t,n){this.type=e,this.template=t,this.values=n}}const M=e=>{const t=new le;return Object.assign(((t,...n)=>new C(e,t,n)),{for(n,r){const s=t.get(n)||t.set(n,new MapSet);return s.get(r)||s.set(r,(t=>(n,...r)=>N(t,{type:e,template:n,values:r}))({stack:[],entry:null,wire:null}))},node:(t,...n)=>N({stack:[],entry:null,wire:null},new C(e,t,n)).valueOf()})},S=new le,O=M("html"),P=M("svg");return{Hole:C,render:(e,t)=>{const n="function"==typeof t?t():t,r=S.get(e)||S.set(e,{stack:[],entry:null,wire:null}),s=n instanceof C?N(r,n):n;return s!==r.wire&&(r.wire=s,e.replaceChildren(s.valueOf())),e},html:O,svg:P}};const ge=(e,...t)=>{const n=ie(e,...t);return n.uhtml||(n.uhtml=de(n.window)),n};ge.transfer=ie.transfer;export{ge as default};
