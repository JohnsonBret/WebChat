var app = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dataBase";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database Connected");
  var databaseObject = db.db("ChatDB");
  databaseObject.createCollection("users", function(err, res){
    if(err) throw err;
    console.log("Collection Created");
      
    db.close();
  });

});



app.get('/', function(req, res){
  res.sendFile('login.html', { root: __dirname});
});


app.get('/style.css', function (req, res) {
  res.sendFile('style.css', { root: __dirname});
});

app.get('/clientChat.js', function(req, res){
  res.sendFile('clientChat.js', { root: __dirname});
});

app.get('/loginStyle.css', function (req, res) {
  res.sendFile('loginStyle.css', { root: __dirname});
});

app.get('/UserImages/totoro.png', function(req, res){
  res.sendFile('UserImages/totoro.png', { root: __dirname});
});

app.post('/login', function(req, res){
  console.log("Do Validation - Communicate with DB");
  console.log(req.body.username);
  res.sendFile('index.html', { root: __dirname});
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    console.log('User Disconnection');
  });

});

io.on('connection', function(socket){
  socket.on('chatMessage', function(msg){
    io.emit('chatMessage', msg);
    console.log('message: ' + msg + ' SocketID: ' + socket.id);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});
