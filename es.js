var e=e=>({value:new Promise((t=>{let n=new Worker("data:application/javascript,"+encodeURIComponent("onmessage=({data:b})=>(Atomics.wait(b,0),postMessage(0))"));n.onmessage=t,n.postMessage(e)}))})
/*! (c) Andrea Giammarchi - ISC */;const t="c3bf191a-08e7-4e3d-b125-a77dab5e1504",{Int32Array:n,Map:a,SharedArrayBuffer:s,Uint16Array:r}=globalThis,{BYTES_PER_ELEMENT:o}=n,{BYTES_PER_ELEMENT:i}=r,{isArray:c}=Array,{notify:f,wait:l,waitAsync:w}=Atomics,{fromCharCode:d}=String,g=(t,n)=>t?(w||e)(n,0):(l(n,0),{value:{then:e=>e()}}),p=new WeakSet,h=new WeakMap;let u=0;const E=(e,{parse:l,stringify:w}=JSON)=>{if(!h.has(e)){const E=(n,...a)=>e.postMessage({[t]:a},{transfer:n});h.set(e,new Proxy(new a,{get:(t,a)=>"then"===a?null:(...t)=>{const c=u++;let f=new n(new s(o)),w=[];p.has(t.at(-1)||w)&&p.delete(w=t.pop()),E(w,c,f,a,t);const h=e instanceof Worker;return g(h,f).value.then((()=>{const e=f[0];if(!e)return;const t=i*e;return f=new n(new s(t+t%o)),E([],c,f),g(h,f).value.then((()=>l(d(...new r(f.buffer).slice(0,e)))))}))},set(n,s,o){if(!n.size){const s=new a;e.addEventListener("message",(async e=>{const a=e.data?.[t];if(c(a)){e.stopImmediatePropagation();const[t,o,...i]=a;if(i.length){const[e,a]=i;if(!n.has(e))throw new Error(`Unsupported action: ${e}`);{const r=w(await n.get(e)(...a));r&&(s.set(t,r),o[0]=r.length)}}else{const e=s.get(t);s.delete(t);for(let t=new r(o.buffer),n=0;n<e.length;n++)t[n]=e.charCodeAt(n)}f(o,0)}}))}return!!n.set(s,o)}}))}return h.get(e)};E.transfer=(...e)=>(p.add(e),e);export{E as default};
