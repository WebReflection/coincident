var e="cf71ff20-9787-4f8b-86e3-bea50ff4632f",t=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,"+encodeURIComponent("onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))"));n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:n,Map:r,SharedArrayBuffer:s,Uint16Array:o}=globalThis,{BYTES_PER_ELEMENT:a}=n,{BYTES_PER_ELEMENT:i}=o,{isArray:l}=Array,{notify:c,wait:u,waitAsync:f}=Atomics,{fromCharCode:p}=String,d=(e,n)=>e?(f||t)(n,0):(u(n,0),{value:{then:e=>e()}}),h=new WeakSet,g=new WeakMap;let w=0;const y=(t,{parse:u,stringify:f}=JSON)=>{if(!g.has(t)){const y=(n,...r)=>t.postMessage({[e]:r},{transfer:n});g.set(t,new Proxy(new r,{has:(e,t)=>"string"==typeof t&&!t.startsWith("_"),get:(e,r)=>"then"===r?null:(...e)=>{const l=w++;let c=new n(new s(a)),f=[];h.has(e.at(-1)||f)&&h.delete(f=e.pop()),y(f,l,c,r,e);const g=t instanceof Worker;return d(g,c).value.then((()=>{const e=c[0];if(!e)return;const t=i*e;return c=new n(new s(t+t%a)),y([],l,c),d(g,c).value.then((()=>u(p(...new o(c.buffer).slice(0,e)))))}))},set(n,s,a){if(!n.size){const s=new r;t.addEventListener("message",(async t=>{const r=t.data?.[e];if(l(r)){t.stopImmediatePropagation();const[e,a,...i]=r;if(i.length){const[t,r]=i;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);{const o=f(await n.get(t)(...r));o&&(s.set(e,o),a[0]=o.length)}}else{const t=s.get(e);s.delete(e);for(let e=new o(a.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}c(a,0)}}))}return!!n.set(s,a)}}))}return g.get(t)};y.transfer=(...e)=>(h.add(e),e);const m="object",b="function",v="number",x="string",E="undefined",k="symbol",{defineProperty:A,getOwnPropertyDescriptor:M,getPrototypeOf:N,isExtensible:T,ownKeys:C,preventExtensions:P,set:S,setPrototypeOf:O}=Reflect,$=N(Int8Array),W=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},L=(e,t)=>[e,t],R=e=>t=>{const n=typeof t;switch(n){case m:if(null==t)return L("null",t);case b:return e(n,t);case"boolean":case v:case x:case E:case"bigint":return L(n,t);case k:if(_.has(t))return L(n,_.get(t))}throw new Error(`Unable to handle this ${n} type`)},_=new Map(C(Symbol).filter((e=>typeof Symbol[e]===k)).map((e=>[Symbol[e],e]))),B=e=>{for(const[t,n]of _)if(n===e)return t},D="apply",j="construct",z="defineProperty",I="deleteProperty",U="get",F="getOwnPropertyDescriptor",H="getPrototypeOf",K="has",Y="isExtensible",G="ownKeys",J="preventExtensions",q="set",Q="setPrototypeOf",V="delete";let X=0;const Z=new Map,ee=new Map,te=new WeakMap;if(globalThis.window===globalThis){const{addEventListener:e}=EventTarget.prototype;A(EventTarget.prototype,"addEventListener",{value(t,n,...r){return r.at(0)?.invoke&&(te.has(this)||te.set(this,new Map),te.get(this).set(t,[].concat(r[0].invoke)),delete r[0].invoke),e.call(this,t,n,...r)}})}const ne=R(((e,t)=>{if(!Z.has(t)){let e;for(;ee.has(e=X++););Z.set(t,e),ee.set(e,t)}return L(e,Z.get(t))}));var re=(e,t,n)=>{const{[n]:r}=e,s=new FinalizationRegistry((e=>{r(V,L(x,e))})),o=([e,t])=>{switch(e){case m:if(null==t)return globalThis;if(typeof t===v)return ee.get(t);if(!(t instanceof $))for(const e in t)t[e]=o(t[e]);return t;case b:if(typeof t===x){if(!ee.has(t)){const e=function(...e){return e.at(0)instanceof Event&&(e=>{const{currentTarget:t,target:n,type:r}=e;for(const s of te.get(t||n)?.get(r)||[])e[s]()})(...e),r(D,L(b,t),ne(this),e.map(ne))},n=new WeakRef(e);ee.set(t,n),s.register(e,t,n)}return ee.get(t).deref()}return ee.get(t);case k:return B(t)}return t},a={[D]:(e,t,n)=>ne(e.apply(t,n)),[j]:(e,t)=>ne(new e(...t)),[z]:(e,t,n)=>ne(A(e,t,n)),[I]:(e,t)=>ne(delete e[t]),[H]:e=>ne(N(e)),[U]:(e,t)=>ne(e[t]),[F]:(e,t)=>{const n=M(e,t);return n?L(m,W(n,ne)):L(E,n)},[K]:(e,t)=>ne(t in e),[Y]:e=>ne(T(e)),[G]:e=>L(m,C(e).map(ne)),[J]:e=>ne(P(e)),[q]:(e,t,n)=>ne(S(e,t,n)),[Q]:(e,t)=>ne(O(e,t)),[V](e){Z.delete(ee.get(e)),ee.delete(e)}};return e[t]=(e,t,...n)=>{switch(e){case D:n[0]=o(n[0]),n[1]=n[1].map(o);break;case j:n[0]=n[0].map(o);break;case z:{const[e,t]=n;n[0]=o(e);const{get:r,set:s,value:a}=t;r&&(t.get=o(r)),s&&(t.set=o(s)),a&&(t.value=o(a));break}default:n=n.map(o)}return a[e](o(t),...n)},{proxy:e,window:globalThis,isWindowProxy:()=>!1}};let se=0;const oe=new Map,ae=new Map,ie=Symbol(),le=e=>typeof e===b?e():e,ce=e=>typeof e===m&&!!e&&ie in e,ue="isArray",fe=Array[ue],pe=R(((e,t)=>{if(ie in t)return le(t[ie]);if(e===b){if(!ae.has(t)){let e;for(;ae.has(e=String(se++)););oe.set(t,e),ae.set(e,t)}return L(e,oe.get(t))}if(!(t instanceof $))for(const e in t)t[e]=pe(t[e]);return L(e,t)}));var de=(e,t,n)=>{const{[t]:r}=e,s=new Map,o=new FinalizationRegistry((e=>{s.delete(e),r(V,pe(e))})),a=e=>{const[t,n]=e;if(!s.has(n)){const r=t===b?he.bind(e):e,a=new Proxy(r,c),i=new WeakRef(a);s.set(n,i),o.register(a,n,i)}return s.get(n).deref()},i=e=>{const[t,n]=e;switch(t){case m:return typeof n===v?a(e):n;case b:return typeof n===x?ae.get(n):a(e);case k:return B(n)}return n},l=(e,t,...n)=>i(r(e,le(t),...n)),c={[D]:(e,t,n)=>l(D,e,pe(t),n.map(pe)),[j]:(e,t)=>l(j,e,t.map(pe)),[z]:(e,t,n)=>{const{get:r,set:s,value:o}=n;return typeof r===b&&(n.get=pe(r)),typeof s===b&&(n.set=pe(s)),typeof o===b&&(n.value=pe(o)),l(z,e,pe(t),n)},[I]:(e,t)=>l(I,e,pe(t)),[H]:e=>l(H,e),[U]:(e,t)=>t===ie?e:l(U,e,pe(t)),[F]:(e,t)=>{const n=l(F,e,pe(t));return n&&W(n,i)},[K]:(e,t)=>t===ie||l(K,e,pe(t)),[Y]:e=>l(Y,e),[G]:e=>l(G,e).map(i),[J]:e=>l(J,e),[q]:(e,t,n)=>l(q,e,pe(t),pe(n)),[Q]:(e,t)=>l(Q,e,pe(t))};e[n]=(e,t,n,r)=>{switch(e){case D:return i(t).apply(i(n),r.map(i));case V:{const e=i(t);oe.delete(ae.get(e)),ae.delete(e)}}};const u=new Proxy([m,null],c),f=u.Array[ue];return A(Array,ue,{value:e=>ce(e)?f(e):fe(e)}),{window:u,isWindowProxy:ce,proxy:e,get global(){return console.warn("Deprecated: please access `window` field instead"),this.window},get isGlobal(){return function(e){return console.warn("Deprecated: please access `isWindowProxy` field instead"),this.isWindowProxy(e)}.bind(this)}}};function he(){return this}const ge=e+"M",we=e+"T",ye=new WeakMap,me=(e,...t)=>{const n=y(e,...t);if(!ye.has(n)){const t=e instanceof Worker?re:de;ye.set(n,t(n,ge,we))}return ye.get(n)};me.transfer=y.transfer;class be extends WeakMap{set(e,t){return super.set(e,t),t}}
/*! (c) Andrea Giammarchi - ISC */const ve=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,xe=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g,Ee=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,ke=/[\x01\x02]/g;var Ae=({document:e})=>{const{isArray:t,prototype:n}=Array,{indexOf:r}=n,{createDocumentFragment:s,createElement:o,createElementNS:a,createTextNode:i,createTreeWalker:l,importNode:c}=new Proxy({},{get:(t,n)=>e[n].bind(e)});let u;const f=(e,t)=>t?(e=>{u||(u=a("http://www.w3.org/2000/svg","svg")),u.innerHTML=e;const t=s();return t.append(...u.childNodes),t})(e):(e=>{const t=o("template");return t.innerHTML=e,t.content})(e),p=(t,n)=>111===t.nodeType?1/n<0?n?(({firstChild:t,lastChild:n})=>{const r=e.createRange();return r.setStartAfter(t),r.setEndAfter(n),r.deleteContents(),t})(t):t.lastChild:n?t.valueOf():t.firstChild:t,d=e=>null==e?e:e.valueOf(),h=(e,n)=>{let r,s,o=n.slice(2);return!(n in e)&&(s=n.toLowerCase())in e&&(o=s.slice(2)),n=>{const s=t(n)?n:[n,!1];r!==s[0]&&(r&&e.removeEventListener(o,r,s[1]),(r=s[0])&&e.addEventListener(o,r,s[1]))}},g=({childNodes:e},t)=>e[t],w=(e,t,n)=>((e,t,n,r,s)=>{const o=n.length;let a=t.length,i=o,l=0,c=0,u=null;for(;l<a||c<i;)if(a===l){const t=i<o?c?r(n[c-1],-0).nextSibling:r(n[i-c],0):s;for(;c<i;)e.insertBefore(r(n[c++],1),t)}else if(i===c)for(;l<a;)u&&u.has(t[l])||e.removeChild(r(t[l],-1)),l++;else if(t[l]===n[c])l++,c++;else if(t[a-1]===n[i-1])a--,i--;else if(t[l]===n[i-1]&&n[c]===t[a-1]){const s=r(t[--a],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[l++],-1).nextSibling),e.insertBefore(r(n[--i],1),s),t[a]=n[i]}else{if(!u){u=new Map;let e=c;for(;e<i;)u.set(n[e],e++)}if(u.has(t[l])){const s=u.get(t[l]);if(c<s&&s<i){let o=l,f=1;for(;++o<a&&o<i&&u.get(t[o])===s+f;)f++;if(f>s-c){const o=r(t[l],0);for(;c<s;)e.insertBefore(r(n[c++],1),o)}else e.replaceChild(r(n[c++],1),r(t[l++],-1))}else l++}else e.removeChild(r(t[l++],-1))}return n})(e.parentNode,t,n,p,e),y=(t,n)=>{switch(n[0]){case"?":return((e,t,n)=>r=>{const s=!!d(r);n!==s&&((n=s)?e.setAttribute(t,""):e.removeAttribute(t))})(t,n.slice(1),!1);case".":return((e,t)=>"dataset"===t?(({dataset:e})=>t=>{for(const n in t){const r=t[n];null==r?delete e[n]:e[n]=r}})(e):n=>{e[t]=n})(t,n.slice(1));case"@":return h(t,"on"+n.slice(1));case"o":if("n"===n[1])return h(t,n)}switch(n){case"ref":return(e=>{let t;return n=>{t!==n&&(t=n,"function"==typeof n?n(e):n.current=e)}})(t);case"aria":return(e=>t=>{for(const n in t){const r="role"===n?n:`aria-${n}`,s=t[n];null==s?e.removeAttribute(r):e.setAttribute(r,s)}})(t)}return((t,n)=>{let r,s=!0;const o=e.createAttributeNS(null,n);return e=>{const n=d(e);r!==n&&(null==(r=n)?s||(t.removeAttributeNode(o),s=!0):(o.value=n,s&&(t.setAttributeNodeNS(o),s=!1)))}})(t,n)};function m(e){const{type:n,path:r}=e,s=r.reduceRight(g,this);return"node"===n?(e=>{let n,r,s=[];const o=a=>{switch(typeof a){case"string":case"number":case"boolean":n!==a&&(n=a,r||(r=i("")),r.data=a,s=w(e,s,[r]));break;case"object":case"undefined":if(null==a){n!=a&&(n=a,s=w(e,s,[]));break}if(t(a)){n=a,0===a.length?s=w(e,s,[]):"object"==typeof a[0]?s=w(e,s,a):o(String(a));break}if(n!==a)if("ELEMENT_NODE"in a)n=a,s=w(e,s,11===a.nodeType?[...a.childNodes]:[a]);else{const e=a.valueOf();e!==a&&o(e)}break;case"function":o(a(e))}};return o})(s):"attr"===n?y(s,e.name):(e=>{let t;return n=>{const r=d(n);t!=r&&(t=r,e.textContent=null==r?"":r)}})(s)}const b=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(r.call(n.childNodes,e)),e=n,({parentNode:n}=e);return t},v="isµ",x=new be,E=/^(?:textarea|script|style|title|plaintext|xmp)$/,k=(e,t)=>{const n="svg"===e,r=((e,t,n)=>{let r=0;return e.join("").trim().replace(xe,((e,t,r,s)=>{let o=t+r.replace(Ee,"=$2$1").trimEnd();return s.length&&(o+=n||ve.test(t)?" /":"></"+t),"<"+o+">"})).replace(ke,(e=>""===e?"\x3c!--"+t+r+++"--\x3e":t+r++))})(t,v,n),s=f(r,n),o=l(s,129),a=[],i=t.length-1;let c=0,u=`${v}${c}`;for(;c<i;){const e=o.nextNode();if(!e)throw`bad template: ${r}`;if(8===e.nodeType)e.data===u&&(a.push({type:"node",path:b(e)}),u=`${v}${++c}`);else{for(;e.hasAttribute(u);)a.push({type:"attr",path:b(e),name:e.getAttribute(u)}),e.removeAttribute(u),u=`${v}${++c}`;E.test(e.localName)&&e.textContent.trim()===`\x3c!--${u}--\x3e`&&(e.textContent="",a.push({type:"text",path:b(e)}),u=`${v}${++c}`)}}return{content:s,nodes:a}},A=(e,t)=>{const{content:n,nodes:r}=x.get(t)||x.set(t,k(e,t)),s=c(n,!0);return{content:s,updates:r.map(m,s)}},M=(e,{type:t,template:n,values:r})=>{const s=N(e,r);let{entry:o}=e;o&&o.template===n&&o.type===t||(e.entry=o=((e,t)=>{const{content:n,updates:r}=A(e,t);return{type:e,template:t,content:n,updates:r,wire:null}})(t,n));const{content:a,updates:i,wire:l}=o;for(let e=0;e<s;e++)i[e](r[e]);return l||(o.wire=(e=>{const{firstChild:t,lastChild:n}=e;if(t===n)return n||e;const{childNodes:r}=e,s=[...r];return{ELEMENT_NODE:1,nodeType:111,firstChild:t,lastChild:n,valueOf:()=>(r.length!==s.length&&e.append(...s),e)}})(a))},N=({stack:e},n)=>{const{length:r}=n;for(let s=0;s<r;s++){const r=n[s];r instanceof T?n[s]=M(e[s]||(e[s]={stack:[],entry:null,wire:null}),r):t(r)?N(e[s]||(e[s]={stack:[],entry:null,wire:null}),r):e[s]=null}return r<e.length&&e.splice(r),r};class T{constructor(e,t,n){this.type=e,this.template=t,this.values=n}}const C=e=>{const t=new be;return Object.assign(((t,...n)=>new T(e,t,n)),{for(n,r){const s=t.get(n)||t.set(n,new MapSet);return s.get(r)||s.set(r,(t=>(n,...r)=>M(t,{type:e,template:n,values:r}))({stack:[],entry:null,wire:null}))},node:(t,...n)=>M({stack:[],entry:null,wire:null},new T(e,t,n)).valueOf()})},P=new be,S=C("html"),O=C("svg");return{Hole:T,render:(e,t)=>{const n="function"==typeof t?t():t,r=P.get(e)||P.set(e,{stack:[],entry:null,wire:null}),s=n instanceof T?M(r,n):n;return s!==r.wire&&(r.wire=s,e.replaceChildren(s.valueOf())),e},html:S,svg:O}};const Me=(e,...t)=>{const n=me(e,...t);return n.uhtml||(n.uhtml=Ae(n.window)),n};Me.transfer=me.transfer;export{Me as default};
