var e="659055af-b151-4f8b-9b33-ff1e8e4038a6",t=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,"+encodeURIComponent("onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))"));n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:n,Map:r,SharedArrayBuffer:s,Uint16Array:o}=globalThis,{BYTES_PER_ELEMENT:a}=n,{BYTES_PER_ELEMENT:i}=o,{isArray:l}=Array,{notify:c,wait:u,waitAsync:p}=Atomics,{fromCharCode:f}=String,d=(e,n)=>e?(p||t)(n,0):(u(n,0),{value:{then:e=>e()}}),g=new WeakSet,h=new WeakMap;let w=0;const y=(t,{parse:u,stringify:p}=JSON)=>{if(!h.has(t)){const y=(n,...r)=>t.postMessage({[e]:r},{transfer:n});h.set(t,new Proxy(new r,{get:(e,r)=>"then"===r?null:(...e)=>{const l=w++;let c=new n(new s(a)),p=[];g.has(e.at(-1)||p)&&g.delete(p=e.pop()),y(p,l,c,r,e);const h=t instanceof Worker;return d(h,c).value.then((()=>{const e=c[0];if(!e)return;const t=i*e;return c=new n(new s(t+t%a)),y([],l,c),d(h,c).value.then((()=>u(f(...new o(c.buffer).slice(0,e)))))}))},set(n,s,a){if(!n.size){const s=new r;t.addEventListener("message",(async t=>{const r=t.data?.[e];if(l(r)){t.stopImmediatePropagation();const[e,a,...i]=r;if(i.length){const[t,r]=i;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);{const o=p(await n.get(t)(...r));o&&(s.set(e,o),a[0]=o.length)}}else{const t=s.get(e);s.delete(e);for(let e=new o(a.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}c(a,0)}}))}return!!n.set(s,a)}}))}return h.get(t)};y.transfer=(...e)=>(g.add(e),e);const m="object",b="function",v="number",E="string",x="undefined",k="symbol",{defineProperty:M,getOwnPropertyDescriptor:N,getPrototypeOf:A,isExtensible:C,ownKeys:P,preventExtensions:S,set:T,setPrototypeOf:O}=Reflect,$=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},W=(e,t)=>[e,t],L=e=>t=>{const n=typeof t;switch(n){case m:if(null==t)return W("null",t);case b:return e(n,t);case"boolean":case v:case E:case x:case"bigint":return W(n,t);case k:if(R.has(t))return W(n,R.get(t))}throw new Error(`Unable to handle this ${n} type`)},R=new Map(P(Symbol).filter((e=>typeof Symbol[e]===k)).map((e=>[Symbol[e],e]))),B=e=>{for(const[t,n]of R)if(n===e)return t},D="apply",_="construct",j="defineProperty",z="deleteProperty",U="get",F="getOwnPropertyDescriptor",H="getPrototypeOf",I="has",K="isExtensible",Y="ownKeys",G="preventExtensions",J="set",q="setPrototypeOf",Q="delete";let V=0;const X=new Map,Z=new Map,ee=new WeakMap,{addEventListener:te}=EventTarget.prototype;M(EventTarget.prototype,"addEventListener",{value(e,t,...n){return n.at(0)?.invoke&&(ee.has(this)||ee.set(this,new Map),ee.get(this).set(e,[].concat(n[0].invoke)),delete n[0].invoke),te.call(this,e,t,...n)}});const ne=L(((e,t)=>{if(!X.has(t)){let e;for(;Z.has(e=V++););X.set(t,e),Z.set(e,t)}return W(e,X.get(t))}));var re=(e,t,n)=>{const{[n]:r}=e,s=new FinalizationRegistry((e=>{r(Q,W(E,e))})),o=([e,t])=>{switch(e){case m:return null==t?globalThis:typeof t===v?Z.get(t):t;case b:if(typeof t===E){if(!Z.has(t)){const e=function(...e){return e.at(0)instanceof Event&&(e=>{const{currentTarget:t,target:n,type:r}=e;for(const s of ee.get(t||n)?.get(r)||[])e[s]()})(...e),r(D,W(b,t),ne(this),e.map(ne))},n=new WeakRef(e);Z.set(t,n),s.register(e,t,n)}return Z.get(t).deref()}return Z.get(t);case k:return B(t)}return t},a={[D]:(e,t,n)=>ne(e.apply(t,n)),[_]:(e,t)=>ne(new e(...t)),[j]:(e,t,n)=>ne(M(e,t,n)),[z]:(e,t)=>ne(delete e[t]),[H]:e=>ne(A(e)),[U]:(e,t)=>ne(e[t]),[F]:(e,t)=>{const n=N(e,t);return n?W(m,$(n,ne)):W(x,n)},[I]:(e,t)=>ne(t in e),[K]:e=>ne(C(e)),[Y]:e=>W(m,P(e).map(ne)),[G]:e=>ne(S(e)),[J]:(e,t,n)=>ne(T(e,t,n)),[q]:(e,t)=>ne(O(e,t)),[Q](e){X.delete(Z.get(e)),Z.delete(e)}};return e[t]=(e,t,...n)=>{switch(e){case D:n[0]=o(n[0]),n[1]=n[1].map(o);break;case _:n[0]=n[0].map(o);break;case j:{const[e,t]=n;n[0]=o(e);const{get:r,set:s,value:a}=t;r&&(t.get=o(r)),s&&(t.set=o(s)),a&&(t.value=o(a));break}default:n=n.map(o)}return a[e](o(t),...n)},e};const se=e=>typeof e===b?e():e,oe=L(((e,t)=>{if(ae in t)return se(t[ae]);if(e===b){if(!ce.has(t)){let e;for(;ce.has(e=String(ie++)););le.set(t,e),ce.set(e,t)}return W(e,le.get(t))}return W(e,t)})),ae=Symbol();let ie=0;const le=new Map,ce=new Map;var ue=(e,t,n)=>{const{[t]:r}=e,s=new Map,o=new FinalizationRegistry((e=>{s.delete(e),r(Q,oe(e))})),a=e=>{const[t,n]=e;if(!s.has(n)){const r=t===b?pe.bind(e):e,a=new Proxy(r,c),i=new WeakRef(a);s.set(n,i),o.register(a,n,i)}return s.get(n).deref()},i=e=>{const[t,n]=e;switch(t){case m:return typeof n===v?a(e):n;case b:return typeof n===E?ce.get(n):a(e);case k:return B(n)}return n},l=(e,t,...n)=>i(r(e,se(t),...n)),c={[D]:(e,t,n)=>l(D,e,oe(t),n.map(oe)),[_]:(e,t)=>l(_,e,t.map(oe)),[j]:(e,t,n)=>{const{get:r,set:s,value:o}=n;return typeof r===b&&(n.get=oe(r)),typeof s===b&&(n.set=oe(s)),typeof o===b&&(n.value=oe(o)),l(j,e,oe(t),n)},[z]:(e,t)=>l(z,e,oe(t)),[H]:e=>l(H,e),[U]:(e,t)=>t===ae?e:l(U,e,oe(t)),[F]:(e,t)=>{const n=l(F,e,oe(t));return n&&$(n,i)},[I]:(e,t)=>t===ae||l(I,e,oe(t)),[K]:e=>l(K,e),[Y]:e=>l(Y,e).map(i),[G]:e=>l(G,e),[J]:(e,t,n)=>l(J,e,oe(t),oe(n)),[q]:(e,t)=>l(q,e,oe(t))};return e[n]=(e,t,n,r)=>{switch(e){case D:return i(t).apply(i(n),r.map(i));case Q:{const e=i(t);le.delete(ce.get(e)),ce.delete(e)}}},{proxy:e,window:new Proxy([m,null],c),isWindowProxy:e=>typeof e===m&&!!e&&ae in e,get global(){return console.warn("Deprecated: please access `window` field instead"),this.window},get isGlobal(){return function(e){return console.warn("Deprecated: please access `isWindowProxy` field instead"),this.isWindowProxy(e)}.bind(this)}}};function pe(){return this}const fe=e+"M",de=e+"T",ge=new WeakMap,he=(e,...t)=>{const n=y(e,...t);if(!ge.has(n)){const t=e instanceof Worker?re:ue;ge.set(n,t(n,fe,de))}return ge.get(n)};he.transfer=y.transfer;class we extends WeakMap{set(e,t){return super.set(e,t),t}}
/*! (c) Andrea Giammarchi - ISC */const ye=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,me=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g,be=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,ve=/[\x01\x02]/g;var Ee=({document:e})=>{const{isArray:t,prototype:n}=Array,{indexOf:r}=n,{createDocumentFragment:s,createElement:o,createElementNS:a,createTextNode:i,createTreeWalker:l,importNode:c}=new Proxy({},{get:(t,n)=>e[n].bind(e)});let u;const p=(e,t)=>t?(e=>{u||(u=a("http://www.w3.org/2000/svg","svg")),u.innerHTML=e;const t=s();return t.append(...u.childNodes),t})(e):(e=>{const t=o("template");return t.innerHTML=e,t.content})(e),f=(t,n)=>111===t.nodeType?1/n<0?n?(({firstChild:t,lastChild:n})=>{const r=e.createRange();return r.setStartAfter(t),r.setEndAfter(n),r.deleteContents(),t})(t):t.lastChild:n?t.valueOf():t.firstChild:t,d=e=>null==e?e:e.valueOf(),g=(e,n)=>{let r,s,o=n.slice(2);return!(n in e)&&(s=n.toLowerCase())in e&&(o=s.slice(2)),n=>{const s=t(n)?n:[n,!1];r!==s[0]&&(r&&e.removeEventListener(o,r,s[1]),(r=s[0])&&e.addEventListener(o,r,s[1]))}},h=({childNodes:e},t)=>e[t],w=(e,t,n)=>((e,t,n,r,s)=>{const o=n.length;let a=t.length,i=o,l=0,c=0,u=null;for(;l<a||c<i;)if(a===l){const t=i<o?c?r(n[c-1],-0).nextSibling:r(n[i-c],0):s;for(;c<i;)e.insertBefore(r(n[c++],1),t)}else if(i===c)for(;l<a;)u&&u.has(t[l])||e.removeChild(r(t[l],-1)),l++;else if(t[l]===n[c])l++,c++;else if(t[a-1]===n[i-1])a--,i--;else if(t[l]===n[i-1]&&n[c]===t[a-1]){const s=r(t[--a],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[l++],-1).nextSibling),e.insertBefore(r(n[--i],1),s),t[a]=n[i]}else{if(!u){u=new Map;let e=c;for(;e<i;)u.set(n[e],e++)}if(u.has(t[l])){const s=u.get(t[l]);if(c<s&&s<i){let o=l,p=1;for(;++o<a&&o<i&&u.get(t[o])===s+p;)p++;if(p>s-c){const o=r(t[l],0);for(;c<s;)e.insertBefore(r(n[c++],1),o)}else e.replaceChild(r(n[c++],1),r(t[l++],-1))}else l++}else e.removeChild(r(t[l++],-1))}return n})(e.parentNode,t,n,f,e),y=(t,n)=>{switch(n[0]){case"?":return((e,t,n)=>r=>{const s=!!d(r);n!==s&&((n=s)?e.setAttribute(t,""):e.removeAttribute(t))})(t,n.slice(1),!1);case".":return((e,t)=>"dataset"===t?(({dataset:e})=>t=>{for(const n in t){const r=t[n];null==r?delete e[n]:e[n]=r}})(e):n=>{e[t]=n})(t,n.slice(1));case"@":return g(t,"on"+n.slice(1));case"o":if("n"===n[1])return g(t,n)}switch(n){case"ref":return(e=>{let t;return n=>{t!==n&&(t=n,"function"==typeof n?n(e):n.current=e)}})(t);case"aria":return(e=>t=>{for(const n in t){const r="role"===n?n:`aria-${n}`,s=t[n];null==s?e.removeAttribute(r):e.setAttribute(r,s)}})(t)}return((t,n)=>{let r,s=!0;const o=e.createAttributeNS(null,n);return e=>{const n=d(e);r!==n&&(null==(r=n)?s||(t.removeAttributeNode(o),s=!0):(o.value=n,s&&(t.setAttributeNodeNS(o),s=!1)))}})(t,n)};function m(e){const{type:n,path:r}=e,s=r.reduceRight(h,this);return"node"===n?(e=>{let n,r,s=[];const o=a=>{switch(typeof a){case"string":case"number":case"boolean":n!==a&&(n=a,r||(r=i("")),r.data=a,s=w(e,s,[r]));break;case"object":case"undefined":if(null==a){n!=a&&(n=a,s=w(e,s,[]));break}if(t(a)){n=a,0===a.length?s=w(e,s,[]):"object"==typeof a[0]?s=w(e,s,a):o(String(a));break}if(n!==a)if("ELEMENT_NODE"in a)n=a,s=w(e,s,11===a.nodeType?[...a.childNodes]:[a]);else{const e=a.valueOf();e!==a&&o(e)}break;case"function":o(a(e))}};return o})(s):"attr"===n?y(s,e.name):(e=>{let t;return n=>{const r=d(n);t!=r&&(t=r,e.textContent=null==r?"":r)}})(s)}const b=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(r.call(n.childNodes,e)),e=n,({parentNode:n}=e);return t},v="isµ",E=new we,x=/^(?:textarea|script|style|title|plaintext|xmp)$/,k=(e,t)=>{const n="svg"===e,r=((e,t,n)=>{let r=0;return e.join("").trim().replace(me,((e,t,r,s)=>{let o=t+r.replace(be,"=$2$1").trimEnd();return s.length&&(o+=n||ye.test(t)?" /":"></"+t),"<"+o+">"})).replace(ve,(e=>""===e?"\x3c!--"+t+r+++"--\x3e":t+r++))})(t,v,n),s=p(r,n),o=l(s,129),a=[],i=t.length-1;let c=0,u=`${v}${c}`;for(;c<i;){const e=o.nextNode();if(!e)throw`bad template: ${r}`;if(8===e.nodeType)e.data===u&&(a.push({type:"node",path:b(e)}),u=`${v}${++c}`);else{for(;e.hasAttribute(u);)a.push({type:"attr",path:b(e),name:e.getAttribute(u)}),e.removeAttribute(u),u=`${v}${++c}`;x.test(e.localName)&&e.textContent.trim()===`\x3c!--${u}--\x3e`&&(e.textContent="",a.push({type:"text",path:b(e)}),u=`${v}${++c}`)}}return{content:s,nodes:a}},M=(e,t)=>{const{content:n,nodes:r}=E.get(t)||E.set(t,k(e,t)),s=c(n,!0);return{content:s,updates:r.map(m,s)}},N=(e,{type:t,template:n,values:r})=>{const s=A(e,r);let{entry:o}=e;o&&o.template===n&&o.type===t||(e.entry=o=((e,t)=>{const{content:n,updates:r}=M(e,t);return{type:e,template:t,content:n,updates:r,wire:null}})(t,n));const{content:a,updates:i,wire:l}=o;for(let e=0;e<s;e++)i[e](r[e]);return l||(o.wire=(e=>{const{firstChild:t,lastChild:n}=e;if(t===n)return n||e;const{childNodes:r}=e,s=[...r];return{ELEMENT_NODE:1,nodeType:111,firstChild:t,lastChild:n,valueOf:()=>(r.length!==s.length&&e.append(...s),e)}})(a))},A=({stack:e},n)=>{const{length:r}=n;for(let s=0;s<r;s++){const r=n[s];r instanceof C?n[s]=N(e[s]||(e[s]={stack:[],entry:null,wire:null}),r):t(r)?A(e[s]||(e[s]={stack:[],entry:null,wire:null}),r):e[s]=null}return r<e.length&&e.splice(r),r};class C{constructor(e,t,n){this.type=e,this.template=t,this.values=n}}const P=e=>{const t=new we;return Object.assign(((t,...n)=>new C(e,t,n)),{for(n,r){const s=t.get(n)||t.set(n,new MapSet);return s.get(r)||s.set(r,(t=>(n,...r)=>N(t,{type:e,template:n,values:r}))({stack:[],entry:null,wire:null}))},node:(t,...n)=>N({stack:[],entry:null,wire:null},new C(e,t,n)).valueOf()})},S=new we,T=P("html"),O=P("svg");return{Hole:C,render:(e,t)=>{const n="function"==typeof t?t():t,r=S.get(e)||S.set(e,{stack:[],entry:null,wire:null}),s=n instanceof C?N(r,n):n;return s!==r.wire&&(r.wire=s,e.replaceChildren(s.valueOf())),e},html:T,svg:O}};const xe=(e,...t)=>{const n=he(e,...t);return e instanceof Worker||(n.uhtml=Ee(n.window)),n};xe.transfer=he.transfer;export{xe as default};