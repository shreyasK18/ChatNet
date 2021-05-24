const socket = io();
const chatForm =document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const sidebar=document.getElementById('sidebar');
const chatBody=document.getElementById('chat-body');
const arrow=document.getElementById('arrow');
const arrowContainer=document.getElementById('toggle');
let toggle=true;

  
function closeSideBar(){
    arrowContainer.className="sidebar-arrow";
    sidebar.className="chat-sidebar-hide";
    chatBody.className="chat-main-sidebar-hide";
    arrow.className="fas fa-arrow-right";
    
}
function openSideBar(){
    arrowContainer.className="sidebar-arrow-open";
    sidebar.className="chat-sidebar";
    chatBody.className="chat-main";
    arrow.className="fas fa-arrow-left";
    
}

function toggleSideBar(){
    if(toggle==true){
        closeSideBar();
        toggle=false;
    } else {
        openSideBar();
        toggle=true;
    }
}
// Get Username and group from url

const {username,group}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
});



socket.emit('joinGroup',{username,group});
// Message from server
socket.on('message',message=>{
    
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
socket.on('botMessage',message=>{
    console.log("Bot Message");
    botMessage(message);

    // Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
socket.on('groupUsers',({group,users})=>{
    
     setGroupName(group);
    getGroupUsers(users);
});
// Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // Get text message
    const msg=e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage',msg);
    
    // Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
    
});

// Output message to DOM
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta"><span style='color:${message.color}'>${message.username}</span> <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output Group Users details
function getGroupUsers(users){
    const usersNode=document.getElementById('users');
    while (usersNode.hasChildNodes()) {
        usersNode.removeChild(usersNode.lastChild);
    }
    users.map(user=>{
        const li=document.createElement('li');
        li.innerText=user.username;
        usersNode.appendChild(li);
    })
   
   
}

// Set up group details
function setGroupName(group){
    const div=document.getElementById('group-name');
    div.innerText=group;
}

// display bot Message
function botMessage(message){
    const div=document.createElement('div');
    
    div.innerHTML=`<p class="bot-message">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveGroup = confirm('Are you sure you want to leave the chatgroup?');
    if (leaveGroup) {
      window.location = '../index.html';
    } else {
    }
  });
