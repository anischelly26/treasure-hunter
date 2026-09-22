(() => {
 const button=document.getElementById('download'),status=document.getElementById('downloadStatus');
 button.addEventListener('click',async()=>{
  button.disabled=true;status.textContent='Preparing the original V9 download…';
  try{
   const base='https://raw.githubusercontent.com/anischelly26/ZERO-ECLIPSE/a187df9ae9712a9ec07aa7f4f645e7d25210b002/release/ZERO_ECLIPSE_V9.jar.part';
   const parts=await Promise.all([0,1].map(async n=>{const r=await fetch(base+n);if(!r.ok)throw new Error('Download unavailable');return r.arrayBuffer();}));
   const blob=new Blob(parts,{type:'application/java-archive'});
   const digest=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());
   const hash=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
   if(hash!=='35977412bb4a30462821cb0190efb4956e45dcfcac5508ec7258529fa200c08e')throw new Error('Integrity check failed');
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ZERO_ECLIPSE_V9.jar';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
   status.textContent='Download ready. Requires Java 21 or newer.';
  }catch(e){status.textContent='Download failed. Please retry or use the GitHub instructions below.';}finally{button.disabled=false;}
 });
})();
