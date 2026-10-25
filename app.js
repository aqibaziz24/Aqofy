/* Aqofy Unified SPA - app.js */

// Global State
let mode='login', generatedCode='', fpVerifiedEmail='';
let selectedFeature=null;
const features=[
 {id:'chat',title:'Chat Rooms',desc:'Join & talk',icon:'fa-comments',gradient:'linear-gradient(135deg,#3b82f6,#7c5cf0)'},
 {id:'random',title:'Random Chat',desc:'Meet strangers',icon:'fa-shuffle',gradient:'linear-gradient(135deg,#f97316,#eab308)'},
 {id:'groups',title:'Trending Groups',desc:'Popular groups',icon:'fa-fire',gradient:'linear-gradient(135deg,#8b5cf6,#ec4899)'},
 {id:'people',title:'People Nearby',desc:'Discover users',icon:'fa-users',gradient:'linear-gradient(135deg,#10b981,#06b6d4)'}
];

// Page Router
function showPage(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 window.scrollTo(0,0);
}

// Auth
function toggleEye(inputId,btnId){
 const input=document.getElementById(inputId), btn=document.getElementById(btnId);
 if(!input) return;
 if(input.type==='password'){input.type='text'; btn.style.color='#3b82f6';} else {input.type='password'; btn.style.color='#9ca3af';}
}
function switchMode(newMode){
 mode=newMode; const isSignup=mode==='signup';
 document.getElementById('loginTabBtn').classList.toggle('active',!isSignup);
 document.getElementById('signupTabBtn').classList.toggle('active',isSignup);
 document.getElementById('nameGroup').classList.toggle('hidden',!isSignup);
 document.getElementById('confirmGroup').classList.toggle('hidden',!isSignup);
 document.getElementById('loginOptions').classList.toggle('hidden',isSignup);
 document.getElementById('fullName').required=isSignup;
 document.getElementById('confirmPassword').required=isSignup;
 document.getElementById('title').innerText=isSignup?'Create Account':'Welcome Back';
 document.getElementById('subtitle').innerText=isSignup?'Create your Aqofy account':'Please login to continue';
 document.getElementById('submitBtn').innerHTML=isSignup?'<i class="fa-solid fa-user-plus"></i> CREATE ACCOUNT':'<i class="fa-solid fa-right-to-bracket"></i> LOGIN';
 document.getElementById('switchText').innerHTML=isSignup?'Already have an account? <a onclick="switchMode(\'login\')">Login</a>':'Don\'t have an account? <a onclick="switchMode(\'signup\')">Create one</a>';
 hideMsg();
}
function showMsg(t,type){const e=document.getElementById('errorBox'), s=document.getElementById('successBox'); hideMsg(); if(type==='success'){s.style.display='block'; s.innerText=t}else{e.style.display='block'; e.innerText=t}}
function hideMsg(){document.getElementById('errorBox').style.display='none';document.getElementById('successBox').style.display='none';}
function handleAuth(e){
 e.preventDefault(); hideMsg();
 const email=document.getElementById('email').value.trim(), pass=document.getElementById('password').value.trim(), name=document.getElementById('fullName').value.trim(), confirm=document.getElementById('confirmPassword').value.trim();
 if(!email||!pass){showMsg('Please fill all required fields','error');return;}
 if(mode==='signup'){ if(!name){showMsg('Please enter full name','error');return;} if(pass.length<6){showMsg('Password must be at least 6 characters','error');return;} if(pass!==confirm){showMsg('Passwords do not match','error');return;}}
 try{localStorage.setItem('currentLoggedInUser',email);localStorage.setItem('isLoggedIn','true');localStorage.setItem('userFullName',name||email);localStorage.setItem('userPassword_'+email,pass);}catch{}
 showMsg(mode==='signup'?'Account created! Redirecting...':'Login Successful!','success');
 setTimeout(()=>{ initFeaturePage(); showPage('page-feature'); updateSideProfile(); },700);
}
function guestLogin(){localStorage.setItem('loginType','guest');localStorage.setItem('isLoggedIn','true');localStorage.setItem('currentLoggedInUser','Guest');showMsg('Guest mode activated','success'); setTimeout(()=>{initFeaturePage(); showPage('page-feature');},600);}
function openForgot(){document.getElementById('forgotModal').classList.add('open');document.getElementById('fpStep1').classList.remove('hidden');document.getElementById('fpStep2').classList.add('hidden');document.getElementById('fpStep3').classList.add('hidden');document.getElementById('fpEmail').value=document.getElementById('email').value.trim();}
function closeForgot(){document.getElementById('forgotModal').classList.remove('open');generatedCode='';fpVerifiedEmail='';document.getElementById('fpEmail').value='';document.getElementById('fpCode').value='';document.getElementById('fpNewPass').value='';document.getElementById('fpConfirmPass').value='';}
function sendResetCode(isResend=false){const email=document.getElementById('fpEmail').value.trim();const err=document.getElementById('fpError1');if(!email||!email.includes('@')){err.style.display='block';err.innerText='Please enter valid email';return;}err.style.display='none';generatedCode=Math.floor(100000+Math.random()*900000).toString();fpVerifiedEmail=email;localStorage.setItem('aqofy_reset_code_'+email,generatedCode);document.getElementById('demoCode').innerText=generatedCode;document.getElementById('fpEmailShow').innerText=email;document.getElementById('fpStep1').classList.add('hidden');document.getElementById('fpStep2').classList.remove('hidden');document.getElementById('fpStep3').classList.add('hidden');document.getElementById('fpSuccess2').style.display='block';document.getElementById('fpSuccess2').innerText=isResend?'New code sent!':'Code sent!';setTimeout(()=>{document.getElementById('fpSuccess2').style.display='none';},3000);}
function verifyResetCode(){const code=document.getElementById('fpCode').value.trim();const err=document.getElementById('fpError2');if(code.length!==6){err.style.display='block';err.innerText='Enter 6-digit code';return;}if(code!==generatedCode){err.style.display='block';err.innerText='Invalid code';return;}err.style.display='none';document.getElementById('fpSuccess2').style.display='block';document.getElementById('fpSuccess2').innerText='Code verified!';setTimeout(()=>{document.getElementById('fpStep2').classList.add('hidden');document.getElementById('fpStep3').classList.remove('hidden');document.getElementById('fpSuccess2').style.display='none';},600);}
function resetPassword(){const np=document.getElementById('fpNewPass').value.trim(), cp=document.getElementById('fpConfirmPass').value.trim(), err=document.getElementById('fpError3');if(!np||np.length<6){err.style.display='block';err.innerText='Min 6 chars';return;}if(np!==cp){err.style.display='block';err.innerText='Passwords do not match';return;}err.style.display='none';try{localStorage.setItem('userPassword_'+fpVerifiedEmail,np);}catch{}document.getElementById('fpStep3').innerHTML='<div style="text-align:center;padding:20px 0"><div style="width:56px;height:56px;background:#22c55e;color:#fff;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;font-size:24px"><i class="fa-solid fa-check"></i></div><h4>Password Reset!</h4><button class="auth-btn" style="margin-top:16px" onclick="closeForgot()">Continue to Login</button></div>';}

// Feature
function initFeaturePage(){
 const grid=document.getElementById('featureGrid'); if(!grid) return;
 grid.innerHTML=''; const year=new Date().getFullYear(); document.getElementById('dynamicYearFooter').innerText=`© 2025–${year} Aqofy. All rights reserved.`;
 features.forEach(f=>{
  const btn=document.createElement('button'); btn.className='feature-card'; btn.id='feat-'+f.id;
  btn.innerHTML=`<div class="feature-icon" style="background:${f.gradient}"><i class="fa-solid ${f.icon}"></i></div><div style="font-weight:700;font-size:14px">${f.title}</div><div style="font-size:12px;color:#64748b;margin-top:2px">${f.desc}</div>`;
  btn.onclick=()=>selectFeature(f.id); grid.appendChild(btn);
 });
}
function selectFeature(id){
 selectedFeature=id; document.querySelectorAll('.feature-card').forEach(c=>c.classList.remove('selected')); document.getElementById('feat-'+id)?.classList.add('selected'); document.getElementById('featureContinue').disabled=false;
 if(!document.querySelector('#feat-'+id+' .check-badge')){ const badge=document.createElement('span'); badge.className='check-badge'; badge.innerHTML='<i class="fa-solid fa-check" style="font-size:10px"></i>'; document.getElementById('feat-'+id).appendChild(badge); }
}
function confirmFeature(){
 if(!selectedFeature) return; const f=features.find(x=>x.id===selectedFeature);
 const box=document.getElementById('featureSuccess'); box.classList.remove('hidden'); box.classList.add('active'); box.style.display='flex'; box.style.background='#f0fdf4'; box.style.border='1px solid #bbf7d0'; box.style.padding='12px'; box.style.borderRadius='10px'; box.style.gap='10px';
 box.innerHTML=`<div style="width:32px;height:32px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-check"></i></div><div><div style="font-weight:700;font-size:13px;color:#166534">Awesome! ${f.title} selected</div><div style="font-size:12px;color:#15803d">Redirecting to dashboard...</div><div style="height:6px;background:#bbf7d0;border-radius:999px;margin-top:6px;overflow:hidden"><div style="height:100%;background:#22c55e;width:0%;animation:progress 1.2s ease forwards"></div></div></div>`;
 localStorage.setItem('selectedFeature',selectedFeature);
 setTimeout(()=>{ showPage('page-dashboard'); initDashboard(); },1200);
}

// Dashboard Core
function initDashboard(){ updateSideProfile(); renderLists(); renderGroups(); renderList(); renderInterestChips(); setChatFilter(localStorage.getItem('rcChatFilter')||'all',true); initSettings(); initProfile(); renderSupportMessages(); initRealtimePresence(); handleGlobalSearch(''); }
function updateSideProfile(){
 const email=localStorage.getItem('currentLoggedInUser')||'User', name=localStorage.getItem('userFullName')||email;
 document.getElementById('sideName').innerText=name; document.getElementById('sideEmail').innerText=email; document.getElementById('sideAvatar').innerText=name.charAt(0).toUpperCase();
 document.getElementById('profileDisplayName').innerText=name; document.getElementById('profileDisplayEmail').innerText=email;
}
function toggleSidebar(open){const s=document.getElementById('sidebar'), o=document.getElementById('sidebarOverlay'); if(open){s.classList.add('active');o.classList.add('active');}else{s.classList.remove('active');o.classList.remove('active');}}
function switchAppView(view){
 toggleSidebar(false);
 document.querySelectorAll('#dashboardContent .view-page').forEach(v=>v.classList.remove('active'));
 const map={messages:'view-messages',rooms:'view-rooms',connections:'view-connections',random:'view-random',support:'view-support',settings:'view-settings',profile:'view-profile',mobile:'view-mobile',people:'view-connections'};
 const target=map[view]||'view-messages'; document.getElementById(target)?.classList.add('active');
 document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.remove('active')); const bottom=document.querySelector(`.bottom-nav .nav-item[data-view="${view}"]`)||document.querySelector(`.bottom-nav .nav-item[data-view="${view==='people'?'connections':view}"]`); if(bottom) bottom.classList.add('active');
 if(view==='support'){ document.getElementById('supportCategoryModal').style.display='flex'; }
 window.scrollTo(0,0);
}
function handleGlobalSearch(q){
 const lower=q.toLowerCase();
 // inbox filter
 document.querySelectorAll('.y99-room').forEach(room=>{
  const name=room.querySelector('.y99-room-name')?.innerText.toLowerCase()||''; const last=room.querySelector('.y99-room-last')?.innerText.toLowerCase()||''; room.style.display=(name.includes(lower)||last.includes(lower)||q==='')?'flex':'none';
 });
 // groups filter
 document.querySelectorAll('.group-card').forEach(card=>{
  const name=card.querySelector('.group-name')?.innerText.toLowerCase()||''; card.style.display=(name.includes(lower)||q==='')?'flex':'none';
 });
 // app grid
 document.querySelectorAll('#appGrid .app-item').forEach(item=>{
  const n=item.getAttribute('data-name')||''; item.style.display=n.includes(lower)?'flex':'none';
 });
 if(q!==''){ handleSearch(q); }
}

// Inbox Logic
function escapeHtml(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}
function getTimeStr(){const now=new Date();let h=now.getHours();const m=now.getMinutes().toString().padStart(2,'0');const am=h>=12?'PM':'AM';h=h%12||12;return h+':'+m+' '+am;}
let pendingRooms=JSON.parse(localStorage.getItem('pendingRooms')||'null');
if(!pendingRooms){pendingRooms=[{id:'notif_bot',name:"Notification_Bot!",last:"Please verify your email...",time:"now",color:"linear-gradient(135deg,#3b82f6,#7c5cf0)",unread:true}];localStorage.setItem('pendingRooms',JSON.stringify(pendingRooms));}
let yourRooms=JSON.parse(localStorage.getItem('yourConversations')||'[]');
const botTexts=["Please Verify your email, <go in manu profile and verify your email>","Go to setting for set your sounds system and our suggestions if you are girl off your pm in setting","Thanks for reading our important messages"];
let chatHistory=JSON.parse(localStorage.getItem('notifChatHistory')||'[]'); let hasBotSent=localStorage.getItem('botHasSent')==='true';
function renderLists(){
 const pendingEl=document.getElementById('pendingList'), yourEl=document.getElementById('yourList'), yourEmpty=document.getElementById('yourEmpty'); if(!pendingEl||!yourEl) return;
 pendingEl.innerHTML=''; if(pendingRooms.length===0){pendingEl.innerHTML='<div style="padding:12px;text-align:center;color:#aaa;font-size:12px;">No pending</div>';}else{pendingRooms.forEach(room=>{const d=document.createElement('div');d.className='y99-room';d.onclick=()=>openY99Chat(room,'pending');d.innerHTML=`<div class="y99-room-icon" style="background:${room.color}"><i class="fa-solid fa-bell"></i></div><div class="y99-room-main"><div class="y99-room-top"><div class="y99-room-name">${room.name}</div><div class="y99-room-time">${room.time}</div></div><div class="y99-room-last">${room.last}</div></div>${room.unread?'<div style="width:8px;height:8px;background:#3b82f6;border-radius:50%;"></div>':''}`;pendingEl.appendChild(d);});}
 yourEl.querySelectorAll('.y99-room').forEach(e=>e.remove()); if(yourRooms.length===0){if(yourEmpty) yourEmpty.style.display='block';}else{if(yourEmpty) yourEmpty.style.display='none'; yourRooms.forEach(room=>{const d=document.createElement('div');d.className='y99-room';d.onclick=()=>openY99Chat(room,'your');d.innerHTML=`<div class="y99-room-icon" style="background:${room.color}"><i class="fa-solid fa-bell"></i></div><div class="y99-room-main"><div class="y99-room-top"><div class="y99-room-name">${room.name}</div><div class="y99-room-time">${room.time}</div></div><div class="y99-room-last">${room.last}</div></div>`;yourEl.appendChild(d);});}
}
function openY99Chat(room,from){
 document.getElementById('y99ChatView').classList.add('active'); document.getElementById('y99ChatName').innerText=room.name; const msgContainer=document.getElementById('y99ChatMessages'); msgContainer.innerHTML='';
 if(hasBotSent&&chatHistory.length>0){document.getElementById('y99ChatSub').innerText=''; chatHistory.forEach(m=>{addY99Message(m.sender,m.text,m.time,false);}); if(from==='pending') moveToYour(); return;}
 document.getElementById('y99ChatSub').innerText='typing...'; let delay=400; botTexts.forEach((txt,idx)=>{setTimeout(()=>showY99Typing(),delay-200); setTimeout(()=>{hideY99Typing();const timeStr=getTimeStr();addY99Message('bot',txt,timeStr,true); if(idx===botTexts.length-1){document.getElementById('y99ChatSub').innerText='';hasBotSent=true;localStorage.setItem('botHasSent','true'); if(from==='pending') moveToYour();}},delay); delay+=1300;});
}
function moveToYour(){if(pendingRooms.length===0) return; const room=pendingRooms[0]; pendingRooms=[]; localStorage.setItem('pendingRooms',JSON.stringify(pendingRooms)); if(!yourRooms.find(r=>r.id===room.id)){yourRooms.unshift({id:room.id,name:room.name,last:botTexts[botTexts.length-1],time:getTimeStr(),color:room.color}); localStorage.setItem('yourConversations',JSON.stringify(yourRooms));} setTimeout(renderLists,600);}
function closeY99Chat(){document.getElementById('y99ChatView').classList.remove('active'); renderLists();}
function addY99Message(sender,text,timeStr,save){const container=document.getElementById('y99ChatMessages'); const row=document.createElement('div'); row.className='y99-msg-row'; row.innerHTML=`<div class="y99-msg-avatar ${sender==='bot'?'bot':''}">${sender==='bot'?'<i class="fa-solid fa-robot"></i>':'U'}</div><div style="display:flex;flex-direction:column;gap:2px;max-width:80%"><div class="y99-msg-bubble">${escapeHtml(text)}</div><div class="y99-msg-time">${timeStr}</div></div>`; container.appendChild(row); container.scrollTop=container.scrollHeight; if(save){chatHistory.push({sender,text,time:timeStr}); localStorage.setItem('notifChatHistory',JSON.stringify(chatHistory));}}
function showY99Typing(){const c=document.getElementById('y99ChatMessages'); hideY99Typing(); const t=document.createElement('div'); t.id='y99Typing'; t.className='y99-msg-row'; t.innerHTML=`<div class="y99-msg-avatar bot"><i class="fa-solid fa-robot"></i></div><div class="y99-typing"><span></span><span></span><span></span></div>`; c.appendChild(t); c.scrollTop=c.scrollHeight;}
function hideY99Typing(){const t=document.getElementById('y99Typing'); if(t) t.remove();}

// Trending Groups
const groups=[{name:'Pakistan Lovers 🇵🇰',members:'12.5k',icon:'🇵🇰',bg:'#fef3c7',trending:'+2.3k today'},{name:'Gaming Zone 🎮',members:'8.2k',icon:'🎮',bg:'#dbeafe',trending:'+1.8k today'},{name:'Music Lovers 🎵',members:'5.1k',icon:'🎵',bg:'#fce7f3',trending:'+1.2k today'},{name:'Funny Memes 😂',members:'15k',icon:'😂',bg:'#ffedd5',trending:'+3.1k today'},{name:'Cricket Fans 🏏',members:'9.7k',icon:'🏏',bg:'#dcfce7',trending:'+890 today'},{name:'Study Group 📚',members:'4.3k',icon:'📚',bg:'#e0e7ff',trending:'+650 today'},{name:'Foodies Hub 🍕',members:'6.8k',icon:'🍕',bg:'#fee2e2',trending:'+540 today'},{name:'Travel Buddies ✈️',members:'3.9k',icon:'✈️',bg:'#ccfbf1',trending:'+420 today'},{name:'Tech Talk 💻',members:'7.2k',icon:'💻',bg:'#f3e8ff',trending:'+380 today'},{name:'Late Night Chats 🌙',members:'11k',icon:'🌙',bg:'#e0f2fe',trending:'+2.7k today'}];
function renderGroups(){const list=document.getElementById('groupList'); if(!list) return; list.innerHTML=''; groups.forEach(g=>{const div=document.createElement('div');div.className='group-card';div.innerHTML=`<div class="group-icon" style="background:${g.bg}">${g.icon}</div><div class="group-info"><div class="group-name">${g.name}</div><div class="group-meta"><span><i class="fa-solid fa-users"></i> ${g.members}</span><span>•</span><span style="color:#16a34a">${g.trending}</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><div class="live-badge"><div style="width:6px;height:6px;background:#22c55e;border-radius:50%"></div> LIVE</div><button class="join-btn" onclick="toggleJoin(this)">Join</button></div>`;list.appendChild(div);});}
function toggleJoin(btn){if(btn.classList.contains('joined')){btn.classList.remove('joined');btn.textContent='Join';}else{btn.classList.add('joined');btn.textContent='Joined ✓';}}

// Connections
let activeCategory='all',searchQuery='',onlineOnly=false;
const dataset={friends:[{id:1,name:'Ali Khan',handle:'@ali',status:'Active now',online:true,avatar:'A',lastSeen:Date.now()}],requests:[{id:2,name:'Sara Ahmed',handle:'@sara',status:'Wants to be friends',online:false,avatar:'S'}],discover:[],blocked:[]};
function sortByOnline(list){return [...list].sort((a,b)=>{if(a.online&&!b.online)return -1;if(!a.online&&b.online)return 1;return (a.lastSeen||0)-(b.lastSeen||0);});}
function switchCategory(cat){activeCategory=cat;document.querySelectorAll('.pill-tab').forEach(t=>t.classList.remove('active'));document.getElementById('tab-'+cat)?.classList.add('active');const bar=document.getElementById('onlineBar');if(bar) bar.style.display=cat==='discover'?'none':'flex';renderList();}
function handleSearch(v){searchQuery=v.toLowerCase();const clear=document.getElementById('searchClearBtn'); if(clear) clear.style.display=v?'block':'none';renderList();}
function clearSearch(){searchQuery='';const inp=document.getElementById('searchInput'); if(inp) inp.value=''; const gb=document.getElementById('globalSearch'); if(gb) gb.value=''; const clear=document.getElementById('searchClearBtn'); if(clear) clear.style.display='none';renderList();}
function toggleOnlineOnly(c){onlineOnly=c;renderList();}
function getFiltered(list){let i=[...list];if(searchQuery){i=i.filter(u=>u.name.toLowerCase().includes(searchQuery)||u.handle.toLowerCase().includes(searchQuery));}if(onlineOnly){i=i.filter(u=>u.online);}i=sortByOnline(i);return i;}
function createCard(user,cat){let act='';if(cat==='friends')act=`<button class="btn-action btn-primary" onclick="alert('Chat started with ${user.name}')"><i class="fa-solid fa-comment"></i> Chat</button>`;else if(cat==='requests')act=`<button class="btn-action btn-primary" onclick="acceptRequest(${user.id})">Accept</button><button class="btn-action btn-secondary btn-icon-only" onclick="declineRequest(${user.id})"><i class="fa-solid fa-xmark"></i></button>`;else if(cat==='discover')act=`<button class="btn-action btn-primary" onclick="addFriend(${user.id})"><i class="fa-solid fa-user-plus"></i> Add</button>`;else if(cat==='blocked')act=`<button class="btn-action btn-secondary" onclick="unblockUser(${user.id})">Unblock</button>`;return `<div class="contact-card"><div class="avatar-ring">${user.avatar}${user.online?'<div class="online-glow"></div>':''}</div><div class="user-details"><div class="user-name">${user.name}</div><div class="user-subtitle">${user.handle} • ${user.status}</div></div><div class="actions-group">${act}</div></div>`;}
function renderAddsBox(){return `<div class="adds-box"><div class="adds-label">Write user ID you want to add<br><span style="font-weight:500;color:#64748b;font-size:11px">e.g. user123</span></div><div class="adds-input-row"><input id="addUserIdInput" class="adds-input" placeholder="e.g. user123" /><button class="adds-btn" onclick="addByUserId()"><i class="fa-solid fa-plus"></i> Add</button></div></div>`;}
function addByUserId(){const inp=document.getElementById('addUserIdInput');const val=inp.value.trim();if(!val){alert('Please enter user ID');return;}const cleanId=val.replace('@','').trim();const name=cleanId.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())||'New User';const newUser={id:Date.now(),name:name,handle:cleanId,status:'Request sent',online:false,avatar:name.charAt(0).toUpperCase(),lastSeen:0};dataset.requests.push({...newUser,status:'Request Pending'});inp.value='';const c=document.getElementById('directoryList');c.innerHTML=renderAddsBox()+`<div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:10px 12px;border-radius:12px;font-size:12px;font-weight:600;margin-top:2px"><i class="fa-solid fa-check"></i> ${cleanId} - Request sent!</div>`; setTimeout(renderList,1500);}
function renderList(){const c=document.getElementById('directoryList'); if(!c) return; if(activeCategory==='discover'){c.innerHTML=renderAddsBox();return;} if(activeCategory==='all'){let html='';const f=getFiltered(dataset.friends),r=getFiltered(dataset.requests),b=getFiltered(dataset.blocked);if(f.length===0&&r.length===0&&b.length===0){c.innerHTML=`<div class="empty-state"><i class="fa-solid fa-users-slash"></i><h4>No contacts</h4></div>`;return;}if(f.length>0){html+=`<div class="inbox-label">Friends</div>`;f.forEach(u=>html+=createCard(u,'friends'));}if(r.length>0){html+=`<div class="inbox-label">Requests</div>`;r.forEach(u=>html+=createCard(u,'requests'));}if(b.length>0){html+=`<div class="inbox-label">Blocked</div>`;b.forEach(u=>html+=createCard(u,'blocked'));}c.innerHTML=html;return;}let items=getFiltered(dataset[activeCategory]||[]);if(items.length===0){const label=activeCategory==='friends'?'No friends':activeCategory==='requests'?'No requests':'No blocked users';c.innerHTML=`<div class="empty-state"><i class="fa-solid fa-users-slash"></i><h4>${label}</h4></div>`;return;}c.innerHTML=items.map(u=>createCard(u,activeCategory)).join('');}
function acceptRequest(id){let idx=dataset.requests.findIndex(r=>r.id===id);if(idx!==-1){let u=dataset.requests.splice(idx,1)[0];u.lastSeen=0;u.online=true;u.status='Active now';dataset.friends.push(u);renderList();}}
function declineRequest(id){let idx=dataset.requests.findIndex(r=>r.id===id);if(idx!==-1){dataset.requests.splice(idx,1);renderList();}}
function addFriend(id){let idx=dataset.discover.findIndex(r=>r.id===id);if(idx!==-1){let u=dataset.discover.splice(idx,1)[0];u.status='Request Pending';dataset.requests.push(u);renderList();}}
function unblockUser(id){let idx=dataset.blocked.findIndex(r=>r.id===id);if(idx!==-1){dataset.blocked.splice(idx,1);renderList();}}

// Random Chat
let rcInterests=JSON.parse(localStorage.getItem('rcInterests')||'[]'), rcChatFilter=localStorage.getItem('rcChatFilter')||'all', rcOnlineInterval=null, rcLoadingMsgInterval=null, myId='rc_'+Math.random().toString(36).slice(2,9);
const rcLoadingMessages=["Finding someone new...","Matching interests...","Almost there...","Connecting..."];
function initRealtimePresence(){
 try{
  const STORAGE_KEY='rc_real_presence_v2'; const channel=new BroadcastChannel('rc_presence');
  function getList(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return {}}}
  function saveList(obj){localStorage.setItem(STORAGE_KEY,JSON.stringify(obj));}
  function cleanOld(list){const now=Date.now(); for(let k in list){ if(now-list[k].ts>20000) delete list[k]; } return list;}
  function renderOnlineCount(n){const el=document.getElementById('rcOnlineCount'); if(el) el.textContent=n; const box=document.getElementById('rcOnlineBox'); if(box){ const dot=box.querySelector('.rc-dot'); if(n===0){box.style.opacity='.6';} else {box.style.opacity='1';} } }
  function heartbeat(){let list=cleanOld(getList()); list[myId]={ts:Date.now()}; saveList(list); renderOnlineCount(Object.keys(list).length); try{channel.postMessage({type:'heartbeat',id:myId,ts:Date.now()});}catch{}}
  heartbeat(); rcOnlineInterval=setInterval(heartbeat,4000);
  channel.onmessage=(e)=>{let list=cleanOld(getList()); if(e.data?.id){ if(e.data.type==='leave'){delete list[e.data.id];} else {list[e.data.id]={ts:e.data.ts||Date.now()};} saveList(list);} renderOnlineCount(Object.keys(list).length); };
  window.addEventListener('storage',(e)=>{ if(e.key===STORAGE_KEY){ let list=cleanOld(getList()); renderOnlineCount(Object.keys(list).length);} });
  window.addEventListener('beforeunload',()=>{ let list=getList(); delete list[myId]; saveList(list); try{channel.postMessage({type:'leave',id:myId});}catch{} });
  window._presenceChannel=channel;
 }catch{}
}
function renderOnlineCount(n){const el=document.getElementById('rcOnlineCount'); if(el) el.textContent=n;}
function startRandomChat(){const overlay=document.getElementById('rcLoadingOverlay'), btn=document.getElementById('rcStartBtn'), textEl=document.getElementById('rcLoadingText'); if(!overlay) return; overlay.classList.add('active'); if(btn){btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';} let msgIdx=0; if(textEl) textEl.textContent=rcLoadingMessages[0]; rcLoadingMsgInterval=setInterval(()=>{msgIdx=(msgIdx+1)%rcLoadingMessages.length; if(textEl) textEl.textContent=rcLoadingMessages[msgIdx];},1200); setTimeout(()=>{if(overlay.classList.contains('active')){clearInterval(rcLoadingMsgInterval); alert('🎉 Found someone new!\nInterests: '+(rcInterests.join(', ')||'Any')+'\nFilter: '+rcChatFilter); cancelRandomSearch();}},3200);}
function cancelRandomSearch(){const overlay=document.getElementById('rcLoadingOverlay'), btn=document.getElementById('rcStartBtn'); if(overlay) overlay.classList.remove('active'); if(btn){btn.disabled=false; btn.innerHTML='<i class="fa-solid fa-shuffle"></i> Find Someone New';} if(rcLoadingMsgInterval){clearInterval(rcLoadingMsgInterval); rcLoadingMsgInterval=null;}}
function toggleInterestSection(){const toggle=document.getElementById('rcInterestToggle'), sec=document.getElementById('rcInterestSection'); if(!toggle||!sec) return; sec.style.display=toggle.checked?'block':'none'; localStorage.setItem('rcInterestEnabled',toggle.checked);}
function addInterest(){const input=document.getElementById('rcInterestInput'); if(!input) return; const val=input.value.trim().toLowerCase(); if(!val) return; if(rcInterests.includes(val)){input.value='';return;} if(rcInterests.length>=12){alert('Max 12 interests');return;} rcInterests.push(val); localStorage.setItem('rcInterests',JSON.stringify(rcInterests)); input.value=''; renderInterestChips();}
function removeInterest(idx){rcInterests.splice(idx,1); localStorage.setItem('rcInterests',JSON.stringify(rcInterests)); renderInterestChips();}
function renderInterestChips(){const container=document.getElementById('rcChips'); if(!container) return; container.innerHTML=''; rcInterests.forEach((interest,i)=>{const chip=document.createElement('div'); chip.className='rc-chip'; chip.innerHTML=`${interest} <i class="fa-solid fa-xmark" onclick="removeInterest(${i})" style="cursor:pointer;"></i>`; container.appendChild(chip);});}
function setChatFilter(type,silent){rcChatFilter=type; localStorage.setItem('rcChatFilter',type); const vBtn=document.getElementById('rcFilterVerified'), aBtn=document.getElementById('rcFilterAll'); if(vBtn) vBtn.classList.remove('selected'); if(aBtn) aBtn.classList.remove('selected'); if(type==='verified'&&vBtn) vBtn.classList.add('selected'); if(type==='all'&&aBtn) aBtn.classList.add('selected');}
function saveRandomPrefs(){localStorage.setItem('rcInterests',JSON.stringify(rcInterests)); localStorage.setItem('rcChatFilter',rcChatFilter); const toast=document.createElement('div'); toast.textContent='Preferences saved!'; toast.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:10px 18px;border-radius:999px;font-size:12px;font-weight:700;z-index:5000;'; document.body.appendChild(toast); setTimeout(()=>toast.remove(),2000);}

// Support
let supportMessages=JSON.parse(localStorage.getItem('supportChatMessages')||'[]'), isTeamMode=localStorage.getItem('isTeamMode')==='true', selectedSupportCategory=null;
function renderSupportMessages(){
 const container=document.getElementById('supportMessages'), empty=document.getElementById('supportEmpty'); if(!container) return;
 if(supportMessages.length===0){ if(empty) empty.style.display='flex'; container.innerHTML=''; return; }
 if(empty) empty.style.display='none'; container.innerHTML='';
 supportMessages.forEach(msg=>{
  const row=document.createElement('div'); row.className='support-msg-row '+(msg.sender==='me'?'me':'');
  let avatarClass='me', nameClass='me', nameText='You', bubbleClass='user', avatarIcon='<i class="fa-solid fa-user"></i>';
  if(msg.sender==='bot'){avatarClass='bot';nameClass='bot';nameText='Support Bot';bubbleClass='bot';avatarIcon='<i class="fa-solid fa-robot"></i>'; if(isTeamMode){nameText='Support_Team!';avatarClass='team';nameClass='team';}}
  else if(msg.sender==='team'){avatarClass='team';nameClass='team';nameText='Support_Team!';bubbleClass='team';avatarIcon='<i class="fa-solid fa-headset"></i>';}
  row.innerHTML=`<div class="support-msg-avatar ${avatarClass}">${avatarIcon}</div><div class="support-msg-content"><div class="support-msg-name ${nameClass}">${nameText} ${msg.sender==='team'?'<span class="support-tag team-tag">HUMAN</span>':''}</div><div class="support-bubble ${bubbleClass}">${escapeHtml(msg.text)}</div><div class="support-time">${msg.time}</div></div>`;
  container.appendChild(row);
 });
 container.scrollTop=container.scrollHeight;
}
function sendSupportMessage(optionalText){
 const input=document.getElementById('supportInput'); let txt=optionalText||(input?input.value.trim():''); if(!txt) return; if(input) input.value=''; closeSupportPopups();
 const userMsg={sender:'me',text:txt,time:getTimeStr()}; supportMessages.push(userMsg); localStorage.setItem('supportChatMessages',JSON.stringify(supportMessages)); renderSupportMessages(); showSupportTyping();
 setTimeout(()=>{hideSupportTyping(); const botReply={sender:'bot',text:getAutoReply(txt),time:getTimeStr()}; supportMessages.push(botReply); localStorage.setItem('supportChatMessages',JSON.stringify(supportMessages)); renderSupportMessages();},900);
}
function getAutoReply(q){q=q.toLowerCase(); if(q.includes('hello')||q.includes('hi')||q.includes('hey')) return 'Hello! Welcome To Support & Help. How Can I Assist You Today?'; return 'Your Message Submitted! Our Support Team Will Respond And Resolve Your Issue Within 24 Hours.';}
function showSupportTyping(){const container=document.getElementById('supportMessages'); if(!container) return; hideSupportTyping(); const typing=document.createElement('div'); typing.id='supportTypingIndicator'; typing.className='support-typing'; let typingName=isTeamMode?'Support_Team! Is Typing':'Support Bot Is Typing'; typing.innerHTML=`<div class="support-msg-avatar ${isTeamMode?'team':'bot'}" style="width:28px;height:28px;font-size:11px;"><i class="fa-solid ${isTeamMode?'fa-headset':'fa-robot'}"></i></div> ${typingName}`; container.appendChild(typing); container.scrollTop=container.scrollHeight;}
function hideSupportTyping(){const t=document.getElementById('supportTypingIndicator'); if(t) t.remove();}
function supportTeamReply(replyText){isTeamMode=true; const headerText=document.getElementById('headerStatusText'), onlineDot=document.getElementById('onlineDot'), avatar=document.getElementById('supportAvatar'); if(headerText) headerText.textContent='Support Team Online'; if(onlineDot) onlineDot.classList.add('team-dot'); if(avatar) avatar.classList.add('team-mode'); hideSupportTyping(); const teamMsg={sender:'team',text:replyText,time:getTimeStr()}; supportMessages.push(teamMsg); localStorage.setItem('supportChatMessages',JSON.stringify(supportMessages)); renderSupportMessages(); localStorage.setItem('isTeamMode','true');}
function toggleSupportPlusPopup(e){e.stopPropagation();const popup=document.getElementById('supportPlusPopup'),overlay=document.getElementById('supportInputOverlay');const emojiPicker=document.getElementById('supportEmojiPicker');if(emojiPicker) emojiPicker.classList.remove('active');if(popup) popup.classList.toggle('active');if(overlay) overlay.classList.toggle('active',popup.classList.contains('active'));}
function closeSupportPopups(){const popup=document.getElementById('supportPlusPopup'),picker=document.getElementById('supportEmojiPicker'),overlay=document.getElementById('supportInputOverlay');if(popup) popup.classList.remove('active');if(picker) picker.classList.remove('active');if(overlay) overlay.classList.remove('active');}
function handleSupportPlusAction(type){closeSupportPopups(); if(type==='image'){const fileInput=document.createElement('input');fileInput.type='file';fileInput.accept='image/*';fileInput.onchange=(ev)=>{const file=ev.target.files[0];if(file) sendSupportMessage(`[Image: ${file.name}]`);};fileInput.click();}}
function selectCategory(el){document.querySelectorAll('.cat-option').forEach(o=>o.classList.remove('selected'));el.classList.add('selected');selectedSupportCategory=el.getAttribute('data-value');document.getElementById('catContinueBtn').classList.add('active');}
function continueToSupport(){if(!selectedSupportCategory) return;localStorage.setItem('selectedSupportCategory',selectedSupportCategory);const modal=document.getElementById('supportCategoryModal');modal.style.opacity='0';modal.style.transform='scale(0.95)';modal.style.transition='all 0.25s ease';setTimeout(()=>{modal.style.display='none';const emptyDesc=document.getElementById('emptyDesc');if(emptyDesc){emptyDesc.innerHTML=`Our Support Team Will Respond Within 24 Hours.<br><small style="margin-top:8px;display:inline-block;background:#DBEAFE;color:#2563EB;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700;">${selectedSupportCategory}</small>`;}},250);}

// Settings
function setPmMode(mode,silent){localStorage.setItem('pmMode',mode);document.querySelectorAll('#view-settings .set-radio').forEach(r=>{if(r.id.startsWith('pm')) r.classList.remove('selected');}); if(mode==='everyone'){document.getElementById('pmEveryone')?.classList.add('selected');} else {document.getElementById('pmFriends')?.classList.add('selected');}}
function handleVisibility(mode,el){
 const isChecked=el.checked; const toggleVisible=document.getElementById('toggleVisible'), toggleInvisible=document.getElementById('toggleInvisible');
 if(mode==='visible'){ if(isChecked){toggleInvisible.checked=false; localStorage.setItem('visibilityMode','visible'); localStorage.removeItem('invisibleSince'); localStorage.removeItem('fakeLastSeen'); localStorage.setItem('userOnlineStatus','online');} else {if(!toggleInvisible.checked){localStorage.setItem('visibilityMode','none'); localStorage.setItem('userOnlineStatus','offline');}}}
 else if(mode==='invisible'){ if(isChecked){toggleVisible.checked=false; localStorage.setItem('visibilityMode','invisible'); localStorage.setItem('invisibleSince',Date.now().toString()); const fourMonthsAgo=Date.now()-(120*24*60*60*1000); localStorage.setItem('fakeLastSeen',fourMonthsAgo.toString()); localStorage.setItem('fakeLastSeenText','4 months ago'); localStorage.setItem('userOnlineStatus','invisible');} else {if(!toggleVisible.checked){localStorage.setItem('visibilityMode','none'); localStorage.setItem('userOnlineStatus','offline');} else {localStorage.setItem('visibilityMode','visible'); localStorage.setItem('userOnlineStatus','online');} localStorage.removeItem('invisibleSince');}}
 updateVisibilityUI();
}
function updateVisibilityUI(){const visibleOn=document.getElementById('toggleVisible')?.checked, invisibleOn=document.getElementById('toggleInvisible')?.checked, vIcon=document.getElementById('visibleIcon'), iIcon=document.getElementById('invisibleIcon'); if(vIcon){vIcon.style.color=visibleOn?'#22c55e':'#94a3b8';} if(iIcon){iIcon.style.color=invisibleOn?'#7c3aed':'#94a3b8';}}
function toggleSetting(el,type){const val=el.checked; if(type==='readReceipt') localStorage.setItem('readReceipt',val); else if(type==='mention') localStorage.setItem('mentionAlert',val); else if(type==='allSounds'){localStorage.setItem('allSounds',val); localStorage.setItem('silenceMode',!val); updateSoundsUI();} else if(type==='msgSound') localStorage.setItem('msgSound',val);}
function updateSoundsUI(){const allOn=document.getElementById('toggleAllSounds')?.checked, icon=document.getElementById('allSoundsIcon'); if(!icon) return; if(allOn){icon.className='fa-solid fa-volume-high'; icon.style.color='#3b82f6';} else {icon.className='fa-solid fa-volume-xmark'; icon.style.color='#ef4444';}}
function initSettings(){
 const pm=localStorage.getItem('pmMode')||'everyone'; setPmMode(pm,true);
 const rr=localStorage.getItem('readReceipt'); if(rr!==null) {const el=document.getElementById('toggleReadReceipt'); if(el) el.checked=rr==='true';}
 const visMode=localStorage.getItem('visibilityMode')||'visible'; const tVis=document.getElementById('toggleVisible'), tInv=document.getElementById('toggleInvisible'); if(visMode==='visible'){if(tVis) tVis.checked=true; if(tInv) tInv.checked=false;} else if(visMode==='invisible'){if(tVis) tVis.checked=false; if(tInv) tInv.checked=true;} else {if(tVis) tVis.checked=false; if(tInv) tInv.checked=false;}
 const allS=localStorage.getItem('allSounds'), oldSilence=localStorage.getItem('silenceMode'); if(allS!==null){const el=document.getElementById('toggleAllSounds'); if(el) el.checked=allS==='true';} else if(oldSilence!==null){const el=document.getElementById('toggleAllSounds'); if(el) el.checked=oldSilence!=='true';}
 const msgS=localStorage.getItem('msgSound'); if(msgS!==null){const el=document.getElementById('toggleMsgSound'); if(el) el.checked=msgS==='true';}
 updateSoundsUI(); updateVisibilityUI();
}

// Profile
let profilePicData=localStorage.getItem('profilePicData')||null;
function triggerProfilePicChange(){const inp=document.getElementById('profilePicInput'); if(inp) inp.click();}
function handleProfilePicSelect(e){const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=function(ev){profilePicData=ev.target.result; localStorage.setItem('profilePicData',profilePicData); const av=document.getElementById('profilePicAvatar'); if(av){av.style.backgroundImage=`url(${profilePicData})`; av.classList.add('has-image');} const sideAv=document.getElementById('sideAvatar'); if(sideAv){sideAv.style.backgroundImage=`url(${profilePicData})`; sideAv.textContent='';}}; reader.readAsDataURL(file);}
function deleteProfilePic(){if(!confirm('Delete profile picture?')) return; profilePicData=null; localStorage.removeItem('profilePicData'); const av=document.getElementById('profilePicAvatar'); if(av){av.style.backgroundImage=''; av.classList.remove('has-image');} const inp=document.getElementById('profilePicInput'); if(inp) inp.value='';}
function saveProfileData(){
 const btn=document.getElementById('profileSaveBtn'); const data={bio:document.getElementById('pfBio')?.value||'',location:document.getElementById('pfLocation')?.value||'',gender:document.getElementById('pfGender')?.value||'',age:document.getElementById('pfAge')?.value||'',language:document.getElementById('pfLanguage')?.value||'',name:document.getElementById('pfName')?.value||''}; localStorage.setItem('profileData',JSON.stringify(data)); if(data.name){localStorage.setItem('userFullName',data.name); updateSideProfile();}
 if(btn){btn.classList.add('saved'); const orig=btn.innerHTML; btn.innerHTML='<i class="fa-solid fa-check"></i> Saved'; setTimeout(()=>{btn.classList.remove('saved'); btn.innerHTML=orig;},2000);}
}
function initProfile(){
 const saved=JSON.parse(localStorage.getItem('profileData')||'{}');
 if(saved.bio){const el=document.getElementById('pfBio'); if(el) el.value=saved.bio;}
 if(saved.location){const el=document.getElementById('pfLocation'); if(el) el.value=saved.location;}
 if(saved.gender){const el=document.getElementById('pfGender'); if(el) el.value=saved.gender;}
 if(saved.age){const el=document.getElementById('pfAge'); if(el) el.value=saved.age;}
 if(saved.language){const el=document.getElementById('pfLanguage'); if(el) el.value=saved.language;}
 if(saved.name){const el=document.getElementById('pfName'); if(el) el.value=saved.name;}
 if(profilePicData){const av=document.getElementById('profilePicAvatar'); if(av){av.style.backgroundImage=`url(${profilePicData})`; av.classList.add('has-image');}}
}

// Deactivate / Delete
let deactInterval=null, delInterval=null;
function deactivateAccount(){const ov=document.getElementById('deactivateOverlay'); if(!ov) return; ov.classList.add('active'); startDeactivateTimer();}
function closeDeactivatePopup(){const ov=document.getElementById('deactivateOverlay'); if(ov) ov.classList.remove('active'); clearInterval(deactInterval); resetDeactBtn();}
function startDeactivateTimer(){let sec=15; const textEl=document.getElementById('deactTimerText'), btn=document.getElementById('deactConfirmBtn'); if(!textEl||!btn) return; btn.classList.remove('enabled'); textEl.textContent=`Please wait ${sec}s to confirm`; clearInterval(deactInterval); deactInterval=setInterval(()=>{sec--; if(textEl) textEl.textContent=sec>0?`Please wait ${sec}s to confirm`:'You can now confirm'; if(sec<=0){clearInterval(deactInterval); btn.classList.add('enabled'); if(textEl) textEl.textContent='Ready to confirm';}},1000);}
function resetDeactBtn(){const btn=document.getElementById('deactConfirmBtn'); if(btn) btn.classList.remove('enabled');}
function confirmDeactivateAction(){const btn=document.getElementById('deactConfirmBtn'); if(!btn.classList.contains('enabled')) return; alert('Your account has been deactivated. You can restore it anytime by logging back in.'); closeDeactivatePopup();}
function deleteAccount(){const ov=document.getElementById('deleteOverlay'); if(!ov) return; ov.classList.add('active'); startDeleteTimer();}
function closeDeletePopup(){const ov=document.getElementById('deleteOverlay'); if(ov) ov.classList.remove('active'); clearInterval(delInterval); resetDelBtn();}
function startDeleteTimer(){let sec=15; const textEl=document.getElementById('delTimerText'), btn=document.getElementById('delConfirmBtn'); if(!textEl||!btn) return; btn.classList.remove('enabled'); textEl.textContent=`Please wait ${sec}s to confirm`; clearInterval(delInterval); delInterval=setInterval(()=>{sec--; if(textEl) textEl.textContent=sec>0?`Please wait ${sec}s to confirm`:'You can now confirm'; if(sec<=0){clearInterval(delInterval); btn.classList.add('enabled'); if(textEl) textEl.textContent='Ready to confirm - this is permanent after 20 days';}},1000);}
function resetDelBtn(){const btn=document.getElementById('delConfirmBtn'); if(btn) btn.classList.remove('enabled');}
function confirmDeleteAction(){const btn=document.getElementById('delConfirmBtn'); if(!btn.classList.contains('enabled')) return; alert('Delete request submitted. You can restore within 15 days by logging in. After 20 days it will be permanently deleted.'); closeDeletePopup();}
function logout(){if(confirm('Logout?')){localStorage.removeItem('isLoggedIn'); showPage('page-auth');}}

// Init on load
document.addEventListener('DOMContentLoaded',()=>{
 const s=localStorage.getItem('currentLoggedInUser'); if(s) {const el=document.getElementById('email'); if(el) el.value=s;}
 initFeaturePage(); initSettings(); initProfile(); renderGroups(); renderLists(); renderList(); renderInterestChips(); renderSupportMessages();
 const modal=document.getElementById('forgotModal'); if(modal) modal.addEventListener('click',(e)=>{if(e.target.id==='forgotModal') closeForgot();});
 // Check login
 if(localStorage.getItem('isLoggedIn')==='true' && localStorage.getItem('selectedFeature')){ showPage('page-dashboard'); initDashboard(); } else if(localStorage.getItem('isLoggedIn')==='true'){ showPage('page-feature'); } 
 const deactOv=document.getElementById('deactivateOverlay'), delOv=document.getElementById('deleteOverlay'); if(deactOv) deactOv.addEventListener('click',(e)=>{if(e.target.id==='deactivateOverlay') closeDeactivatePopup();}); if(delOv) delOv.addEventListener('click',(e)=>{if(e.target.id==='deleteOverlay') closeDeletePopup();});
});
</script>
<style>
@keyframes progress{from{width:0%} to{width:100%}}
</style>