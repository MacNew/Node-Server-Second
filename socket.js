


class HamroDriverSocket {

    constructor(server, io) {
        this.io = io;
        this.clients = [];
        this.constants = require("./hamroDriverConstants");
        this.initListerners()
    }

    initListerners() {
        const io = this.io,
            constants = this.constants;
        var clients = this.clients;

        io.on('connection', function (socket) {
            if (socket.handshake.query.Auth == "token;pass") {
                console.log("AUTHNTICATED", socket.id);
                io.emit(constants.EVENT_AUTHENTICATED, "Congrats You are authenticated :) ");
            }
            else {
                io.emit(constants.EVENT_AUTH_FAILED, "Failed to Authenticate :(")
                socket.disconnect()
            }

            socket.on(constants.EVENT_CONNECTCLIENT, (json) => {
                json = JSON.parse(json)
                const userType = new String(json.userType);
                if (userType != constants.USER && userType != constants.DRIVER) socket.disconnect();
                var rsocket = clients.find(x => x.id == socket.id)
                if (rsocket == undefined) {
                    clients.push({ "id": socket.id, "data": json });
                }
                this.clients=clients
              
            }).on('disconnect', () => {
                
                var rsocket = clients.find(x => x.id == socket.id)
                clients = clients.filter((i) => {
                    return rsocket !== i;
                })
                this.clients=[]
                this.clients=clients;

            }).on(constants.DRIVER_STREAM, (json) => {
                console.log(json);
            })
            
 

        });
    }
}

module.exports = HamroDriverSocket;

