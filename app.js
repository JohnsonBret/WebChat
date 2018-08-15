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
  
  searchDatabaseForUser(req)


  res.sendFile('index.html', { root: __dirname});
});

function searchDatabaseForUser(request){
  console.log(request.body.username);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ChatDB");
    dbo.collection("users").find({}, { username: 1 }).toArray(function(err, result) {
      if (err) throw err;

      //Parse reponse
      //if we don't the username back as a result
      // Insert the new user into into the database - this function needs to have the insert object fixed
      console.log(result);
      console.log("Result Length: " + result.length);

      console.log("Request Username: " + request.body.username + " DatabaseResultUsername: " + result[0].name);


      if(isUsernameInDatabase(request.body.username, result))
      {
        console.log("User Already Exists!");
        
      }
      else
      {
        insertUserIntoDatabase(request);
      }

      db.close();
    });
  });
}

function isUsernameInDatabase(userName, dbSearchResults)
{
  
    for(var i = 0; i < dbSearchResults.length; i++)
    {
      console.log("Request Username: " + userName + " DatabaseResultUsername: " + dbSearchResults[i].name);

      if(dbSearchResults[i].name == userName)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
}


function insertUserIntoDatabase(userInfo)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ChatDB");
    var userObj = { name: userInfo.body.username, password: userInfo.body.password };
    dbo.collection("users").insertOne(userObj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

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
