var socket = io();
var newChat = new Chat(socket);

var messageToInput = function(event) {
  var message = event.val();
  event.val("")
  return message;
}

var sendMessageToChat = function(msg) {
  newChat.sendMessage(msg);
}

var sendNameChange = function(msg) {
  var name = msg.slice(6);
  newChat.sendNameChange(name);
}

var evaluateParse = function(msg) {
  if (msg.slice(0, 5) === "/nick") {
    sendNameChange(msg);
  } else {
    insertIntoHTML("invalid command");
  }
}

var insertIntoHTML = function(msg) {
  $('div.messages').append($("<li></li>").text(msg))
}


$(document).ready(function() {
  socket.on("this", function(mesg) {
    var msg = (mesg.name + " says "+ mesg.message)
    insertIntoHTML(msg)
  });

  socket.on("nicknameChangeResult", function(mesg) {
    insertIntoHTML(mesg.message)
  });

  $('form.message-form').bind("submit", function(event){
    event.preventDefault();
    var msg = messageToInput($('input'))
    if (msg.slice(0, 1) === "/") {
      evaluateParse(msg)
    } else {
      sendMessageToChat(msg);
    }
  })
});