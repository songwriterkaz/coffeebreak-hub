const DEMO=!!window.CB_DEMO;
const MODES={ // base pattern units [on,off] scaled
 "Gentle Wave":[[200,300],[300,300],[400,300],[300,300]],
 "Pulse":[[150,150]],
 "Heartbeat":[[120,100],[160,600]],
 "Rain":[[40,120],[30,200],[50,90],[30,260],[40,150]],
 "Deep Knead":[[700,250]],
 "Calm Breath":[[1200,400],[100,2400]]};
const names=DEMO?["Gentle Wave","Pulse"]:Object.keys(MODES);
const canVib="vibrate" in navigator && typeof navigator.vibrate==="function";
const $=s=>document.querySelector(s);
let mode=names[0],running=false,loopT=null,endT=null,tickT=null,ac=null,hum=null,humGain=null,soundOnly=!canVib;
function build(){
 const g=$("#modes");names.forEach(n=>{const b=document.createElement("button");b.className="btn";b.textContent=n;b.onclick=()=>{mode=n;mark();if(running)start()};g.appendChild(b)});mark();
 const t=$("#timer");(DEMO?[2]:[5,10,15]).forEach((m,i)=>{const o=document.createElement("option");o.value=m;o.textContent=m+" minutes";t.appendChild(o)});
 $("#sound").checked=soundOnly;
 $("#vibnote").textContent=canVib?"Your phone can vibrate. You can also add sound.":"This device has no vibration (iPhone Safari does not allow it). Sound-only mode is on: a soft low hum with gentle pulses.";
}
function mark(){document.querySelectorAll("#modes .btn").forEach(b=>b.classList.toggle("on",b.textContent===mode))}
function pattern(){const sp=+$("#speed").value/50,it=+$("#int").value/100,out=[];
 MODES[mode].forEach(([on,off])=>{const cyc=(on+off)/sp,o=Math.max(20,cyc*(0.25+0.7*it)*(on/(on+off))/0.5);const onv=Math.min(cyc-10,o);out.push(Math.round(onv),Math.round(Math.max(10,cyc-onv)))});return out}
function audioInit(){if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();humGain=ac.createGain();humGain.gain.value=0;const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=180;humGain.connect(f);f.connect(ac.destination);hum=ac.createOscillator();hum.type="sine";hum.frequency.value=70;const h2=ac.createOscillator();h2.type="triangle";h2.frequency.value=105;const g2=ac.createGain();g2.gain.value=.3;h2.connect(g2);g2.connect(humGain);hum.connect(humGain);hum.start();h2.start()}if(ac.state==="suspended")ac.resume()}
function useSound(){return soundOnly||$("#sound").checked}
function play(){if(!running)return;const p=pattern(),it=+$("#int").value/100;
 if(canVib&&!soundOnly)navigator.vibrate(p);
 if(useSound()){audioInit();const now=ac.currentTime;let t=now;humGain.gain.cancelScheduledValues(now);humGain.gain.setValueAtTime(.02,now);
  for(let i=0;i<p.length;i+=2){const peak=.08+.25*it;humGain.gain.linearRampToValueAtTime(peak,t+Math.min(.08,p[i]/2000));t+=p[i]/1000;humGain.gain.linearRampToValueAtTime(.02,t+.05);t+=p[i+1]/1000}}
 loopT=setTimeout(play,p.reduce((a,b)=>a+b,0))}
function start(){stopAll(true);running=true;const mins=+$("#timer").value;const end=Date.now()+mins*60000;
 endT=setTimeout(()=>{stopAll();$("#status").textContent="Session finished. Well done."},mins*60000);
 tickT=setInterval(()=>{const s=Math.max(0,Math.round((end-Date.now())/1000));$("#status").textContent=mode+" running. "+Math.floor(s/60)+":"+String(s%60).padStart(2,"0")+" left"},500);play()}
function stopAll(q){running=false;clearTimeout(loopT);clearTimeout(endT);clearInterval(tickT);if(canVib)navigator.vibrate(0);if(humGain&&ac)humGain.gain.setTargetAtTime(0,ac.currentTime,.05);if(!q)$("#status").textContent="Stopped."}
// breathing
let brT=null;function breathe(on){clearInterval(brT);const c=$("#circle"),l=$("#brlabel");if(!on){c.style.transform="scale(1)";l.textContent="Press Start to breathe";return}
 let inh=true;const step=()=>{c.style.transform=inh?"scale(1.5)":"scale(1)";l.textContent=inh?"Breathe in":"Breathe out";inh=!inh};step();brT=setInterval(step,4000)}
// music
const songs=[["Sweet Juices Cotton Candy","music/sweet-juices-cotton-candy.mp3"],["Drip Drip Drip","music/drip-drip-drip-country.mp3"],["I'm Weak","music/im-weak.mp3"]];
function tabs(){document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("on",x===b));document.querySelectorAll("section").forEach(s=>s.classList.toggle("show",s.id===b.dataset.t))})}
window.addEventListener("load",()=>{build();tabs();
 $("#go").onclick=start;$("#stop").onclick=()=>stopAll();
 $("#sound").onchange=e=>{if(!canVib)e.target.checked=true};
 $("#calm").onchange=e=>{document.body.classList.toggle("calm",e.target.checked);localStorage.cbcalm=e.target.checked?1:""};
 if(localStorage.cbcalm){$("#calm").checked=true;document.body.classList.add("calm")}
 $("#brgo").onclick=()=>breathe(true);$("#brstop").onclick=()=>breathe(false);
 const sel=$("#song");songs.forEach(([n,u])=>{const o=document.createElement("option");o.value=u;o.textContent=n;sel.appendChild(o)});
 const au=$("#player");$("#mplay").onclick=()=>{au.src=sel.value;au.volume=+$("#vol").value;au.loop=true;au.play().catch(()=>{})};$("#mstop").onclick=()=>au.pause();$("#vol").oninput=e=>au.volume=+e.target.value;
 if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
});
