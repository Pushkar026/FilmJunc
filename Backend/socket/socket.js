const onlineUsers = new Map();

module.exports = function(io){

  io.on("connection",(socket)=>{

    //console.log("User connected:",socket.id);

    socket.on("user_online",(userId)=>{

      onlineUsers.set(userId,socket.id);

      io.emit("online_users",Array.from(onlineUsers.keys()));

    });

    socket.on("send_message",(data)=>{

      const receiverSocket = onlineUsers.get(data.receiverId);

      if(receiverSocket){

        io.to(receiverSocket).emit("receive_message",data);

      }

    });

    socket.on("typing",(data)=>{

      const receiverSocket = onlineUsers.get(data.receiverId);

      if(receiverSocket){

        io.to(receiverSocket).emit("typing",data);

      }

    });

    socket.on("stop_typing",(data)=>{

      const receiverSocket = onlineUsers.get(data.receiverId);

      if(receiverSocket){

        io.to(receiverSocket).emit("stop_typing",data);

      }

    });

    socket.on("message_seen",(data)=>{

      const senderSocket = onlineUsers.get(data.senderId);

      if(senderSocket){

        io.to(senderSocket).emit("message_seen",data);

      }

    });

    socket.on("disconnect",()=>{

      for(let [userId,socketId] of onlineUsers.entries()){

        if(socketId===socket.id){

          onlineUsers.delete(userId);
          break;

        }

      }

      io.emit("online_users",Array.from(onlineUsers.keys()));

      //console.log("User disconnected:",socket.id);

    });

  });

}