const e="453c2f8b-9a5b-47f8-81f8-6e865d417c8d",t="M"+e,n="T"+e,r="array",s="function",o="null",a="number",i="object",l="string",c="symbol",u="undefined",f="apply",p="construct",h="defineProperty",d="deleteProperty",g="get",y="getOwnPropertyDescriptor",w="getPrototypeOf",m="has",b="isExtensible",v="ownKeys",x="preventExtensions",E="set",k="setPrototypeOf",$="delete";var M=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,onmessage%3D(%7Bdata%3Ab%7D)%3D%3E(Atomics.wait(b%2C0)%2CpostMessage(0))");n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:A,Map:T,SharedArrayBuffer:W,Uint16Array:S}=globalThis,{BYTES_PER_ELEMENT:N}=A,{BYTES_PER_ELEMENT:P}=S,{isArray:C}=Array,{notify:O,wait:L,waitAsync:B}=Atomics,R=new WeakSet,j=new WeakMap,D={value:{then:e=>e()}};let F=0;const _=(t,{parse:n=JSON.parse,stringify:r=JSON.stringify,transform:o,interrupt:a}=JSON)=>{if(!j.has(t)){const i=(n,...r)=>t.postMessage({[e]:r},{transfer:n}),l=typeof a===s?a:a?.handler,c=a?.delay||42,u=new TextDecoder("utf-16"),f=(e,t)=>e?(B||M)(t,0):(l?((e,t,n)=>{for(;"timed-out"===L(e,0,0,t);)n()})(t,c,l):L(t,0),D);let p=!1;j.set(t,new Proxy(new T,{[m]:(e,t)=>"string"==typeof t&&!t.startsWith("_"),[g]:(e,r)=>"then"===r?null:(...e)=>{const s=F++;let a=new A(new W(2*N)),l=[];R.has(e.at(-1)||l)&&R.delete(l=e.pop()),i(l,s,a,r,o?e.map(o):e);const c=t!==globalThis;let h=0;return p&&c&&(h=setTimeout(console.warn,1e3,`💀🔒 - Possible deadlock if proxy.${r}(...args) is awaited`)),f(c,a).value.then((()=>{clearTimeout(h);const e=a[1];if(!e)return;const t=P*e;return a=new A(new W(t+t%N)),i([],s,a),f(c,a).value.then((()=>n(u.decode(new S(a.buffer).slice(0,e)))))}))},[E](n,a,i){const l=typeof i;if(l!==s)throw new Error(`Unable to assign ${a} as ${l}`);if(!n.size){const s=new T;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(C(a)){t.stopImmediatePropagation();const[e,i,...l]=a;let c;if(l.length){const[t,a]=l;if(n.has(t)){p=!0;try{const l=await n.get(t)(...a);if(void 0!==l){const t=r(o?o(l):l);s.set(e,t),i[1]=t.length}}catch(e){c=e}finally{p=!1}}else c=new Error(`Unsupported action: ${t}`);i[0]=1}else{const t=s.get(e);s.delete(e);for(let e=new S(i.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}if(O(i,0),c)throw c}}))}return!!n.set(a,i)}}))}return j.get(t)};_.transfer=(...e)=>(R.add(e),e);const{isArray:z}=Array,U=(e,t)=>t,H=e=>typeof e===s?(e=>e())(e):e;function I(){return this}const J=(e,t)=>e===r?[t]:{t:e,v:t},K=(e,t=U)=>{let n=typeof e,s=e;return n===i&&(z(e)?(n=r,s=e.at(0)):({t:n,v:s}=e)),t(n,s)},Y=(e,t)=>e===s?t:J(e,t),Z=(e,t=Y)=>{const n=null===e?o:typeof e;return t(n===i&&z(e)?r:n,e)},G=new FinalizationRegistry((([e,t,n])=>{n&&console.debug(`Held value ${String(t)} not relevant anymore`),e(t)})),V=Object.create(null),q=(e,t,{debug:n,return:r,token:s=e}=V)=>{const o=r||new Proxy(e,V),a=[o,[t,e,!!n]];return!1!==s&&a.push(s),G.register(...a),o},{defineProperty:Q,deleteProperty:X,getOwnPropertyDescriptor:ee,getPrototypeOf:te,isExtensible:ne,ownKeys:re,preventExtensions:se,set:oe,setPrototypeOf:ae}=Reflect,{assign:ie,create:le}=Object,ce=te(Int8Array),ue=(e,t)=>{const{get:n,set:r,value:s}=e;return n&&(e.get=t(n)),r&&(e.set=t(r)),s&&(e.value=t(s)),e},fe=e=>t=>Z(t,((t,n)=>{switch(t){case o:return J(o,n);case i:if(n===globalThis)return J(t,null);case r:case s:return e(t,n);case"boolean":case a:case l:case u:case"bigint":return J(t,n);case c:{if(pe.has(n))return J(t,pe.get(n));let e=Symbol.keyFor(n);if(e)return J(t,`.${e}`)}}throw new TypeError(`Unable to handle this ${t}: ${String(n)}`)})),pe=new Map(re(Symbol).filter((e=>typeof Symbol[e]===c)).map((e=>[Symbol[e],e]))),he=e=>{if(e.startsWith("."))return Symbol.for(e.slice(1));for(const[t,n]of pe)if(n===e)return t},de=e=>e;var ge=((e,t)=>{const n=t&&new WeakMap;if(t){const{addEventListener:e}=EventTarget.prototype;Q(EventTarget.prototype,"addEventListener",{value(t,r,...s){return s.at(0)?.invoke&&(n.has(this)||n.set(this,new Map),n.get(this).set(t,[].concat(s[0].invoke)),delete s[0].invoke),e.call(this,t,r,...s)}})}const o=t&&(e=>{const{currentTarget:t,target:r,type:s}=e;for(const o of n.get(t||r)?.get(s)||[])e[o]()});return function(n,M,A,...T){let W=0,S=this?.transform||de;const N=new Map,P=new Map,{[A]:C}=n,O=T.length?ie(le(globalThis),...T):globalThis,L=fe(((e,t)=>{if(!N.has(t)){let n;for(;P.has(n=W++););N.set(t,n),P.set(n,e===s?t:S(t))}return J(e,N.get(t))})),B=e=>{C($,J(l,e))},R=(e,n)=>{switch(e){case i:if(null==n)return O;case r:if(typeof n===a)return P.get(n);if(!(n instanceof ce))for(const e in n)n[e]=j(n[e]);return n;case s:if(typeof n===l){if(!P.has(n)){const e=function(...e){return t&&e.at(0)instanceof Event&&o(...e),C(f,J(s,n),L(this),e.map(L))};return P.set(n,new WeakRef(e)),q(n,B,{return:e,token:!1})}return P.get(n).deref()}return P.get(n);case c:return he(n)}return n},j=e=>K(e,R),D={[f]:(e,t,n)=>L(e.apply(t,n)),[p]:(e,t)=>L(new e(...t)),[h]:(e,t,n)=>L(Q(e,t,n)),[d]:(e,t)=>L(X(e,t)),[w]:e=>L(te(e)),[g]:(e,t)=>L(e[t]),[y]:(e,t)=>{const n=ee(e,t);return n?J(i,ue(n,L)):J(u,n)},[m]:(e,t)=>L(t in e),[b]:e=>L(ne(e)),[v]:e=>J(r,re(e).map(L)),[x]:e=>L(se(e)),[E]:(e,t,n)=>L(oe(e,t,n)),[k]:(e,t)=>L(ae(e,t)),[$](e){N.delete(P.get(e)),P.delete(e)}};return n[M]=(e,t,...n)=>{switch(e){case f:n[0]=j(n[0]),n[1]=n[1].map(j);break;case p:n[0]=n[0].map(j);break;case h:{const[e,t]=n;n[0]=j(e);const{get:r,set:s,value:o}=t;r&&(t.get=j(r)),s&&(t.set=j(s)),o&&(t.value=j(o));break}default:n=n.map(j)}return D[e](j(t),...n)},{proxy:n,[e.toLowerCase()]:O,[`is${e}Proxy`]:()=>!1}}})("Window",!0),ye=(e=>{let t=0;const n=new Map,o=new Map,u=Symbol();return function(M,A,T){const W=this?.transform||de,{[A]:S}=M,N=new Map,P=e=>{N.delete(e),S($,C(e))},C=fe(((e,r)=>{if(u in r)return H(r[u]);if(e===s){if(r=W(r),!o.has(r)){let e;for(;o.has(e=String(t++)););n.set(r,e),o.set(e,r)}return J(e,n.get(r))}if(!(r instanceof ce)){r=W(r);for(const e in r)r[e]=C(r[e])}return J(e,r)})),O=(e,t,n)=>{if(!N.has(n)){const r=t===s?(e=>I.bind(e))(e):e,o=new Proxy(r,R);return N.set(n,new WeakRef(o)),q(n,P,{return:o,token:!1})}return N.get(n).deref()},L=e=>K(e,((t,n)=>{switch(t){case i:if(null===n)return globalThis;case r:return typeof n===a?O(e,t,n):n;case s:return typeof n===l?o.get(n):O(e,t,n);case c:return he(n)}return n})),B=(e,t,...n)=>L(S(e,H(t),...n)),R={[f]:(e,t,n)=>B(f,e,C(t),n.map(C)),[p]:(e,t)=>B(p,e,t.map(C)),[h]:(e,t,n)=>{const{get:r,set:o,value:a}=n;return typeof r===s&&(n.get=C(r)),typeof o===s&&(n.set=C(o)),typeof a===s&&(n.value=C(a)),B(h,e,C(t),n)},[d]:(e,t)=>B(d,e,C(t)),[w]:e=>B(w,e),[g]:(e,t)=>t===u?e:B(g,e,C(t)),[y]:(e,t)=>{const n=B(y,e,C(t));return n&&ue(n,L)},[m]:(e,t)=>t===u||B(m,e,C(t)),[b]:e=>B(b,e),[v]:e=>B(v,e).map(L),[x]:e=>B(x,e),[E]:(e,t,n)=>B(E,e,C(t),C(n)),[k]:(e,t)=>B(k,e,C(t))};M[T]=(e,t,r,s)=>{switch(e){case f:return L(t).apply(L(r),s.map(L));case $:{const e=L(t);n.delete(o.get(e)),o.delete(e)}}};const j=new Proxy(J(i,null),R);return{[e.toLowerCase()]:j,[`is${e}Proxy`]:e=>typeof e===i&&!!e&&u in e,proxy:M}}})("Window"),we=typeof Worker===s?Worker:class{};const me=new WeakMap,be=(e,...r)=>{const s=_(e,...r);if(!me.has(s)){const o=e instanceof we?ge:ye;me.set(s,o.call(r.at(0),s,t,n))}return me.get(s)};var ve=e=>function(t){const{constructor:n}=e.createDocumentFragment(),{isArray:r}=Array,s=[],o=()=>e.createRange(),a=(e,t,n)=>(e.set(t,n),n),i=(e,t,n,r="")=>({t:e,p:t,u:n,n:r}),l=e=>({s:e,t:null,n:null,d:s}),{setPrototypeOf:c}=Object;let u;var f=(e,t,n)=>(u||(u=o()),n?u.setStartAfter(e):u.setStartBefore(e),u.setEndAfter(t),u.deleteContents(),e);const p=({firstChild:e,lastChild:t},n)=>f(e,t,n);let h=!1;const d=(e,t)=>h&&11===e.nodeType?1/t<0?t?p(e,!0):e.lastChild:t?e.valueOf():e.firstChild:e;class g extends((e=>{function t(e){return c(e,new.target.prototype)}return t.prototype=e.prototype,t})(n)){#e;#t;constructor(e){const t=[...e.childNodes];super(e),this.#e=t,this.#t=t.length,h=!0}get firstChild(){return this.#e[0]}get lastChild(){return this.#e.at(-1)}get parentNode(){return this.#e[0].parentNode}remove(){p(this,!1)}replaceWith(e){p(this,!0).replaceWith(e)}valueOf(){return this.childNodes.length!==this.#t&&this.append(...this.#e),this}}const y=(e,t)=>t.reduceRight(w,e),w=(e,t)=>e.childNodes[t];var m=e=>(t,n)=>{const{c:r,e:o,l:a}=e(t,n),i=r.cloneNode(!0);let l,c,u=o.length,f=u?o.slice(0):s;for(;u--;){const{t:e,p:t,u:r,n:a}=o[u],p=t===c?l:l=y(i,c=t),h=8===e?r():r;f[u]={v:h(p,n[u],a,s),u:h,t:p,n:a}}return((e,t)=>({n:e,d:t}))(1===a?i.firstChild:new g(i),f)};const b=/^(?:plaintext|script|style|textarea|title|xmp)$/i,v=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,x=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,E=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,k=/[\x01\x02]/g;const $=(e,t,n)=>{e.setAttribute(t,n)},M=(e,t)=>{e.removeAttribute(t)},A=()=>j;let T;const W=(e,t,n)=>{n=n.slice(1),T||(T=new WeakMap);const s=T.get(e)||a(T,e,{});let o=s[n];return o&&o[0]&&e.removeEventListener(n,...o),o=r(t)?t:[t,!1],s[n]=o,o[0]&&e.addEventListener(n,...o),t};function S(e,t){const n=this.n||(this.n=e);switch(typeof t){case"string":case"number":case"boolean":n!==e&&n.replaceWith(this.n=e),this.n.data=t;break;case"object":case"undefined":null==t?(this.n=e).data="":this.n=t.valueOf(),n.replaceWith(this.n)}return t}const N=()=>S.bind({n:null}),P=(e,t,n)=>e[n]=t,C=(e,t,n)=>P(e,t,n.slice(1)),O=(e,t,n)=>null==t?(M(e,n),t):P(e,t,n),L=(e,t)=>("function"==typeof t?t(e):t.current=e,t),B=(e,t,n)=>(null==t?M(e,n):$(e,n,t),t),R=(e,t,n)=>(e.toggleAttribute(n.slice(1),t),t),j=(e,t,n,r)=>t.length?((e,t,n,r,s)=>{const o=n.length;let a=t.length,i=o,l=0,c=0,u=null;for(;l<a||c<i;)if(a===l){const t=i<o?c?r(n[c-1],-0).nextSibling:r(n[i-c],0):s;for(;c<i;)e.insertBefore(r(n[c++],1),t)}else if(i===c)for(;l<a;)u&&u.has(t[l])||e.removeChild(r(t[l],-1)),l++;else if(t[l]===n[c])l++,c++;else if(t[a-1]===n[i-1])a--,i--;else if(t[l]===n[i-1]&&n[c]===t[a-1]){const s=r(t[--a],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[l++],-1).nextSibling),e.insertBefore(r(n[--i],1),s),t[a]=n[i]}else{if(!u){u=new Map;let e=c;for(;e<i;)u.set(n[e],e++)}if(u.has(t[l])){const s=u.get(t[l]);if(c<s&&s<i){let o=l,f=1;for(;++o<a&&o<i&&u.get(t[o])===s+f;)f++;if(f>s-c){const o=r(t[l],0);for(;c<s;)e.insertBefore(r(n[c++],1),o)}else e.replaceChild(r(n[c++],1),r(t[l++],-1))}else l++}else e.removeChild(r(t[l++],-1))}return n})(e.parentNode,r,t,d,e):(r.length&&f(r[0],r.at(-1),!1),s),D=new Map([["aria",(e,t)=>{for(const n in t){const r=t[n],s="role"===n?n:`aria-${n}`;null==r?M(e,s):$(e,s,r)}return t}],["class",(e,t)=>O(e,t,null==t?"class":"className")],["data",(e,t)=>{const{dataset:n}=e;for(const e in t)null==t[e]?delete n[e]:n[e]=t[e];return t}],["ref",L],["style",(e,t)=>null==t?O(e,t,"style"):P(e.style,t,"cssText")]]),F=(e,t,n)=>{switch(t[0]){case".":return C;case"?":return R;case"@":return W;default:return n||"ownerSVGElement"in e?"ref"===t?L:B:D.get(t)||(t in e?t.startsWith("on")?P:O:B)}},_=(e,t)=>(e.textContent=null==t?"":t,t);let z,U,H=e.createElement("template");var I=(t,n)=>{if(n)return z||(z=e.createElementNS("http://www.w3.org/2000/svg","svg"),U=o(),U.selectNodeContents(z)),U.createContextualFragment(t);H.innerHTML=t;const{content:r}=H;return H=H.cloneNode(!1),r};const J=e=>{const t=[];let n;for(;n=e.parentNode;)t.push(t.indexOf.call(n.childNodes,e)),e=n;return t},K=(t,n,o)=>{const l=I(((e,t,n)=>{let r=0;return e.join("").trim().replace(x,((e,t,r,s)=>`<${t}${r.replace(E,"=$2$1").trimEnd()}${s?n||v.test(t)?" /":`></${t}`:""}>`)).replace(k,(e=>""===e?`\x3c!--${t+r++}--\x3e`:t+r++))})(t,Z,o),o),{length:c}=t;let u=!1,f=s;if(c>1){const t=e.createTreeWalker(l,129),s=[];let a=0,p=`${Z}${a++}`;for(f=[];a<c;){const e=t.nextNode();if(8===e.nodeType){if(e.data===p){let t=r(n[a-1])?A:N;t===N?s.push(e):u=!0,f.push(i(8,J(e),t)),p=`${Z}${a++}`}}else{let t;for(;e.hasAttribute(p);){t||(t=J(e));const n=e.getAttribute(p);f.push(i(2,t,F(e,n,o),n)),M(e,p),p=`${Z}${a++}`}b.test(e.localName)&&e.textContent.trim()===`\x3c!--${p}--\x3e`&&(f.push(i(3,t||J(e),_)),p=`${Z}${a++}`)}}for(a=0;a<s.length;a++)s[a].replaceWith(e.createTextNode(""))}const p=l.childNodes.length;return a(Y,t,((e,t,n)=>({c:e,e:t,l:n}))(l,f,1===p&&u?0:p))},Y=new WeakMap,Z="isµ";var G=e=>(t,n)=>Y.get(t)||K(t,n,e);const V=m(G(!1)),q=m(G(!0)),Q=(e,{s:t,t:n,v:r})=>{r.length&&e.s===s&&(e.s=[]);const o=X(e,r);if(e.t!==n){const{n:s,d:o}=(t?q:V)(n,r);e.t=n,e.n=s,e.d=o}else{const{d:t}=e;for(let e=0;e<o;e++){const n=r[e],s=t[e],{v:o}=s;if(n!==o){const{u:e,t:t,n:r}=s;s.v=e(t,n,r,o)}}}return e.n},X=({s:e},t)=>{const{length:n}=t;for(let o=0;o<n;o++){const n=t[o];n instanceof ee?t[o]=Q(e[o]||(e[o]=l(s)),n):r(n)?X(e[o]||(e[o]=l([])),n):e[o]=null}return n<e.length&&e.splice(n),n};class ee{constructor(e,t,n){this.s=e,this.t=t,this.v=n}}
/*! (c) Andrea Giammarchi - MIT */const te=e=>(t,...n)=>new ee(e,t,n),ne=te(!1),re=te(!0),se=new WeakMap;const oe=new WeakMap,ae=e=>(t,n)=>{const r=oe.get(t)||a(oe,t,new Map);return r.get(n)||a(r,n,function(t,...n){return Q(this,new ee(e,t,n))}.bind(l(s)))},ie=ae(!1),le=ae(!0);return t.Hole=ee,t.attr=D,t.html=ne,t.htmlFor=ie,t.render=(e,t)=>{const n=se.get(e)||a(se,e,l(s)),r="function"==typeof t?t():t,{n:o}=n,i=r instanceof ee?Q(n,r):r;return o!==i&&e.replaceChildren(n.n=i),e},t.svg=re,t.svgFor=le,t}({});const xe=(e,...t)=>{const n=be(e,...t);return n.uhtml||(n.uhtml=ve(n.window.document)),n};xe.transfer=be.transfer=_.transfer;export{xe as default};
