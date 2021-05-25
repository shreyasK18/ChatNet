const express=require('express');
const path=require('path');
const http=require('http');
const fs=require('fs');
const app=express();

const socketio=require('socket.io');
const formatMessage =require('./utils/messages');
const { userJoin,getCurrentUser,userLeave,getGroupUsers} =require('./utils/users');


const PORT= 3000 || process.env.PORT;

const botName="ChatNet Bot";
const server=http.createServer(app);
const io=socketio(server);
// Static Folder
app.use(express.static(path.join(__dirname,'public')));

// Run When IO Connects
io.on('connection', socket =>{
    // On Join Group
   
    socket.on('joinGroup',({username,group})=>{
   
    
        const user=userJoin(socket.id,username,group);
        // join the user to group
        socket.join(user.group);
         // Welcome current user
        socket.emit('botMessage',formatMessage(botName,"Welcome to ChatNet!"));

        // Brodcast when a user joins 
        // send a message to everyone except the current user
        socket.broadcast.to(user.group).emit('botMessage',formatMessage(botName,`${user.username} has joined the chat`));

        // send group details
        io.to(user.group).emit('groupUsers',{
            group:user.group,
            users:getGroupUsers(user.group)
        })
    

    });
   
    // Runs when client disconnects
    socket.on('disconnect', () => {
        let user=userLeave(socket.id);
        if(user){
            io.to(user.group).emit('botMessage', formatMessage(botName,`${user.username} has left the chat`));
            // send group details
            io.to(user.group).emit('groupUsers',{
                 group:user.group,
                 users:getGroupUsers(user.group)
            })
    

        }

    });

    // Listen for chatMessage
    socket.on('chatMessage',msg =>{
        let user=getCurrentUser(socket.id);
        io.to(user.group).emit('message',formatMessage(user.username,msg,user.color));
    });
});

// if(process.env.NODE_ENV === 'production'){
//     app.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'index.html'));
//     });
// }
// server.listen(3000 || process.env.port, function(){
//     console.log(`Server running on port 3000`);
// });
app.get('/',(req,res)=>{
            res.sendFile(path.resolve(__dirname,'public/index.html'));
        });