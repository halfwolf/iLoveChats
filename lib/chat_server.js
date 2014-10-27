createChat = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    var guest = addGuest(socket);
    io.emit('this', { name: "Host", message: nicknames[socket.id] + " has connected" });

    socket.on("message", function(msg) {
     io.emit("this", {name: nicknames[socket.id], message: msg})
    })

    socket.on('nicknameChangeRequest', function(name) {
      if (addNickname(name, socket.id)) {
        socket.emit('nicknameChangeResult', {
          success: true,
          message: "Nickname changed!"
        })
      } else {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: "Names cannot begin with guest"
        })
      }
    })

    socket.on('disconnect', function() {
      var name = nicknames[socket.id]
      removeNickname(socket.id);
      io.emit('this', { name: "Host", message: name + " has left the room"})
    });

  });

}

var guestnumber = 0

var nicknames = {}

var addGuest = function(socket) {
  guestnumber += 1
  nicknames[socket.id] = "Guest" + guestnumber
}

var addNickname = function(name, id) {
  if (name.slice(0,5).toLowerCase() === "guest" || existingName(name)) {
    return false
  } else {
    nicknames[id] = name
    return true
  }
}

var existingName = function(name) {
  var exists = false
  for (var i in nicknames) {
    if (nicknames[i] === name) { exists = true }
  }
  return exists
}

var removeNickname = function(id) {
  delete nicknames[id];
}



