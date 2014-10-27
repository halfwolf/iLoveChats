function Chat(socket) {
  this.socket = socket;
  this.room = 'lobby';
}

Chat.prototype.sendMessage = function(message) {
  this.socket.emit('message', {
      room: this.room,
      message: message
    }
  )
}

Chat.prototype.sendNameChange = function(name) {
  this.socket.emit('nicknameChangeRequest', name)
}

Chat.prototype.sendRoomChange = function(room) {
  this.socket.emit('roomChangeRequest', room)
  this.room = room
}