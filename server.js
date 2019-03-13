const app = require('express')(),
  HamroDriverSocket=require("./socket")
  constants = require("./hamroDriverConstants"),
  jwt = require("jsonwebtoken"),
  morgan = require("morgan"),
  parser = require("body-parser");
var clients = [];
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("all okay...")
})
var io = require('socket.io')(server);

var socket=new HamroDriverSocket(server,io);

setInterval(() => {
  console.log(socket.clients)
}, 5000);




app.set("SECRET", constants.SECRET)
app.use(morgan('dev'))
app.use(require("express").json())

app.use("/api", require("./protectedRouter"))
app.use("/api/hamrodriver",require("./hamrodriverRoute"))



app.post("/auth", (req, res, next) => {
  if (req.get(constants.TOKEN) != constants.PASS) {
    res.status(406)
    res.json({ "message": "Authentication Failed" })
    return;
  }
  const payload = {
    check: true
  }
  var token = jwt.sign(payload, app.get('SECRET'), {
    expiresIn: 1440 // expires in 24 hours
  });
  res.status(200)
  res.json({
    message: 'authentication done',
    token: token
  });
})

app.get("/api/a", (req, res, next) => {
  res.send("yes")
})

app.post(constants.BASE_URL + "broadcast/all", (req, res, next) => {
  if (handleError(req, res)) return
  else {
    const body = req.body;
    io.emit(constants.DRIVER_STREAM, body);
    res.statusCode = 200;
    res.json({ "message": "Sent to All Users!" });
  }

})

app.post(constants.BASE_URL + "broadcast/drivers", (req, res, next) => {
  if (handleError(req, res)) return
  else {
    const body = req.body;
    clients.forEach(i => {
      if (i.data.userType == constants.DRIVER)
        i.emit(constants.DRIVER_STREAM, body);
    })


  }
})



//Socket.IO Part Starts from HEre !!




// io.on('connection', function (socket) {
//   if (socket.handshake.query.Auth == "token;pass") {
//     io.emit(constants.EVENT_AUTHENTICATED, "Congrats You are authenticated :) ");
//   }
//   else {
//     io.emit(constants.EVENT_AUTH_FAILED, "Failed to Authenticate :(")
//     socket.disconnect()
//   }

//   socket.on(constants.EVENT_CONNECTCLIENT, (json) => {
//     json = JSON.parse(json)
//     const userType = new String(json.userType);
//     if (userType != constants.USER && userType != constants.DRIVER) socket.disconnect();
//     var rsocket = clients.find(x => x.id == socket.id)
//     if (rsocket == undefined) {
//       clients.push({ "id": socket.id, "data": json });
//     }

//   }).on('disconnect', () => {
//     var rsocket = clients.find(x => x.id == socket.id)
//     clients = clients.filter((i) => {
//       return rsocket !== i;
//     })
//   }).on(constants.DRIVER_STREAM, (json) => {
//     console.log(json);
//   })

// });

module.exports="check";

