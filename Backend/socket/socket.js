const onlineUsers = new Map();

module.exports = function(io){

  io.on("connection",(socket)=>{

    socket.on("user_online",(userId)=>{

      if(!onlineUsers.has(userId)){
        onlineUsers.set(userId,new Set());
      }

      onlineUsers.get(userId).add(socket.id);

      io.emit("online_users",Array.from(onlineUsers.keys()));

    });

    socket.on("send_message",(data)=>{

      const receiverSockets = onlineUsers.get(data.receiverId);

      if(receiverSockets){

        receiverSockets.forEach(socketId=>{
          io.to(socketId).emit("receive_message",data);
        });

      }

    });

    socket.on("typing",(data)=>{

      const receiverSockets = onlineUsers.get(data.receiverId);

      if(receiverSockets){

        receiverSockets.forEach(socketId=>{
          io.to(socketId).emit("typing",data);
        });

      }

    });

    socket.on("stop_typing",(data)=>{

      const receiverSockets = onlineUsers.get(data.receiverId);

      if(receiverSockets){

        receiverSockets.forEach(socketId=>{
          io.to(socketId).emit("stop_typing",data);
        });

      }

    });

    socket.on("message_seen",(data)=>{

      const senderSockets = onlineUsers.get(data.senderId);

      if(senderSockets){

        senderSockets.forEach(socketId=>{
          io.to(socketId).emit("message_seen",data);
        });

      }

    });

    socket.on("disconnect",()=>{

      for(const [userId,sockets] of onlineUsers.entries()){

        if(sockets.has(socket.id)){

          sockets.delete(socket.id);

          if(sockets.size === 0){
            onlineUsers.delete(userId);
          }

          break;

        }

      }

      io.emit("online_users",Array.from(onlineUsers.keys()));

    });

  });

  socket.on("user_offline", (userId) => {

  const sockets = onlineUsers.get(userId);

  if (sockets) {
    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(userId);
    }
  }

  io.emit("online_users", Array.from(onlineUsers.keys()));

});

}