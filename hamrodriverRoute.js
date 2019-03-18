const app = require("express")()
constants = require("./hamroDriverConstants")
var clients = [];

// we get online user it may be driver/ user
app.get("/getAll/:type", (req, res) => {
    res.json(getSockets(req.params.type))
})


app.post("/broadcastAll/:type", (req, res) => {
    getSockets(req.params.type, false).forEach(client => {
        emit(client.socket, req.body)
    })
    sendOkayResponse(res, "Broadcast Successful to " + req.params.type)
})






app.post("/broadcast", (req, res) => { //specific users

    var users = req.body.users;
    var json = req.body.data;

    users.forEach(user => {
        var client = getClients().find(x => x.data.activationCode == user)
        if (client != undefined)
            //            console.log(client.socket)
            emit(client.socket, json)

    })
    sendOkayResponse(res)
})






sendOkayResponse = (res, msg = "Success") => {
    res.statusCode = 200;
    res.json({
        "message": msg
    })
}

emit = (socket, json) => socket.emit(constants.DRIVER_STREAM, json)

getSockets = (type, deleteSocket = true) => {
    clear();
    var client = {};
    getClients().forEach(realclient => {
        if (realclient.data.userType.toLowerCase() == type.toLowerCase()) {
            client.data= realclient.data;
            client.socket_id=realclient.socket_id;
            clients.push(client)

        }
        else if ("all" == type.toLowerCase()) {
            client.data = realclient.data;
            client.socket_id=realclient.socket_id;
            clients.push(client)

        }

    });
    return clients;
}

clear = () => clients = [];

send = (res) => res.json(clients);

getClients = () => app.get(constants.CLIENTS);

module.exports = app;