const app = require('express')(),
  HamroDriverSocket=require("./hamroDriverSocket")
  constants = require("./hamroDriverConstants"),
  jwt = require("jsonwebtoken"),
  morgan = require("morgan");

  
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("all okay...")
})
var io = require('socket.io')(server);


app.set(constants.CLIENTS,[])

HamroDriverSocket.Socket(io,app);






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
    expiresIn: 1440 // expires in 48 hours
  });
  res.status(200)
  res.json({
    message: 'authentication done',
    token: token
  });
})




