/* Coffeebreak Easy NDIS Portal - concept demo. Sample data only. Never stores real logins. (c) Karen Elizabeth O'Brien (Coffeebreak) */
(function(){
"use strict";
var KEY="cbEasyNdis.v1";
var REVERSE_URL="https://coffeebreaks.itch.io/coffeebreak-ndis-in-reverse";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function money(n){return "$"+Math.round(n).toLocaleString("en-AU")}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
function fmt(s){var d=new Date(s+"T00:00:00");return d.toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
function uid(){return Math.random().toString(36).slice(2,9)}
var TODAY=new Date();TODAY.setHours(0,0,0,0);

/* ---------- sample data ---------- */
function sample(){
  var start=new Date(TODAY.getFullYear(),TODAY.getMonth()-4,1);
  var end=addDays(new Date(start.getFullYear()+1,start.getMonth(),1),-1);
  return {
    signedIn:false, role:"participant", name:"Sam",
    plan:{start:iso(start),end:iso(end),review:iso(addDays(end,-56)),managed:"Plan-managed (sample)",
      contact:"Bright Path Coordination (sample)"},
    budgets:[
      {id:"b1",group:"Core",name:"Daily activities",total:18000,spent:5600},
      {id:"b2",group:"Core",name:"Transport",total:2400,spent:700},
      {id:"b3",group:"Core",name:"Consumables",total:1500,spent:520},
      {id:"b4",group:"Core",name:"Social and community",total:9000,spent:2600},
      {id:"b5",group:"Capacity Building",name:"Support coordination",total:3500,spent:1100},
      {id:"b6",group:"Capacity Building",name:"Improved daily living",total:6000,spent:1800},
      {id:"b7",group:"Capacity Building",name:"Finding and keeping a job",total:2000,spent:150},
      {id:"b8",group:"Capital",name:"Assistive technology",total:4000,spent:3500},
      {id:"b9",group:"Capital",name:"Home modifications",total:1500,spent:0}
    ],
    goals:[
      {id:"g1",text:"Go to a music or karaoke night once a month",progress:50},
      {id:"g2",text:"Cook three simple meals on my own",progress:25},
      {id:"g3",text:"Catch the bus to the shops with a buddy",progress:75},
      {id:"g4",text:"Try a short course or volunteer job",progress:10}
    ],
    providers:[
      {id:"p1",name:"Sunny Days Support Co",cat:"Daily activities",area:"Newcastle NSW",email:"hello@sunnydays.example.com",rating:5,saved:true},
      {id:"p2",name:"Harbour Living Skills",cat:"Improved daily living",area:"Lake Macquarie NSW",email:"team@harbourskills.example.com",rating:4,saved:true},
      {id:"p3",name:"Pink Wheels Transport",cat:"Transport",area:"Newcastle NSW",email:"rides@pinkwheels.example.com",rating:0,saved:false},
      {id:"p4",name:"Bright Path Coordination",cat:"Support coordination",area:"Hunter NSW",email:"help@brightpath.example.com",rating:4,saved:true},
      {id:"p5",name:"Easy Clean Helpers",cat:"Daily activities",area:"Maitland NSW",email:"book@easyclean.example.com",rating:0,saved:false},
      {id:"p6",name:"Good Gear Assistive Tech",cat:"Assistive technology",area:"Online",email:"sales@goodgear.example.com",rating:3,saved:false},
      {id:"p7",name:"Social Sparks Group Outings",cat:"Social and community",area:"Newcastle NSW",email:"fun@socialsparks.example.com",rating:5,saved:false},
      {id:"p8",name:"Job Ready Pathways",cat:"Finding and keeping a job",area:"Hunter NSW",email:"start@jobready.example.com",rating:0,saved:false}
    ],
    bookings:[
      {id:"k1",date:iso(addDays(TODAY,1)),time:"10:00",provider:"Sunny Days Support Co",what:"Shopping and errands",budget:"b1",note:""},
      {id:"k2",date:iso(addDays(TODAY,3)),time:"18:30",provider:"Social Sparks Group Outings",what:"Karaoke night",budget:"b4",note:""},
      {id:"k3",date:iso(addDays(TODAY,6)),time:"14:00",provider:"Harbour Living Skills",what:"Cooking skills session",budget:"b6",note:""},
      {id:"k4",date:iso(addDays(TODAY,9)),time:"09:30",provider:"Pink Wheels Transport",what:"Ride to community group",budget:"b2",note:""}
    ],
    claims:[
      {id:"c1",date:iso(addDays(TODAY,-20)),provider:"Sunny Days Support Co",amount:412.5,status:"Paid",photo:""},
      {id:"c2",date:iso(addDays(TODAY,-12)),provider:"Harbour Living Skills",amount:386.2,status:"Paid",photo:""},
      {id:"c3",date:iso(addDays(TODAY,-5)),provider:"Social Sparks Group Outings",amount:120,status:"Pending",photo:""},
      {id:"c4",date:iso(addDays(TODAY,-2)),provider:"Bright Path Coordination",amount:193.99,status:"Pending",photo:""}
    ],
    shifts:[
      {id:"s1",worker:"Alex (sample)",date:iso(addDays(TODAY,-2)),start:"09:00",end:"12:00",task:"Shopping and cooking",confirmed:true},
      {id:"s2",worker:"Jordan (sample)",date:iso(addDays(TODAY,-1)),start:"13:00",end:"16:00",task:"Community outing",confirmed:false},
      {id:"s3",worker:"Alex (sample)",date:iso(addDays(TODAY,1)),start:"10:00",end:"13:00",task:"Shopping and errands",confirmed:false}
    ],
    docs:[
      {id:"d1",name:"My NDIS plan (sample).pdf",type:"Plan",date:iso(new Date(start))},
      {id:"d2",name:"Service agreement - Sunny Days (sample).pdf",type:"Agreement",date:iso(addDays(new Date(start),10))},
      {id:"d3",name:"Invoice 1042 - Harbour Living Skills (sample).pdf",type:"Invoice",date:iso(addDays(TODAY,-12))}
    ],
    notes:"",
    sections:null
  };
}
var SECTIONS=[
  {id:"plan",title:"My Plan",icon:"📋"},
  {id:"budgets",title:"My Money",icon:"💰"},
  {id:"bookings",title:"Bookings",icon:"📅"},
  {id:"providers",title:"Providers",icon:"🤝"},
  {id:"claims",title:"Claims and invoices",icon:"🧾"},
  {id:"shifts",title:"Support worker shifts",icon:"⏰"},
  {id:"goals",title:"My Goals",icon:"🌟"},
  {id:"documents",title:"Documents",icon:"📁"},
  {id:"words",title:"NDIS words made easy",icon:"💬"},
  {id:"helper",title:"Coffeebreak AI helper",icon:"🤖"},
  {id:"reverse",title:"Things NDIS won't fund",icon:"💖"}
];
var GLOSSARY=[
  ["NDIS","National Disability Insurance Scheme. Government money to help people with disability get supports."],
  ["NDIA","The agency that runs the NDIS. They make and review plans."],
  ["Plan","A list of your goals and the money you can spend on supports, for a set time."],
  ["Participant","The person with the NDIS plan."],
  ["Core supports","Money for everyday things: help at home, transport, consumables and getting out in the community. It is the most flexible budget."],
  ["Capacity Building","Money to learn skills and become more independent, like support coordination, living skills or job help."],
  ["Capital","Money for bigger things like equipment (assistive technology) or changes to your home."],
  ["Assistive technology","Equipment that helps you do things, like special chairs, apps or devices."],
  ["Consumables","Everyday items you use up, like continence products or low-cost aids."],
  ["Plan review","When the NDIA checks your plan, usually near the end. They may change it."],
  ["Reassessment","A new look at your plan if things change."],
  ["Self-managed","You pay providers yourself and claim the money back."],
  ["Plan-managed","A plan manager pays your providers for you."],
  ["Agency-managed","The NDIA pays your providers directly. You must use registered providers."],
  ["Plan manager","A business that pays invoices and keeps track of your money."],
  ["Support coordinator","A person who helps you find providers and use your plan."],
  ["Local area coordinator (LAC)","A person who helps you make and use your plan in your area."],
  ["Provider","A business or person who gives you supports."],
  ["Registered provider","A provider approved by the NDIS Quality and Safeguards Commission."],
  ["Service agreement","A written deal between you and a provider about what they do and the price."],
  ["Service booking","Setting aside money in your plan for a provider."],
  ["Invoice","A bill from a provider saying what you need to pay."],
  ["Claim","Asking for money to pay an invoice from your plan."],
  ["Reasonable and necessary","The rule the NDIA uses to decide what supports they fund."],
  ["Price guide (Pricing Arrangements)","The NDIA list of the most a provider can charge."],
  ["Nominee","A person allowed to act for you with the NDIS."]
];

/* ---------- state ---------- */
var S;
function load(){try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
  if(!S||!S.plan){S=sample()}
  if(!S.sections){S.sections=SECTIONS.map(function(x){return {id:x.id,title:x.title,icon:x.icon,hidden:false}})}
  SECTIONS.forEach(function(x){if(!S.sections.some(function(y){return y.id===x.id}))S.sections.push({id:x.id,title:x.title,icon:x.icon,hidden:false})});
  if(!S.prefs)S.prefs={text:0,hc:false,easy:false};
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast("Could not save on this device. The photo may be too big.")}}
function sec(id){return S.sections.filter(function(x){return x.id===id})[0]||{title:id,icon:""}}
function toast(t){var el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(function(){el.classList.remove("show")},2600)}

/* ---------- prefs ---------- */
function applyPrefs(){
  document.body.classList.remove("t1","t2");if(S.prefs.text)document.body.classList.add("t"+S.prefs.text);
  document.body.classList.toggle("hc",!!S.prefs.hc);document.body.classList.toggle("easy",!!S.prefs.easy);
  $("#tContrast").setAttribute("aria-pressed",String(!!S.prefs.hc));$("#tEasy").setAttribute("aria-pressed",String(!!S.prefs.easy));
  $("#tText span").textContent=["Bigger text","Biggest text","Normal text"][S.prefs.text];
  var r={participant:"Participant view",planmanager:"Plan manager view",coordinator:"Support coordinator view"};
  $("#roleLabel").textContent=S.signedIn?(r[S.role]+" · demo"):"Demo";
}
$("#tText").onclick=function(){S.prefs.text=(S.prefs.text+1)%3;save();applyPrefs()};
$("#tContrast").onclick=function(){S.prefs.hc=!S.prefs.hc;save();applyPrefs()};
$("#tEasy").onclick=function(){S.prefs.easy=!S.prefs.easy;save();applyPrefs();toast(S.prefs.easy?"Easy read is on":"Easy read is off")};
var speaking=false;
function speak(text){
  if(!("speechSynthesis" in window)){toast("Read aloud is not available in this browser");return}
  speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang="en-AU";u.rate=.95;
  u.onend=function(){speaking=false;$("#tRead span").textContent="Read aloud"};
  speaking=true;$("#tRead span").textContent="Stop";speechSynthesis.speak(u);
}
$("#tRead").onclick=function(){
  if(speaking&&window.speechSynthesis){speechSynthesis.cancel();speaking=false;$("#tRead span").textContent="Read aloud";return}
  var m=$("#main").cloneNode(true);$$(".detail",m).forEach(function(n){if(S.prefs.easy)n.remove()});$$("script,select,input,textarea,.noread",m).forEach(function(n){n.remove()});
  speak(m.innerText.replace(/\s+/g," ").trim());
};

/* ---------- maths ---------- */
function planInfo(){
  var s=new Date(S.plan.start+"T00:00:00"),e=new Date(S.plan.end+"T00:00:00"),r=new Date(S.plan.review+"T00:00:00");
  var total=(e-s)/864e5+1,gone=Math.min(total,Math.max(0,(TODAY-s)/864e5+1));
  return {s:s,e:e,frac:gone/total,daysLeft:Math.round((e-TODAY)/864e5),reviewIn:Math.round((r-TODAY)/864e5)};
}
function forecast(b){var p=planInfo();var f=p.frac>0?b.spent/p.frac:b.spent;return f}
function status(b){var f=forecast(b)/b.total;if(b.total===0)return ["ok","No money here"];
  if(b.spent>=b.total)return ["bad","Used up"];
  if(f>1.05)return ["bad","Will run out early"];if(f>.9)return ["warn","Watch this"];return ["ok","On track"]}
function groupTotals(){var g={};S.budgets.forEach(function(b){g[b.group]=g[b.group]||{total:0,spent:0};g[b.group].total+=b.total;g[b.group].spent+=b.spent});return g}
function cls(group){return group==="Core"?"core":group==="Capital"?"capi":"capb"}

/* ---------- views ---------- */
function backBar(id){var x=sec(id);return '<div class="spread"><h1>'+esc(x.icon)+" "+esc(x.title)+'</h1><a class="btn" href="#home">🏠 Home</a></div>'}
function easy(t){return '<div class="easy-only easybox">📖 '+t+'</div>'}
var V={};

V.signin=function(){
  return '<div class="signin card"><img src="logo.png" alt="Coffeebreak logo"><h1>Welcome to the Easy NDIS Portal</h1>'+
  '<p>A simpler, calmer way to see your NDIS plan. This is a <strong>demo</strong> with made-up sample data.</p>'+
  '<p class="muted">It is not connected to the NDIS or the NDIA. It never asks for your real myGov, NDIS or bank login, and it never stores passwords. Everything stays on this device.</p>'+
  '<label for="dname">What should we call you (first name only, optional)</label><input id="dname" maxlength="20" placeholder="Sam" autocomplete="off">'+
  '<button class="primary big" data-role="participant">🙋 Start demo as participant</button>'+
  '<button class="big" data-role="planmanager">🧾 Start demo as plan manager</button>'+
  '<button class="big" data-role="coordinator">🧭 Start demo as support coordinator</button>'+
  '<p class="muted" style="font-size:.8rem">For your real plan, use the official my NDIS portal.</p></div>';
};
V.signin.bind=function(){$$("[data-role]").forEach(function(b){b.onclick=function(){
  var n=$("#dname").value.trim().replace(/[^A-Za-z '\-]/g,"").slice(0,20);
  S.signedIn=true;S.role=b.getAttribute("data-role");if(n)S.name=n;save();applyPrefs();location.hash="#home";render()}})};

V.home=function(){
  var p=planInfo(),g=groupTotals(),next=S.bookings.slice().sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)}).filter(function(b){return b.date>=iso(TODAY)})[0];
  var pend=S.claims.filter(function(c){return c.status==="Pending"});
  var tiles=S.sections.filter(function(x){return !x.hidden}).map(function(x){return '<a class="btn tile" href="#'+x.id+'"><span class="ic" aria-hidden="true">'+esc(x.icon)+'</span>'+esc(x.title)+'</a>'}).join("");
  var role=S.role==="planmanager"?'<div class="card coord"><h2>🧾 Plan manager tools (demo)</h2><p>'+pend.length+' invoice(s) waiting for you to approve.</p><a class="btn primary" href="#claims">Review invoices</a></div>':
    S.role==="coordinator"?'<div class="card coord"><h2>🧭 Support coordinator notes (demo)</h2><label for="cnote">Notes for this participant (saved on this device)</label><textarea id="cnote" rows="3">'+esc(S.notes)+'</textarea><div class="row" style="margin-top:.4rem"><button id="saveNote" class="primary">Save notes</button><a class="btn" href="#bookings">Add a booking</a><a class="btn" href="#providers">Find providers</a></div></div>':"";
  return '<h1>Hi '+esc(S.name)+'</h1>'+easy("This is your home page. Tap a big button to go somewhere.")+
  '<div class="kpi"><div class="card"><span>Money left</span><b>'+money(Object.keys(g).reduce(function(a,k){return a+g[k].total-g[k].spent},0))+'</b></div>'+
  '<div class="card"><span>Plan days left</span><b>'+p.daysLeft+'</b></div>'+
  '<div class="card"><span>Next booking</span><b style="font-size:1rem">'+(next?esc(fmt(next.date))+" "+esc(next.time):"None")+'</b></div>'+
  '<div class="card"><span>Claims waiting</span><b>'+pend.length+'</b></div></div>'+
  (p.reviewIn<=60&&p.reviewIn>=0?'<div class="card"><strong>⏰ Plan review in '+p.reviewIn+' days.</strong> <a href="#plan">Get ready</a></div>':'')+
  role+'<h2>Where do you want to go</h2><nav class="grid" aria-label="Sections">'+tiles+'</nav>'+
  '<div class="row" style="margin-top:1rem"><a class="btn" href="#customise">✏️ Change my headings</a><a class="btn" href="#settings">⚙️ Settings and sign out</a></div>';
};
V.home.bind=function(){var b=$("#saveNote");if(b)b.onclick=function(){S.notes=$("#cnote").value;save();toast("Notes saved")}};

V.plan=function(){
  var p=planInfo();
  return backBar("plan")+easy("Your plan has your goals and your money. It started on "+esc(fmt(S.plan.start))+" and ends on "+esc(fmt(S.plan.end))+".")+
  '<div class="card"><h2>Plan dates</h2><ul class="clean"><li>Start: <strong>'+esc(fmt(S.plan.start))+'</strong></li><li>End: <strong>'+esc(fmt(S.plan.end))+'</strong></li>'+
  '<li>Plan review: <strong>'+esc(fmt(S.plan.review))+'</strong> <span class="pill '+(p.reviewIn<30?"warn":"info")+'">in '+p.reviewIn+' days</span></li>'+
  '<li class="detail">How it is managed: '+esc(S.plan.managed)+'</li><li class="detail">Support coordinator: '+esc(S.plan.contact)+'</li></ul>'+
  '<div class="bar" aria-label="Plan time used"><i class="core" style="width:'+Math.round(p.frac*100)+'%"></i></div><p class="muted">'+Math.round(p.frac*100)+'% of plan time has passed.</p>'+
  '<button id="remind" class="primary">⏰ Add review reminder to my calendar</button></div>'+
  '<div class="card"><h2>My goals</h2><ul class="clean">'+S.goals.map(function(g){return '<li>🌟 '+esc(g.text)+' <span class="pill info">'+g.progress+'%</span></li>'}).join("")+'</ul><a class="btn" href="#goals">Update my goals</a></div>'+
  '<div class="card detail"><h2>Getting ready for your review</h2><ul><li>Think about what worked and what did not</li><li>Gather reports and quotes in Documents</li><li>Check your goals and progress stickers</li><li>Ask your support coordinator to help</li><li>Write down what you want to change</li></ul></div>';
};
V.plan.bind=function(){$("#remind").onclick=function(){
  var d=S.plan.review.replace(/-/g,"");
  var ics="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Coffeebreak//Easy NDIS Portal//EN\r\nBEGIN:VEVENT\r\nUID:"+uid()+"@coffeebreak-demo\r\nDTSTAMP:"+iso(TODAY).replace(/-/g,"")+"T000000Z\r\nDTSTART;VALUE=DATE:"+d+"\r\nSUMMARY:NDIS plan review (demo reminder)\r\nDESCRIPTION:Get ready for your plan review. Reminder made with Coffeebreak Easy NDIS Portal demo.\r\nBEGIN:VALARM\r\nTRIGGER:-P14D\r\nACTION:DISPLAY\r\nDESCRIPTION:Plan review in 2 weeks\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n";
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));a.download="ndis-plan-review-reminder.ics";document.body.appendChild(a);a.click();a.remove();toast("Reminder file made. Open it to add to your calendar.")}};

V.budgets=function(){
  var g=groupTotals(),p=planInfo();
  var groups=["Core","Capacity Building","Capital"];
  return backBar("budgets")+easy("Each bar shows money used. The black line shows how much time has passed. If the bar goes past the line, you are spending fast.")+
  '<div class="legend card"><span><i class="core"></i>Core</span><span><i class="capb"></i>Capacity Building</span><span><i class="capi"></i>Capital</span><span><i style="background:#3a1028;width:4px"></i>Time passed ('+Math.round(p.frac*100)+'%)</span></div>'+
  groups.map(function(gr){var t=g[gr];return '<div class="card"><div class="spread"><h2>'+esc(gr)+'</h2><span><strong>'+money(t.total-t.spent)+'</strong> left of '+money(t.total)+'</span></div>'+
    S.budgets.filter(function(b){return b.group===gr}).map(function(b){var st=status(b),pc=b.total?Math.min(100,b.spent/b.total*100):0,fc=forecast(b);
      return '<div style="margin:.6rem 0"><div class="spread"><strong>'+esc(b.name)+'</strong><span class="pill '+st[0]+'">'+st[1]+'</span></div>'+
      '<div class="bar" role="img" aria-label="'+esc(b.name)+' '+Math.round(pc)+' percent used"><i class="'+cls(gr)+'" style="width:'+pc+'%"></i><b style="left:'+Math.round(p.frac*100)+'%"></b></div>'+
      '<div class="spread muted" style="font-size:.85rem"><span>Used '+money(b.spent)+' · Left '+money(b.total-b.spent)+'</span><span class="detail">Forecast by plan end: '+money(fc)+(fc>b.total?" (about "+money(fc-b.total)+" over)":"")+'</span></div></div>'}).join("")+'</div>'}).join("")+
  '<div class="card detail"><h2>📈 Spending forecast</h2><p>If you keep spending at the same speed, by '+esc(fmt(S.plan.end))+' you will use about <strong>'+money(S.budgets.reduce(function(a,b){return a+forecast(b)},0))+'</strong> of your '+money(S.budgets.reduce(function(a,b){return a+b.total},0))+'.</p><p class="muted">This is a simple estimate from sample data. It is not advice.</p></div>';
};

V.providers=function(){
  return backBar("providers")+easy("Find people who help you. Tap the star to save them. Tap Message to send an email.")+
  '<div class="card"><label for="pq">Search providers</label><input id="pq" placeholder="Try transport, cleaning or a name"><div class="row" style="margin-top:.4rem"><button id="pSaved" aria-pressed="false" class="small">⭐ Saved only</button></div></div><div id="plist"></div>';
};
V.providers.bind=function(){
  var savedOnly=false;
  function draw(){var q=$("#pq").value.toLowerCase();
    var l=S.providers.filter(function(p){return (!savedOnly||p.saved)&&(p.name+p.cat+p.area).toLowerCase().indexOf(q)>-1});
    $("#plist").innerHTML=l.length?l.map(function(p){
      var stars=[1,2,3,4,5].map(function(n){return '<button data-rate="'+p.id+'" data-n="'+n+'" aria-label="Rate '+n+' stars">'+(n<=p.rating?"⭐":"☆")+'</button>'}).join("");
      var body=encodeURIComponent("Hello "+p.name+",\n\nI found you on the Coffeebreak Easy NDIS Portal demo. I would like to ask about your supports.\n\nThank you");
      return '<div class="card"><div class="spread"><h3>'+esc(p.name)+'</h3><button class="small" data-save="'+p.id+'" aria-pressed="'+p.saved+'">'+(p.saved?"⭐ Saved":"☆ Save")+'</button></div>'+
      '<p class="muted" style="margin:.2rem 0">'+esc(p.cat)+' · '+esc(p.area)+'</p><div class="stars row" aria-label="Your rating">'+stars+'</div>'+
      '<div class="row"><a class="btn small primary" href="mailto:'+esc(p.email)+'?subject='+encodeURIComponent("NDIS support enquiry")+'&body='+body+'">✉️ Message</a><a class="btn small" href="#bookings" data-book="'+esc(p.name)+'">📅 Book</a></div></div>'}).join(""):'<div class="card">No providers found. Try another word.</div>';
    $$("[data-save]").forEach(function(b){b.onclick=function(){var p=S.providers.filter(function(x){return x.id===b.dataset.save})[0];p.saved=!p.saved;save();draw();toast(p.saved?"Saved":"Removed from saved")}});
    $$("[data-rate]").forEach(function(b){b.onclick=function(){var p=S.providers.filter(function(x){return x.id===b.dataset.rate})[0];p.rating=+b.dataset.n;save();draw();toast("Thanks for rating")}});
    $$("[data-book]").forEach(function(b){b.onclick=function(){sessionStorage.setItem("cbBookProv",b.dataset.book)}});
  }
  $("#pq").oninput=draw;$("#pSaved").onclick=function(){savedOnly=!savedOnly;this.setAttribute("aria-pressed",savedOnly);draw()};draw();
};

var calMonth=null;
V.bookings=function(){
  return backBar("bookings")+easy("See who is coming and when. Tap Add booking to make a new one.")+
  '<div class="card"><div class="spread"><button id="calPrev" class="small" aria-label="Previous month">◀</button><h2 id="calTitle" style="margin:0"></h2><button id="calNext" class="small" aria-label="Next month">▶</button></div><div class="cal" id="cal" style="margin-top:.5rem"></div></div>'+
  '<div class="card"><h2>Coming up</h2><ul class="clean" id="blist"></ul></div>'+
  '<div class="card"><h2>➕ Add booking</h2><div class="form2"><div><label for="bp">Provider</label><select id="bp">'+S.providers.map(function(p){return '<option>'+esc(p.name)+'</option>'}).join("")+'</select></div>'+
  '<div><label for="bw">What for</label><input id="bw" placeholder="For example: cleaning"></div><div><label for="bd">Date</label><input id="bd" type="date" value="'+iso(addDays(TODAY,2))+'"></div><div><label for="bt">Time</label><input id="bt" type="time" value="10:00"></div>'+
  '<div><label for="bb">Pay from</label><select id="bb">'+S.budgets.map(function(b){return '<option value="'+b.id+'">'+esc(b.group+" - "+b.name)+'</option>'}).join("")+'</select></div>'+
  '<div><label for="bn">'+(S.role==="coordinator"?"Coordinator note":"Note")+'</label><input id="bn" placeholder="Optional"></div></div><button id="badd" class="primary big">Save booking</button></div>';
};
V.bookings.bind=function(){
  var pre=sessionStorage.getItem("cbBookProv");if(pre){$("#bp").value=pre;sessionStorage.removeItem("cbBookProv")}
  if(!calMonth)calMonth=new Date(TODAY.getFullYear(),TODAY.getMonth(),1);
  function drawCal(){var y=calMonth.getFullYear(),m=calMonth.getMonth();$("#calTitle").textContent=calMonth.toLocaleDateString("en-AU",{month:"long",year:"numeric"});
    var first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate(),h=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(function(d){return '<div class="h">'+d+'</div>'}).join("");
    for(var i=0;i<first;i++)h+='<div aria-hidden="true"></div>';
    for(var d=1;d<=days;d++){var ds=iso(new Date(y,m,d)),bk=S.bookings.filter(function(b){return b.date===ds});
      h+='<div class="'+(ds===iso(TODAY)?"today":"")+'"><strong>'+d+'</strong>'+bk.map(function(b){return '<span class="dot" title="'+esc(b.time+" "+b.what)+'">'+esc(b.time)+'</span>'}).join("")+'</div>'}
    $("#cal").innerHTML=h}
  function drawList(){var l=S.bookings.slice().sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)});
    $("#blist").innerHTML=l.map(function(b){var bud=S.budgets.filter(function(x){return x.id===b.budget})[0];
      return '<li><div class="spread"><span><strong>'+esc(fmt(b.date))+' '+esc(b.time)+'</strong><br>'+esc(b.what)+' with '+esc(b.provider)+'<span class="detail muted"><br>Pay from: '+esc(bud?bud.name:"")+(b.note?" · "+esc(b.note):"")+'</span></span><button class="small" data-del="'+b.id+'">Cancel</button></div></li>'}).join("")||"<li>No bookings yet.</li>";
    $$("[data-del]").forEach(function(x){x.onclick=function(){if(!confirm("Cancel this booking"))return;S.bookings=S.bookings.filter(function(b){return b.id!==x.dataset.del});save();drawList();drawCal();toast("Booking cancelled")}})}
  $("#calPrev").onclick=function(){calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()-1,1);drawCal()};
  $("#calNext").onclick=function(){calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()+1,1);drawCal()};
  $("#badd").onclick=function(){var w=$("#bw").value.trim()||"Support";if(!$("#bd").value){toast("Please pick a date");return}
    S.bookings.push({id:uid(),date:$("#bd").value,time:$("#bt").value||"09:00",provider:$("#bp").value,what:w,budget:$("#bb").value,note:$("#bn").value.trim()});save();
    calMonth=new Date($("#bd").value+"T00:00:00");calMonth.setDate(1);drawCal();drawList();$("#bw").value="";$("#bn").value="";toast("Booking saved")};
  drawCal();drawList();
};

V.claims=function(){
  var pm=S.role==="planmanager";
  return backBar("claims")+easy("Take a photo of a bill. We keep track if it is paid or waiting.")+
  '<div class="card"><h2>📷 Add an invoice</h2><div class="form2"><div><label for="cp">Provider</label><select id="cp">'+S.providers.map(function(p){return '<option>'+esc(p.name)+'</option>'}).join("")+'</select></div>'+
  '<div><label for="ca">Amount ($)</label><input id="ca" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00"></div>'+
  '<div><label for="cf">Photo of invoice</label><input id="cf" type="file" accept="image/*" capture="environment"></div><div><label>Preview</label><div id="cprev" class="muted">No photo yet</div></div></div>'+
  '<p class="muted" style="font-size:.8rem">The photo stays on this device only. Nothing is sent anywhere.</p><button id="cadd" class="primary big">Save invoice</button></div>'+
  '<div class="card"><div class="spread"><h2>My invoices</h2><select id="cfilter" style="width:auto" aria-label="Show"><option value="">Show all</option><option>Pending</option><option>Paid</option></select></div><ul class="clean" id="clist"></ul></div>'+
  (pm?'<p class="muted">Plan manager view: you can mark invoices as paid.</p>':'');
};
V.claims.bind=function(){
  var photo="";
  $("#cf").onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){var img=new Image();img.onload=function(){
    var c=document.createElement("canvas"),sc=Math.min(1,240/Math.max(img.width,img.height));c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    photo=c.toDataURL("image/jpeg",.7);$("#cprev").innerHTML='<img class="thumb" alt="Invoice photo preview" src="'+photo+'">'};img.src=r.result};r.readAsDataURL(f)};
  function draw(){var fl=$("#cfilter").value,pm=S.role==="planmanager";
    $("#clist").innerHTML=S.claims.slice().reverse().filter(function(c){return !fl||c.status===fl}).map(function(c){
      return '<li><div class="spread"><span class="row">'+(c.photo?'<img class="thumb" alt="Invoice photo" src="'+c.photo+'">':'<span class="thumb" style="display:inline-flex;align-items:center;justify-content:center;font-size:1.6rem" aria-hidden="true">🧾</span>')+
      '<span><strong>'+money(c.amount)+'</strong> '+esc(c.provider)+'<br><span class="muted">'+esc(fmt(c.date))+'</span></span></span>'+
      '<span class="row"><span class="pill '+(c.status==="Paid"?"ok":"warn")+'">'+(c.status==="Paid"?"✅ Paid":"⏳ Pending")+'</span>'+
      (pm&&c.status!=="Paid"?'<button class="small primary" data-pay="'+c.id+'">Approve and pay</button>':'')+'</span></div></li>'}).join("")||"<li>Nothing here.</li>";
    $$("[data-pay]").forEach(function(b){b.onclick=function(){S.claims.forEach(function(c){if(c.id===b.dataset.pay)c.status="Paid"});save();draw();toast("Marked as paid (demo)")}})}
  $("#cfilter").onchange=draw;
  $("#cadd").onclick=function(){var a=parseFloat($("#ca").value);if(!(a>0)){toast("Please type the amount");return}
    S.claims.push({id:uid(),date:iso(TODAY),provider:$("#cp").value,amount:a,status:"Pending",photo:photo});save();photo="";$("#ca").value="";$("#cf").value="";$("#cprev").textContent="No photo yet";draw();toast("Invoice saved. It is pending.")};
  draw();
};

function hrs(s){var a=s.start.split(":"),b=s.end.split(":");return Math.max(0,(+b[0]*60+ +b[1]-(+a[0]*60+ +a[1]))/60)}
V.shifts=function(){
  return backBar("shifts")+easy("See when your support workers come. Tap Confirm when a shift happened.")+
  '<div class="kpi"><div class="card"><span>Hours this fortnight</span><b id="hrsTot">0</b></div><div class="card"><span>Shifts to confirm</span><b id="toConf">0</b></div></div>'+
  '<div class="card"><h2>Shifts</h2><ul class="clean" id="slist"></ul></div>'+
  '<div class="card"><h2>➕ Add shift</h2><div class="form2"><div><label for="sw">Worker first name</label><input id="sw" placeholder="For example: Alex"></div><div><label for="sd">Date</label><input id="sd" type="date" value="'+iso(TODAY)+'"></div>'+
  '<div><label for="ss">Start</label><input id="ss" type="time" value="09:00"></div><div><label for="se">Finish</label><input id="se" type="time" value="12:00"></div>'+
  '<div style="grid-column:1/-1"><label for="st">What we did</label><input id="st" placeholder="For example: shopping"></div></div><button id="sadd" class="primary big">Save shift</button></div>';
};
V.shifts.bind=function(){
  function draw(){var l=S.shifts.slice().sort(function(a,b){return (b.date+b.start).localeCompare(a.date+a.start)});var lo=iso(addDays(TODAY,-14));
    $("#hrsTot").textContent=S.shifts.filter(function(s){return s.date>=lo&&s.date<=iso(TODAY)}).reduce(function(a,s){return a+hrs(s)},0);
    $("#toConf").textContent=S.shifts.filter(function(s){return !s.confirmed&&s.date<=iso(TODAY)}).length;
    $("#slist").innerHTML=l.map(function(s){var past=s.date<=iso(TODAY);return '<li><div class="spread"><span><strong>'+esc(s.worker)+'</strong> · '+esc(fmt(s.date))+'<br>'+esc(s.start)+' to '+esc(s.end)+' ('+hrs(s)+' hours) · '+esc(s.task)+'</span>'+
      (s.confirmed?'<span class="pill ok">✅ Confirmed</span>':past?'<button class="small primary" data-conf="'+s.id+'">Confirm shift</button>':'<span class="pill info">Coming up</span>')+'</div></li>'}).join("");
    $$("[data-conf]").forEach(function(b){b.onclick=function(){S.shifts.forEach(function(s){if(s.id===b.dataset.conf)s.confirmed=true});save();draw();toast("Shift confirmed")}})}
  $("#sadd").onclick=function(){var w=$("#sw").value.trim();if(!w){toast("Please type the worker's first name");return}
    var s={id:uid(),worker:w.slice(0,30),date:$("#sd").value||iso(TODAY),start:$("#ss").value||"09:00",end:$("#se").value||"10:00",task:$("#st").value.trim()||"Support",confirmed:false};
    if(hrs(s)<=0){toast("Finish time must be after start time");return}S.shifts.push(s);save();draw();$("#sw").value="";$("#st").value="";toast("Shift saved")};
  draw();
};

var STK=[[25,"🌸"],[50,"⭐"],[75,"💖"],[100,"🏆"]];
V.goals=function(){
  return backBar("goals")+easy("Tap plus when you do something for your goal. You get a sticker at each step.")+
  '<div id="glist"></div><div class="card"><h2>➕ New goal</h2><label for="gn">My goal</label><input id="gn" placeholder="For example: join a choir"><button id="gadd" class="primary big">Add goal</button></div>';
};
V.goals.bind=function(){
  function draw(){$("#glist").innerHTML=S.goals.map(function(g){var st=STK.filter(function(s){return g.progress>=s[0]}).map(function(s){return s[1]}).join("");
    return '<div class="card"><div class="spread"><h3>'+esc(g.text)+'</h3><span class="pill info">'+g.progress+'%</span></div><div class="bar"><i class="core" style="width:'+g.progress+'%"></i></div>'+
    '<div class="spread" style="margin-top:.4rem"><span class="stickers" aria-label="Stickers earned">'+(st||'<span class="muted" style="font-size:.85rem">No stickers yet</span>')+'</span><span class="row"><button class="small" data-gm="'+g.id+'" aria-label="Take away 10 percent">➖</button><button class="small primary" data-gp="'+g.id+'" aria-label="Add 10 percent">➕ I did a step</button></span></div></div>'}).join("");
    $$("[data-gp]").forEach(function(b){b.onclick=function(){bump(b.dataset.gp,10)}});$$("[data-gm]").forEach(function(b){b.onclick=function(){bump(b.dataset.gm,-10)}})}
  function bump(id,n){S.goals.forEach(function(g){if(g.id===id){var old=g.progress;g.progress=Math.max(0,Math.min(100,g.progress+n));
    STK.forEach(function(s){if(old<s[0]&&g.progress>=s[0])toast("New sticker "+s[1]+(s[0]===100?" Goal done, well done.":" Keep going."))})}});save();draw()}
  $("#gadd").onclick=function(){var t=$("#gn").value.trim();if(!t){toast("Please type your goal");return}S.goals.push({id:uid(),text:t.slice(0,120),progress:0});save();$("#gn").value="";draw();toast("Goal added")};
  draw();
};

var docFiles={};
V.documents=function(){
  return backBar("documents")+easy("Keep your plan, agreements and bills in one place.")+
  '<div class="card"><h2>➕ Add a document</h2><div class="form2"><div><label for="df">File or photo</label><input id="df" type="file"></div><div><label for="dt">Type</label><select id="dt"><option>Plan</option><option>Agreement</option><option>Invoice</option><option>Quote</option><option>Report</option><option>Other</option></select></div></div>'+
  '<p class="muted" style="font-size:.8rem">Files stay on this device. In this demo the file can be opened until you close the page, and the name is remembered.</p><button id="dadd" class="primary big">Save document</button></div>'+
  '<div class="card"><label for="dq">Search documents</label><input id="dq" placeholder="Type a word"><ul class="clean" id="dlist" style="margin-top:.5rem"></ul></div>';
};
V.documents.bind=function(){
  function draw(){var q=$("#dq").value.toLowerCase();$("#dlist").innerHTML=S.docs.filter(function(d){return (d.name+d.type).toLowerCase().indexOf(q)>-1}).slice().reverse().map(function(d){
    return '<li><div class="spread"><span>📄 <strong>'+esc(d.name)+'</strong><br><span class="muted">'+esc(d.type)+' · '+esc(fmt(d.date))+'</span></span>'+(docFiles[d.id]?'<a class="btn small" target="_blank" rel="noopener" href="'+docFiles[d.id]+'">Open</a>':'<span class="pill info">Sample</span>')+'</div></li>'}).join("")||"<li>No documents found.</li>"}
  $("#dq").oninput=draw;
  $("#dadd").onclick=function(){var f=$("#df").files[0];if(!f){toast("Please choose a file");return}var id=uid();docFiles[id]=URL.createObjectURL(f);
    S.docs.push({id:id,name:f.name.slice(0,80),type:$("#dt").value,date:iso(TODAY)});save();$("#df").value="";draw();toast("Document saved")};
  draw();
};

V.words=function(){
  return backBar("words")+easy("NDIS words can be hard. Here they are in plain English. Tap 🔊 to hear one.")+
  '<div class="card"><label for="wq">Find a word</label><input id="wq" placeholder="For example: core"></div><div class="card"><ul class="clean" id="wlist"></ul></div>';
};
V.words.bind=function(){function draw(){var q=$("#wq").value.toLowerCase();
  $("#wlist").innerHTML=GLOSSARY.filter(function(g){return (g[0]+g[1]).toLowerCase().indexOf(q)>-1}).map(function(g,i){return '<li><div class="spread"><strong>'+esc(g[0])+'</strong><button class="small noread" data-say="'+esc(g[0]+". "+g[1])+'" aria-label="Read '+esc(g[0])+' aloud">🔊</button></div>'+esc(g[1])+'</li>'}).join("")||"<li>No match. Try the AI helper.</li>";
  $$("[data-say]").forEach(function(b){b.onclick=function(){speak(b.dataset.say)}})}
  $("#wq").oninput=draw;draw()};

/* ---------- rule-based helper ---------- */
function answer(q){
  q=q.toLowerCase().trim();var p=planInfo(),g=groupTotals();
  var left=function(b){return money(b.total-b.spent)};
  if(!q)return "Ask me about your money, bookings, claims, goals, plan review or an NDIS word.";
  if(/mean|what is|what's|what are|explain/.test(q)){var bestG=null;GLOSSARY.forEach(function(g){var w=g[0].toLowerCase().replace(/\s*\(.*\)/,"");if(q.indexOf(w)>-1&&(!bestG||w.length>bestG[2]))bestG=[g[0],g[1],w.length]});if(bestG)return bestG[0]+": "+bestG[1]}
  if(/^(hi|hello|hey|g'?day)\b/.test(q))return "Hello "+S.name+". I can help with your plan. Try: How much money is left";
  for(var i=0;i<S.budgets.length;i++){var b=S.budgets[i];if(q.indexOf(b.name.toLowerCase())>-1||(b.name==="Transport"&&/transport|bus|taxi|ride/.test(q))||(b.name==="Assistive technology"&&/equipment|\bat\b|assistive/.test(q)))
    return b.name+" ("+b.group+"): "+left(b)+" left of "+money(b.total)+". "+status(b)[1]+"."}
  if(/core/.test(q))return "Core has "+money(g.Core.total-g.Core.spent)+" left of "+money(g.Core.total)+". Core is for everyday supports and is the most flexible.";
  if(/capacity/.test(q))return "Capacity Building has "+money(g["Capacity Building"].total-g["Capacity Building"].spent)+" left. It is for learning skills and support coordination.";
  if(/capital/.test(q))return "Capital has "+money(g.Capital.total-g.Capital.spent)+" left. It is for equipment and home changes.";
  if(/(money|budget|left|spend|spent|funds?)\b/.test(q)){var t=S.budgets.reduce(function(a,b){return a+b.total-b.spent},0);
    var risk=S.budgets.filter(function(b){return status(b)[0]==="bad"}).map(function(b){return b.name});
    return "You have "+money(t)+" left in your plan."+(risk.length?" Watch these, they may run out early: "+risk.join(", ")+".":" Everything looks on track.")}
  if(/\b(review|ends?|finish|expires?|dates?)\b/.test(q))return "Your plan ends on "+fmt(S.plan.end)+" ("+p.daysLeft+" days). Your review is on "+fmt(S.plan.review)+", in "+p.reviewIn+" days. Open My Plan to add a reminder.";
  if(/book|appointment|next|coming/.test(q)){var n=S.bookings.filter(function(b){return b.date>=iso(TODAY)}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)})[0];
    return n?"Your next booking is "+n.what+" with "+n.provider+" on "+fmt(n.date)+" at "+n.time+".":"You have no bookings coming up."}
  if(/claim|invoice|bill|paid|pending|pay/.test(q)){var pe=S.claims.filter(function(c){return c.status==="Pending"});return pe.length+" invoice(s) are pending, worth "+money(pe.reduce(function(a,c){return a+c.amount},0))+". Open Claims to see them."}
  if(/shift|worker|hours/.test(q)){var u=S.shifts.filter(function(s){return !s.confirmed&&s.date<=iso(TODAY)}).length;return "You have "+S.shifts.length+" shifts listed and "+u+" to confirm."}
  if(/goal|sticker/.test(q)){var best=S.goals.slice().sort(function(a,b){return b.progress-a.progress})[0];return "You have "+S.goals.length+" goals. Closest to done: "+(best?best.text+" at "+best.progress+"%":"none yet")+"."}
  if(/provider|find|helper|cleaner|support worker/.test(q))return "Open Providers to search, save and rate helpers, and to send them a message.";
  if(/won'?t fund|not fund|reverse|not covered|declined/.test(q))return "For things the NDIS often won't fund, try Coffeebreak NDIS in Reverse. Tap the pink heart button on Home.";
  if(/real|login|password|mygov|connect/.test(q))return "This is a demo with sample data. It cannot see your real plan and never asks for your login. Use the official my NDIS portal for your real plan.";
  for(var j=0;j<GLOSSARY.length;j++){var w=GLOSSARY[j][0].toLowerCase().replace(/\s*\(.*\)/,"");if(q.indexOf(w)>-1)return GLOSSARY[j][0]+": "+GLOSSARY[j][1]}
  return "Sorry, I am a simple helper and did not understand. Try: How much money is left, When is my review, What is my next booking, or What does core mean.";
}
V.helper=function(){
  return backBar("helper")+easy("Type a question or tap a button. The helper answers about your sample plan.")+
  '<div class="card"><div class="chat" id="chat" aria-live="polite"><div class="msg bot">Hi '+esc(S.name)+', I am the Coffeebreak AI helper. I answer simple questions about your plan, right here on your device.</div></div>'+
  '<div class="row" style="margin:.5rem 0">'+["How much money is left","When is my review","What is my next booking","Any claims pending","What does capacity building mean","Transport money"].map(function(s){return '<button class="small" data-q="'+esc(s)+'">'+esc(s)+'</button>'}).join("")+'</div>'+
  '<form id="hform" class="row"><label for="hq" class="hide">Your question</label><input id="hq" style="flex:1" placeholder="Ask a question" autocomplete="off"><button class="primary" type="submit">Ask</button></form>'+
  '<label style="font-weight:normal;margin-top:.4rem"><input type="checkbox" id="hspeak" style="width:auto;min-height:auto"> Read answers aloud</label></div>'+
  '<p class="muted detail" style="font-size:.8rem">The helper uses simple rules, not the internet. It is not advice.</p>';
};
V.helper.bind=function(){
  function ask(q){var c=$("#chat");c.insertAdjacentHTML("beforeend",'<div class="msg me">'+esc(q)+'</div>');var a=answer(q);
    c.insertAdjacentHTML("beforeend",'<div class="msg bot">'+esc(a)+'</div>');c.scrollTop=c.scrollHeight;if($("#hspeak").checked)speak(a)}
  $$("[data-q]").forEach(function(b){b.onclick=function(){ask(b.dataset.q)}});
  $("#hform").onsubmit=function(e){e.preventDefault();var q=$("#hq").value.trim();if(q){ask(q);$("#hq").value=""}};
};

V.reverse=function(){
  return backBar("reverse")+easy("Some things the NDIS does not pay for. Coffeebreak NDIS in Reverse is a store for those things.")+
  '<div class="card"><h2>💖 Coffeebreak NDIS in Reverse</h2><p>A pink Coffeebreak store for supports, services and fun outings the NDIS often won\'t fund, like pamper days, karaoke nights, day trips, cleaning, pet care and tech help.</p>'+
  '<p class="muted">It is a separate Coffeebreak store. It is not part of the NDIS.</p><a class="btn primary big" href="'+REVERSE_URL+'" target="_blank" rel="noopener">Open NDIS in Reverse</a></div>';
};

V.customise=function(){
  return '<div class="spread"><h1>✏️ Change my headings</h1><a class="btn" href="#home">🏠 Home</a></div>'+easy("Change the names of the buttons. Move them up or down. Hide the ones you do not need.")+
  '<div class="card" id="secs"></div><div class="row"><button id="secReset">Reset to normal</button></div>';
};
V.customise.bind=function(){
  function draw(){$("#secs").innerHTML=S.sections.map(function(x,i){return '<div class="sec-row"><input aria-label="Icon for '+esc(x.title)+'" data-ic="'+i+'" value="'+esc(x.icon)+'" style="width:3.2rem;text-align:center"><input aria-label="Heading name" data-ti="'+i+'" value="'+esc(x.title)+'">'+
    '<span class="ctl"><button class="small" data-up="'+i+'" aria-label="Move up" '+(i===0?"disabled":"")+'>⬆️</button><button class="small" data-dn="'+i+'" aria-label="Move down" '+(i===S.sections.length-1?"disabled":"")+'>⬇️</button>'+
    '<button class="small" data-hd="'+i+'" aria-pressed="'+x.hidden+'">'+(x.hidden?"🙈 Hidden":"👁️ Shown")+'</button></span></div>'}).join("");
    $$("[data-ti]").forEach(function(n){n.onchange=function(){S.sections[+n.dataset.ti].title=n.value.trim().slice(0,40)||SECTIONS.filter(function(s){return s.id===S.sections[+n.dataset.ti].id})[0].title;save();toast("Heading saved")}});
    $$("[data-ic]").forEach(function(n){n.onchange=function(){S.sections[+n.dataset.ic].icon=n.value.trim().slice(0,4);save()}});
    $$("[data-up]").forEach(function(b){b.onclick=function(){mv(+b.dataset.up,-1)}});$$("[data-dn]").forEach(function(b){b.onclick=function(){mv(+b.dataset.dn,1)}});
    $$("[data-hd]").forEach(function(b){b.onclick=function(){var x=S.sections[+b.dataset.hd];x.hidden=!x.hidden;save();draw()}})}
  function mv(i,d){var a=S.sections,t=a[i];a[i]=a[i+d];a[i+d]=t;save();draw();var f=$('[data-'+(d<0?"up":"dn")+'="'+(i+d)+'"]');if(f&&!f.disabled)f.focus()}
  $("#secReset").onclick=function(){S.sections=SECTIONS.map(function(x){return {id:x.id,title:x.title,icon:x.icon,hidden:false}});save();draw();toast("Headings reset")};
  draw();
};

V.settings=function(){
  return '<div class="spread"><h1>⚙️ Settings</h1><a class="btn" href="#home">🏠 Home</a></div>'+
  '<div class="card"><h2>Who is using the portal</h2><div class="row" role="group" aria-label="View">'+[["participant","🙋 Participant"],["planmanager","🧾 Plan manager"],["coordinator","🧭 Support coordinator"]].map(function(r){return '<button data-setrole="'+r[0]+'" aria-pressed="'+(S.role===r[0])+'">'+r[1]+'</button>'}).join("")+'</div>'+
  '<p class="muted detail">Plan managers can approve invoices. Support coordinators can keep notes and add bookings.</p></div>'+
  '<div class="card"><h2>Easy settings</h2><p>Use the buttons at the top: Read aloud, Bigger text, Contrast and Easy read. Your choices are saved on this device.</p></div>'+
  '<div class="card"><h2>Demo data</h2><div class="row"><button id="resetDemo">Reset sample data</button><button id="signOut" class="primary">Sign out of demo</button></div><p class="muted" style="font-size:.8rem">This demo never stores passwords. Sign out keeps your saved demo data on this device.</p></div>';
};
V.settings.bind=function(){
  $$("[data-setrole]").forEach(function(b){b.onclick=function(){S.role=b.dataset.setrole;save();applyPrefs();render();toast("Changed view")}});
  $("#resetDemo").onclick=function(){if(!confirm("Reset all demo data on this device"))return;var keep=S.prefs;S=sample();S.signedIn=true;load2(keep);save();applyPrefs();toast("Sample data reset")};
  $("#signOut").onclick=function(){S.signedIn=false;save();applyPrefs();location.hash="#signin";render()};
};
function load2(p){S.sections=SECTIONS.map(function(x){return {id:x.id,title:x.title,icon:x.icon,hidden:false}});S.prefs=p}

/* ---------- router ---------- */
function render(){
  if(window.speechSynthesis&&speaking){speechSynthesis.cancel();speaking=false;$("#tRead span").textContent="Read aloud"}
  var r=(location.hash||"#home").slice(1);
  if(!S.signedIn)r="signin";else if(r==="signin")r="home";
  if(!V[r])r="home";
  $("#main").innerHTML=V[r]();if(V[r].bind)V[r].bind();
  var t={home:"Home",signin:"Welcome",customise:"Change my headings",settings:"Settings"}[r]||sec(r).title;document.title=t+" · Coffeebreak Easy NDIS Portal (demo)";
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",function(){render();var m=$("#main");if(m)m.focus({preventScroll:true})});
load();applyPrefs();render();
window.CBNDIS={answer:answer,state:function(){return S}};
})();
