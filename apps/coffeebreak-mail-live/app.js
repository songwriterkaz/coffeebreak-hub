// Coffeebreak Mail Live. (c) Karen (Coffeebreak). All rights reserved.
(function(){
const API=/netlify\.app$|coffeebreaks\.workers\.dev$|^localhost$|^127\.0\.0\.1$/.test(location.hostname)?'':'https://cbmail-live.coffeebreaks.workers.dev';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tok=localStorage.getItem('cbml_tok')||'',me=null,mail=[],folder='Inbox',since=0,mode='sign',cur=null;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),3500)}
async function api(path,opt={}){let r;try{r=await fetch(API+'/api'+path,{method:opt.method||'GET',headers:{'content-type':'application/json',...(tok?{authorization:'Bearer '+tok}:{})},body:opt.body?JSON.stringify(opt.body):undefined})}catch(e){throw new Error('The mail server is not switched on yet. Please try again later.')}let j={};try{j=await r.json()}catch(e){}if(r.status===401&&path!=='/login'){signOut();}if(!r.ok&&!j.results)throw new Error(j.error||'Could not reach Coffeebreak Mail. Check your internet.');return j}
function setMode(m){mode=m;$('#tSign').classList.toggle('on',m==='sign');$('#tNew').classList.toggle('on',m==='new');$('#nameRow').classList.toggle('hide',m==='sign');$('#aGo').textContent=m==='sign'?'Sign in':'Make my account';$('#aPw').autocomplete=m==='sign'?'current-password':'new-password';$('#aMsg').textContent=''}
$('#tSign').onclick=()=>setMode('sign');$('#tNew').onclick=()=>setMode('new');
$('#aGo').onclick=async()=>{const b=$('#aGo'),m=$('#aMsg');b.disabled=true;m.className='msg';m.textContent='One moment...';
 try{const j=await api(mode==='sign'?'/login':'/signup',{method:'POST',body:{handle:$('#aHandle').value,password:$('#aPw').value,name:$('#aName').value}});tok=j.token;localStorage.setItem('cbml_tok',tok);$('#aPw').value='';start(j)}
 catch(e){m.className='msg err';m.textContent=e.message}finally{b.disabled=false}};
$('#aPw').addEventListener('keydown',e=>{if(e.key==='Enter')$('#aGo').click()});
function signOut(){tok='';me=null;mail=[];since=0;localStorage.removeItem('cbml_tok');$('#v-mail').classList.add('hide');$('#v-auth').classList.remove('hide');$('#who').innerHTML=''}
function start(j){me=j;$('#v-auth').classList.add('hide');$('#v-mail').classList.remove('hide');
 $('#who').innerHTML='<div>'+esc(j.name)+'</div><div>'+esc(j.address)+'</div><button class="ghost" id="outBtn">Sign out</button>';$('#outBtn').onclick=signOut;
 $('#statusBar').innerHTML='<b>Mail between Coffeebreak Mail Live accounts:</b> working on every device. '+
  '<b>Sending to outside addresses (Gmail, Outlook and others):</b> '+(j.outsideSend?'working, up to '+j.outsidePerDay+' a day':'switches on when Coffeebreak\'s own email domain is connected. Outside emails wait safely in Outbox until then.')+' '+
  '<b>Receiving from outside addresses:</b> '+(j.outsideReceive?'working':'switches on with the domain too.');
 receive(true)}
async function receive(first){const btn=$('#receiveBtn');btn.disabled=true;
 try{const j=await api('/mail?since='+since);const ids=new Set(mail.map(m=>m.id));const fresh=j.mail.filter(m=>!ids.has(m.id));mail=fresh.concat(mail).sort((a,b)=>(b.received||0)-(a.received||0));since=j.now-1;
  const n=fresh.filter(m=>m.folder==='Inbox'&&!m.read).length;$('#recvMsg').textContent=first?'':(n?n+' new email'+(n>1?'s':''):'Nothing new right now');render()}
 catch(e){$('#recvMsg').textContent=e.message}finally{btn.disabled=false}}
$('#receiveBtn').onclick=()=>receive(false);
function render(){const F=['Inbox','Sent','Outbox','Archive','Trash'];
 $('#folders').innerHTML=F.map(f=>{const c=mail.filter(m=>m.folder===f&&(f!=='Inbox'||!m.read)).length;return'<button data-f="'+f+'" class="'+(f===folder?'on':'')+'">'+f+(c&&f!=='Sent'&&f!=='Trash'&&f!=='Archive'?' ('+c+')':'')+'</button>'}).join('');
 $('#folders').querySelectorAll('button').forEach(b=>b.onclick=()=>{folder=b.dataset.f;render()});
 const L=mail.filter(m=>m.folder===folder);
 $('#list').innerHTML=L.length?L.map(m=>'<div class="msgi'+(m.read?'':' unread')+'" data-id="'+m.id+'"><b>'+esc(folder==='Sent'||folder==='Outbox'?'To: '+m.to:(m.fromName||m.from))+(m.outside?'<span class="tag">outside</span>':'')+'</b>'+esc(m.subject)+'<div class="s">'+new Date(m.date||m.received).toLocaleString('en-AU')+'</div></div>').join(''):'<p class="muted">No emails in '+folder+'.</p>';
 $('#list').querySelectorAll('.msgi').forEach(d=>d.onclick=()=>openMsg(d.dataset.id))}
function openMsg(id){const m=mail.find(x=>x.id===id);if(!m)return;cur=m;
 if(!m.read){m.read=true;api('/mail/'+id,{method:'PATCH',body:{read:true}}).catch(()=>{});render()}
 const res=(m.results||[]).map(r=>'<li>'+esc(r.to)+': '+(r.ok?'sent':esc(r.error||'not sent'))+'</li>').join('');
 $('#reader').innerHTML='<h2>'+esc(m.subject)+'</h2><div class="muted">From: '+esc(m.fromName?m.fromName+' <'+m.from+'>':m.from)+'<br>To: '+esc(m.to)+(m.cc?'<br>Cc: '+esc(m.cc):'')+'<br>'+new Date(m.date||m.received).toLocaleString('en-AU')+'</div>'+(res?'<ul class="muted">'+res+'</ul>':'')+'<div class="body">'+esc(m.body)+'</div>'+
  '<div>'+(m.folder==='Inbox'||m.folder==='Archive'?'<button id="rReply">Reply</button>':'')+(m.folder==='Outbox'?'<button id="rRetry">Try sending again</button>':'')+(m.folder!=='Archive'&&m.folder!=='Trash'?'<button class="alt" id="rArch">Archive</button>':'')+(m.folder==='Trash'||m.folder==='Archive'?'<button class="alt" id="rBack">Back to Inbox</button>':'')+'<button class="ghost" id="rDel">'+(m.folder==='Trash'?'Delete for good':'Delete')+'</button></div>';
 const on=(s,f)=>{const e=$(s);if(e)e.onclick=f};
 on('#rReply',()=>compose({to:m.from,subj:/^re:/i.test(m.subject)?m.subject:'Re: '+m.subject,body:'\n\nOn '+new Date(m.date||m.received).toLocaleString('en-AU')+', '+(m.fromName||m.from)+' wrote:\n> '+String(m.body).split('\n').join('\n> ')}));
 on('#rRetry',async()=>{try{const j=await api('/send',{method:'POST',body:{to:m.to,cc:m.cc,subject:m.subject,text:m.body}});if(j.outsideState==='waiting'){toast('Still waiting for outside sending to switch on')}else{await api('/mail/'+m.id,{method:'DELETE'});mail=mail.filter(x=>x!==m);toast('Sent');receive(true)}}catch(e){toast(e.message)}});
 on('#rArch',()=>move(m,'Archive'));on('#rBack',()=>move(m,'Inbox'));
 on('#rDel',async()=>{try{await api('/mail/'+m.id,{method:'DELETE'});if(m.folder==='Trash')mail=mail.filter(x=>x!==m);else m.folder='Trash';$('#reader').innerHTML='<p class="muted">Pick an email to read it.</p>';render()}catch(e){toast(e.message)}})}
async function move(m,f){try{await api('/mail/'+m.id,{method:'PATCH',body:{folder:f}});m.folder=f;render();openMsg(m.id)}catch(e){toast(e.message)}}
function compose(o={}){$('#cTo').value=o.to||'';$('#cCc').value='';$('#cSubj').value=o.subj||'';$('#cBody').value=o.body||'';$('#cMsg').textContent='';$('#composeM').classList.remove('hide');$('#cTo').focus()}
$('#composeBtn').onclick=()=>compose();$('#cClose').onclick=()=>$('#composeM').classList.add('hide');
$('#cSend').onclick=async()=>{const b=$('#cSend'),msg=$('#cMsg');b.disabled=true;msg.className='msg';msg.textContent='Sending...';
 try{const j=await api('/send',{method:'POST',body:{to:$('#cTo').value,cc:$('#cCc').value,subject:$('#cSubj').value,text:$('#cBody').value}});
  const okN=j.results.filter(r=>r.ok).length,wait=j.results.filter(r=>r.waiting).length,bad=j.results.filter(r=>!r.ok&&!r.waiting);
  if(bad.length){msg.className='msg err';msg.innerHTML=bad.map(r=>esc(r.to)+': '+esc(r.error)).join('<br>')}
  else{$('#composeM').classList.add('hide')}
  toast((okN?'Sent to '+okN:'')+(okN&&wait?'. ':'')+(wait?wait+' outside address'+(wait>1?'es wait':' waits')+' in Outbox':'')||'Not sent');receive(true)}
 catch(e){msg.className='msg err';msg.textContent=e.message}finally{b.disabled=false}};
if(tok)api('/me').then(start).catch(()=>{});
window.CBML={api,get mail(){return mail}};
})();

api('/status').catch(e=>{const b=document.querySelector('#aMsg');if(b){b.className='msg err';b.textContent=e.message}});
