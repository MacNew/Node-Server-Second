const constants = require("./hamroDriverConstants")

module.exports = {
    Socket: (io, app) => {
        var clients = app.get("clients")
        io.on('connection', function (socket) {
            if (socket.handshake.query.Auth == "token;pass") {
                console.log("AUTHNTICATED", socket.id);
                io.emit(constants.EVENT_AUTHENTICATED, '{"message":"authenticated","type":"AUTHENTICATED"}');
            }
            else {
                io.emit(constants.EVENT_AUTH_FAILED, '{"message":"not_authenticated","type":"NOT_AUTHENTICATED"}')
                socket.disconnect()
            }

            socket.on(constants.EVENT_CONNECTCLIENT, (json) => {
                json = JSON.parse(json)
                const userType = new String(json.userType);
                if (userType != constants.USER && userType != constants.DRIVER) {
                    socket.disconnect();
                    return;
                }

                var rsocket = clients.find(x => x.socket_id == socket.id)
                if (rsocket == undefined) {

                    clients.push({ "data": json, "socket": socket, "socket_id": socket.id });
                }
                app.set(constants.CLIENTS, clients)

            }).on('disconnect', () => {
                var rsocket = clients.find(x => x.socket_id == socket.id)
                clients = clients.filter((i) => {
                    return rsocket !== i;
                })
                app.set(constants.CLIENTS, clients)

            }).on(constants.DRIVER_STREAM, (json) => {
                json = JSON.parse(json)
                if (json.type == "DRIVER_LOC_UPDATE") {
                    var client = clients.find(x => x.data.activationCode == json.activationCode)
                    if (client != undefined)
                        client["lat/lon"] = json.lat / lon;
                }
            })

        });
    }
}













