var e="f9a42651-dbe5-4a46-8527-44bcac744aa1",t=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,"+encodeURIComponent("onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))"));n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const{Int32Array:n,Map:a,SharedArrayBuffer:s,Uint16Array:r}=globalThis,{BYTES_PER_ELEMENT:o}=n,{BYTES_PER_ELEMENT:i}=r,{isArray:c}=Array,{notify:f,wait:l,waitAsync:w}=Atomics,{fromCharCode:d}=String,g=(e,n)=>e?(w||t)(n,0):(l(n,0),{value:{then:e=>e()}}),p=new WeakSet,h=new WeakMap;let u=0;const E=(t,{parse:l,stringify:w}=JSON)=>{if(!h.has(t)){const E=(n,...a)=>t.postMessage({[e]:a},{transfer:n});h.set(t,new Proxy(new a,{get:(e,a)=>"then"===a?null:(...e)=>{const c=u++;let f=new n(new s(o)),w=[];p.has(e.at(-1)||w)&&p.delete(w=e.pop()),E(w,c,f,a,e);const h=t instanceof Worker;return g(h,f).value.then((()=>{const e=f[0];if(!e)return;const t=i*e;return f=new n(new s(t+t%o)),E([],c,f),g(h,f).value.then((()=>l(d(...new r(f.buffer).slice(0,e)))))}))},set(n,s,o){if(!n.size){const s=new a;t.addEventListener("message",(async t=>{const a=t.data?.[e];if(c(a)){t.stopImmediatePropagation();const[e,o,...i]=a;if(i.length){const[t,a]=i;if(!n.has(t))throw new Error(`Unsupported action: ${t}`);{const r=w(await n.get(t)(...a));r&&(s.set(e,r),o[0]=r.length)}}else{const t=s.get(e);s.delete(e);for(let e=new r(o.buffer),n=0;n<t.length;n++)e[n]=t.charCodeAt(n)}f(o,0)}}))}return!!n.set(s,o)}}))}return h.get(t)};E.transfer=(...e)=>(p.add(e),e);export{E as default};
