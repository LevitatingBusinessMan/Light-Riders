let server = {};
const game = require(__dirname + "/game-core.js")(server)

module.exports = io => {
    
    //Sever vars

    server.playerNumbers = [];
    server.clientCount = 0;
    server.clients = io.sockets.sockets;

    io.on("connection", client => {
        console.log("Player connected");
        server.clientCount++;

        //Create personal ID for the client
        //client.userId = UUID();

        let stop = false;
        for (let i = 1; !stop; i++) {
            if (!server.playerNumbers.includes(i)) {
                client.playernumber = i;
                server.playerNumbers.push(i);
                stop = true;
            }
        }
        
        //Tell the client it's connected and give it it's player number
        client.emit("onconnected", {playernumber: client.playernumber, id: client.id});
        io.sockets.emit("playerconnected", {playernumber: client.playernumber, players: client.clientCount})

        if (server.clientCount > 1 && game.status == "waiting")
            server.startRound();
        else game.status = "waiting";

        //Handle input from client
        client.on("input", data => {
            game.inputs.push({key: data.key, playernumber: client.playernumber})
        })

        client.on("disconnect", () => {
            console.log(`Player ${client.playernumber} disconnected`);
            server.clientCount--;

            //Remove player number
            let i = server.playerNumbers.indexOf(client.playernumber);
            server.playerNumbers.splice(i,1);

            //Remove rider
            delete game.riders[client.playernumber];

            //Set the game to waiting if necessary
            if (server.clientCount < 2) {
                game.status = "waiting";
                game.riders = [];
            }
        });
    });
    
    server.startRound = function () {

        game.status = "active";
        game.riders = {};
        for (let i = 0; i < server.playerNumbers.length; i++) {
            const player = server.playerNumbers[i];
            let pos = game.generatePos();
            game.riders[player] = {pos, light: [Object.assign({}, pos)]}
        }

        io.sockets.emit("update", this.createUpdate())

    }

    /**
     * Create update for the clients
     */
    server.createUpdate = () => {
        return {riders: game.riders, players: server.clientCount, status:game.status}
    }

    server.update = () => {
        io.sockets.emit("update", server.createUpdate())
    }

    //Server update at 15hz
    setInterval(server.update, 1000/15)
}

