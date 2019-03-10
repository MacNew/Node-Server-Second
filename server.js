var app = require('express')();
const AUTHENTICATED="AUTHENTICATED";
app.get('/', function (req, res) {
  res.sendfile(__dirname+"/index.html");
});


var server = app.listen(process.env.PORT || 3000, () => {
  console.log("all okay")
})
var io = require('socket.io')(server);



io.on('connection', function (socket) {
  if(socket.handshake.query.Auth=="token;pass")
{
  console.log(socket.id+" added to socket !");
  io.emit(AUTHENTICATED,"Congrats You are authenticated :) ");
} 
  else {
    socket.disconnect()
    io.emit("AUTH_FAILED","Failed to Authenticate :(")
  } 
  
  // socket.on('disconnect', () => {
  //      io.emit("message","Someone Left the Global Chat !")

  //   });
  // socket.on('join', (msg) => {
  //   io.emit("message", msg.user + " has entered !")
  // })
  // socket.on('message', (msg) => {
  //   io.emit("message", msg)
  // })
});

