var http = require('http'),
    static = require('node-static');

var file = new static.Server('./public');

var socketIOServer = require('./chat_server.js')


var server = http.createServer(function (req, res) {
  req.addListener('end', function() {
    file.serve(req, res);
  }).resume();
});



var chat = createChat(server);

server.listen(8000);



