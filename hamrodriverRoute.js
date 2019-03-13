const express = require("express"),
 server=require("./server")

app = express.Router();
app.get("/check", (req, res, next) => {
    res.json({"A":server.CHECKS})
})

module.exports = app;