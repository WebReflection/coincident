/*! (c) Andrea Giammarchi - ISC */
const e="c85efda3-9cb0-445f-bf66-cc19f6c7a1f3",{Atomics:t,Int32Array:n,Map:r,SharedArrayBuffer:s,Uint16Array:a}=globalThis,{BYTES_PER_ELEMENT:o}=n,{BYTES_PER_ELEMENT:c}=a,{isArray:i}=Array,{notify:f,wait:l,waitAsync:w}=t,{fromCharCode:h}=String,d=(e,t)=>e?w(t,0):(l(t,0),{value:{then:e=>e()}}),g=new WeakSet,E=new WeakMap;let u=0;const y=(t,{parse:l,stringify:w}=JSON)=>{if(!E.has(t)){const y=(n,...r)=>t.postMessage({[e]:r},{transfer:n});E.set(t,new Proxy(new r,{get:(e,r)=>"then"===r?null:(...e)=>{const i=u++;let f=new s(o);const w=new n(f);let E=[];g.has(e.at(-1)||E)&&g.delete(E=e.pop()),y(E,i,f,r,e);const p=t instanceof Worker;return d(p,w).value.then((()=>{const e=w[0],t=c*e;return f=new s(t+t%o),y([],i,f),d(p,new n(f)).value.then((()=>l(h(...new a(f).slice(0,e)))))}))},set(s,o,c){if(!s.size){const o=new r;t.addEventListener("message",(async({data:t})=>{const r=t?.[e];if(i(r)){const[e,t,...c]=r,i=new n(t);if(c.length){const[t,n]=c;if(!s.has(t))throw new Error(`Unsupported action: ${t}`);{const r=w(await s.get(t)(...n));o.set(e,r),i[0]=r.length}}else{const n=o.get(e);o.delete(e);for(let e=new a(t),r=0;r<n.length;r++)e[r]=n.charCodeAt(r)}f(i,0)}}))}return!!s.set(o,c)}}))}return E.get(t)};y.transfer=(...e)=>(g.add(e),e);export{y as default};
