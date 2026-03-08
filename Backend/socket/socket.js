module.exports = function (io) {

  io.on("connection", (socket) => {

    // send message
    socket.on("send_message", (data) => {

      // send to all other connected clients
      socket.broadcast.emit("receive_message", data);

    });

    // typing indicator
    socket.on("typing", (data) => {

      socket.broadcast.emit("typing", data);

    });

    socket.on("stop_typing", () => {

      socket.broadcast.emit("stop_typing");

    });

    // optional: message seen event
    socket.on("message_seen", (data) => {

      socket.broadcast.emit("message_seen", data);

    });

  });

};