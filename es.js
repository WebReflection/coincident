var e="f4519ef9-2030-4f8f-ab39-0d74e52bb01f",t=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,"+encodeURIComponent("onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))"));n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:n,Map:a,SharedArrayBuffer:s,Uint16Array:r}=globalThis,{BYTES_PER_ELEMENT:o}=n,{BYTES_PER_ELEMENT:i}=r,{isArray:f}=Array,{notify:c,wait:l,waitAsync:w}=Atomics,{fromCharCode:d}=String,g=(e,n)=>e?(w||t)(n,0):(l(n,0),{value:{then:e=>e()}}),p=new WeakSet,h=new WeakMap;let u=0;const E=(t,{parse:l,stringify:w}=JSON)=>{if(!h.has(t)){const E=(n,...a)=>t.postMessage({[e]:a},{transfer:n});h.set(t,new Proxy(new a,{has:()=>!0,get:(e,a)=>"then"===a?null:(...e)=>{const f=u++;let c=new n(new s(o)),w=[];p.has(e.at(-1)||w)&&p.delete(w=e.pop()),E(w,f,c,a,e);const h=t instanceof Worker;return g(h,c).value.then((()=>{const e=c[0];if(!e)return;const t=i*e;return c=new n(new s(t+t%o)),E([],f,c),g(h,c).value.then((()=>l(d(...new r(c.buffer).slice(0,e)))))}))},set(n,s,o){if(!n.size){const s=new a;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(f(a)){t.stopImmediatePropagation();const[e,o,...i]=a;if(i.length){const[t,a]=i;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);{const r=w(await n.get(t)(...a));r&&(s.set(e,r),o[0]=r.length)}}else{const t=s.get(e);s.delete(e);for(let e=new r(o.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}c(o,0)}}))}return!!n.set(s,o)}}))}return h.get(t)};E.transfer=(...e)=>(p.add(e),e);export{E as default};
