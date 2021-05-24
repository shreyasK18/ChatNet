const axios=require('axios');


const users=[];

// Join user to chat
function userJoin(id,username,group){
    const color=getRandomColor();
    const user={id,username,group,color};
  
    users.push(user);
    return user;
}

// get the current user
function getCurrentUser(id){
    return users.find(user=>user.id===id);
}

// On User Leave
function userLeave(id){
    const index=users.findIndex(user=>user.id===id);
    if(index!==-1){
       return users.splice(index,1)[0];
    }
    
    
}

// get Group Users

function getGroupUsers(group){
    const newUsers= users.filter(user=> user.group === group);
    return newUsers;
    
}

// get Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getGroupUsers,
}