function Chat(socket) {
  this.socket = socket;
}

Chat.prototype.sendMessage = function(message) {
  this.socket.emit('message', message)
}

Chat.prototype.sendNameChange = function(name) {
  this.socket.emit('nicknameChangeRequest', name)
}

Chat.prototype.sendRoomChange = function(room) {
  this.socket.emit('roomChangeRequest', room)
}