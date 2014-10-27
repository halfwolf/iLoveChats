createChat = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    socket.join('lobby')
    var guest = addGuest(socket);
    io.to('lobby').emit('this', { name: "Host", message: nicknames[socket.id] + " has connected" });

    socket.on("message", function(msg) {
     io.to(guestOccupancy[socket.id]).emit("this", {name: nicknames[socket.id], message: msg})
    })

    socket.on('roomChangeRequest', function(roomName) {
      var oldRoom = guestOccupancy[socket.id]
      joinRoom(roomName, socket);
      io.to(oldRoom).emit('this', { name: "Host", message: nicknames[socket.id] + " has left the room" });
      socket.emit('roomChangeResult', {
        success: true,
        message: "Room changed to " + roomName
      })
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
      io.to(guestOccupancy[socket.id]).emit('this', { name: "Host", message: name + " has left the room"})
    });

  });

}

var guestOccupancy = {};

var guestnumber = 0;

var nicknames = {};

var addGuest = function(socket) {
  guestnumber += 1;
  nicknames[socket.id] = "Guest" + guestnumber;
  guestOccupancy[socket.id] = 'lobby'
}

var joinRoom = function(newRoom, socket) {
  socket.leave(guestOccupancy[socket.id]);
  socket.join(newRoom);
  guestOccupancy[socket.id] = newRoom;
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



