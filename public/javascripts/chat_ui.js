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

var makeNameChange = function(msg) {
  var name = msg.slice(6);
  newChat.sendNameChange(name);
}

var makeRoomChange = function(msg) {
  var room = msg.slice(6);
  newChat.sendRoomChange(room);
}

var updateRoster = function(room, roster) {
  $('h2.roster-room-title').text(room);
  var rosterHTML = "";
  roster.forEach(function(el) {
    rosterHTML += ("<li>" + el + "</li>")
  });
  $('ul.roster-items').html(rosterHTML);
}

var evaluateParse = function(msg) {
  if (msg.slice(0, 5) === "/nick") {
    makeNameChange(msg);
  } else if (msg.slice(0, 5) === "/room"){
    makeRoomChange(msg)
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

  socket.on("roomChangeResult", function(mesg) {
    insertIntoHTML(mesg.message);
  });

  socket.on("rosterChange", function(response) {
    updateRoster(response.room, response.roster);
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