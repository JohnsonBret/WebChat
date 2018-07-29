var app = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname});
});

app.get('/style.css', function (req, res) {
  res.sendFile('style.css', { root: __dirname});
});

app.get('/UserImages/totoro.png', function(req, res){
  res.sendFile('UserImages/totoro.png', { root: __dirname});
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    console.log('User Disconnection');
  });

});

io.on('connection', function(socket){
  socket.on('chatMessage', function(msg){
    io.emit('chatMessage', msg);
    console.log('message: ' + msg);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});