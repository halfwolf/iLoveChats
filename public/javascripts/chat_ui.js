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

var insertIntoHTML = function(msg) {
  $('div.messages').append($("<li></li>").text(msg))
}

$(document).ready(function() {


  $('form.message-form').bind("submit", function(event){
    event.preventDefault();
    var msg = messageToInput($('input'))
    sendMessageToChat(msg);
    insertIntoHTML(msg);
  })
});