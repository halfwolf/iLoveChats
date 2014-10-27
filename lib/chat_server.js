createChat = function(server) {
  var io = require('socket.io')(server);
  io.on('connection', function(socket) {
    socket.emit('reply', { message: console.log("connected started") });
    socket.on("message", function(data) {
      console.log(data);
    })
  });
}

