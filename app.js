
const CONTACTS = [
  { id:'1', name:'Ali Hamza', avatar:'AH', color:'#7C3AED', last:'Bhai dashboard ready hai?', time:'09:41 AM', online:true, unread:2, role:'UI Designer' },
  { id:'2', name:'Ayesha Khan', avatar:'AK', color:'#EC4899', last:'Meeting kal 10 baje?', time:'09:12 AM', online:true, unread:0, role:'Product Manager' },
  { id:'3', name:'Dev Team', avatar:'DT', color:'#06B6D4', last:'Push ho gaya staging pe', time:'Yesterday', online:false, unread:4, role:'Team' },
  { id:'4', name:'Sara Ahmed', avatar:'SA', color:'#F59E0B', last:'Design files check kar lena', time:'Yesterday', online:true, unread:0, role:'UX Researcher' },
  { id:'5', name:'Bilal', avatar:'B', color:'#10B981', last:'Thanks yar!', time:'Monday', online:false, unread:0, role:'Backend Dev' },
];
const REPLIES = ["Haan bilkul, check karta hun 👍","Perfect! Bas 5 min me send karta hun","Samajh gaya, ho jayega","Nice! Look premium lag raha hai 🔥","Kal meeting me discuss karte hain","Ok done, deploy kar diya","Haha sahi keh rahe ho 😅","Files share kar di hain"];
const EMOJIS = ["😊","🔥","👍","❤️","😂","🙏","👏","✨","💯","🚀","😅","🤔","👌","🎉","😎"];

let activeId = '1';
let messages = {
  '1': [{text:'Assalamu Alaikum! Login page ka kya scene hai?', sent:false, time:'09:30 AM'},{text:'Walaikum Assalam! Final touches kar raha hun', sent:true, time:'09:31 AM'},{text:'Bhai dashboard ready hai?', sent:false, time:'09:41 AM'}],
  '2': [{text:'Hi! Client call kal 10 baje confirm hai', sent:false, time:'08:50 AM'}],
  '3': [{text:'Push ho gaya staging pe', sent:false, time:'Yesterday'}],
  '4': [{text:'Figma file updated', sent:false, time:'Yesterday'}],
  '5': [{text:'Thanks yar!', sent:false, time:'Monday'}],
};

// DOM
const loginView = document.getElementById('login-view');
const dashView = document.getElementById('dashboard-view');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const errorEl = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');

// Toggle pass
document.getElementById('toggle-pass').onclick = () => {
  passEl.type = passEl.type === 'password' ? 'text' : 'password';
};

// Login logic
function doLogin(){
  errorEl.textContent = '';
  if(!emailEl.value.includes('@')){ errorEl.textContent = 'Email must contain @'; return; }
  if(passEl.value.length < 6){ errorEl.textContent = 'Password min 6 chars'; return; }
  if(passEl.value !== '123456'){ errorEl.textContent = 'Hint: password is 123456'; return; }
  btnText.textContent = 'Logging in...';
  btnLoader.classList.remove('hidden');
  loginBtn.disabled = true;
  setTimeout(()=>{
    loginView.classList.remove('active');
    dashView.classList.add('active');
    renderContacts();
    selectContact(activeId);
    btnText.textContent = 'Login';
    btnLoader.classList.add('hidden');
    loginBtn.disabled = false;
  }, 1000);
}
loginBtn.onclick = doLogin;
passEl.addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });

document.getElementById('logout-btn').onclick = () => {
  dashView.classList.remove('active');
  loginView.classList.add('active');
  emailEl.value=''; passEl.value='';
};

// Contacts render
function renderContacts(filter=''){
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  CONTACTS.filter(c=>c.name.toLowerCase().includes(filter.toLowerCase())).forEach(c=>{
    const div = document.createElement('div');
    div.className = 'contact-item' + (c.id===activeId ? ' active':'');
    div.innerHTML = `<div class="avatar" style="background:${c.color}">${c.avatar}</div>
      <div class="contact-meta"><div class="name"><span>${c.name} ${c.online?'<span class=online-dot></span>':''}</span><span style="font-size:11px;color:rgba(255,255,255,0.4)">${c.time}</span></div>
      <div class="last">${c.last} ${c.unread?`<span class=unread>${c.unread}</span>`:''}</div></div>`;
    div.onclick = ()=>{ selectContact(c.id); if(window.innerWidth<=768) document.getElementById('sidebar').classList.remove('open'); };
    list.appendChild(div);
  });
}

function selectContact(id){
  activeId = id;
  const c = CONTACTS.find(x=>x.id===id);
  document.getElementById('active-avatar').textContent = c.avatar;
  document.getElementById('active-avatar').style.background = c.color;
  document.getElementById('active-name').textContent = c.name;
  document.getElementById('active-status').textContent = c.role + (c.online ? ' • Online' : ' • Offline');
  renderContacts(document.getElementById('search').value);
  renderMessages();
}

function renderMessages(){
  const box = document.getElementById('messages');
  box.innerHTML = '';
  (messages[activeId]||[]).forEach(m=>{
    const row = document.createElement('div');
    row.className = 'msg-row ' + (m.sent ? 'sent':'received');
    row.innerHTML = `<div class="bubble">${m.text}<div class="time">${m.time}</div></div>`;
    box.appendChild(row);
  });
  box.scrollTop = box.scrollHeight;
}

// Search
document.getElementById('search').addEventListener('input', e=> renderContacts(e.target.value));

// Send
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');

function sendMessage(){
  const txt = msgInput.value.trim();
  if(!txt) return;
  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  if(!messages[activeId]) messages[activeId]=[];
  messages[activeId].push({text:txt, sent:true, time});
  msgInput.value='';
  renderMessages();
  // typing + auto reply
  const box = document.getElementById('messages');
  const typing = document.createElement('div');
  typing.className = 'msg-row received';
  typing.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  box.appendChild(typing);
  box.scrollTop = box.scrollHeight;
  setTimeout(()=>{
    typing.remove();
    const reply = REPLIES[Math.floor(Math.random()*REPLIES.length)];
    messages[activeId].push({text:reply, sent:false, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})});
    renderMessages();
  }, 1000 + Math.random()*800);
}
sendBtn.onclick = sendMessage;
msgInput.addEventListener('keydown', e=>{ if(e.key==='Enter') sendMessage(); });

// Emoji picker
const emojiBtn = document.getElementById('emoji-btn');
const picker = document.getElementById('emoji-picker');
EMOJIS.forEach(e=>{
  const b = document.createElement('button');
  b.textContent = e;
  b.onclick = ()=>{ msgInput.value += e; picker.classList.add('hidden'); msgInput.focus(); };
  picker.appendChild(b);
});
emojiBtn.onclick = ()=> picker.classList.toggle('hidden');

// Mobile menu
document.getElementById('menu-btn').onclick = ()=> document.getElementById('sidebar').classList.toggle('open');
