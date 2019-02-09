let server = {};
server.config = require(__dirname + "/config/config.js")
const game = require(__dirname + "/game-core.js")(server)


module.exports = io => {
    
    //Sever vars

    server.playerNumbers = [];
    server.clientCount = 0;
    server.clients = io.sockets.sockets;
    server.activeClientsCurrentRound = [];

    io.on("connection", client => {
        console.log("Player connected");
        server.clientCount++;

        //Give client its player number
        let stop = false;
        for (let i = 1; !stop; i++) {
            if (!server.playerNumbers.includes(i)) {
                client.playernumber = i;
                server.playerNumbers.push(i);
                stop = true;
            }
        }
        
        //For AFK handling
        client.inactiveRounds = 0;

        //Tell the client it's connected and give it it's player number
        client.emit("onconnected", {
            playernumber: client.playernumber,
            id: client.id,
            server_update_hz: server.config.server_update,
            server_physics_hz: server.config.server_physics
        });

        io.sockets.emit("playerconnected", {player: client.playernumber});

        if (server.clientCount > 1 && game.status == "waiting")
            server.startRound();
        else if (server.clientCount < 2)
            game.status = "waiting";

        //Receive ping_, emit pong_ (ping and pong are reserved)
        client.on("ping_", () => client.emit("pong_"));

        //Handle input from client
        client.on("input", data => {
            game.inputs.push({key: data.key, playernumber: client.playernumber})

            //For AFK handling
            client.inactiveRounds = 0;
            if (game.status == "active" && !server.activeClientsCurrentRound.includes(client.id))
                server.activeClientsCurrentRound.push(client.id)
        });

        client.on("disconnect", () => {
            io.sockets.emit("playerdisconnected", {player: client.playernumber});

            console.log(`Player ${client.playernumber} disconnected`);
            server.clientCount--;

            //Remove player number
            let i = server.playerNumbers.indexOf(client.playernumber);
            server.playerNumbers.splice(i,1);

            //Remove rider
            delete game.riders[client.playernumber];

            //Set the game to waiting if necessary
            if (server.clientCount < 2)
                server.roundEnd();
        });
    });
    
    //Send ping signal every second
    setInterval(() => io.sockets.emit("ping", {start: new Date().getTime()}), 1000);

    server.startRound = function () {

        server.activeClientsCurrentRound = [];
        game.status = "active";
        game.riders = {};
        for (let i = 0; i < server.playerNumbers.length; i++) {
            const player = server.playerNumbers[i];
            let pos = game.generatePos();
            game.riders[player] = {pos, light: [Object.assign({}, pos)]}
        }

        io.sockets.emit("update", this.createUpdate())

    }

    server.roundEnd = function () {

        if (Object.keys(game.riders).length)
            io.sockets.emit("won", {player: Object.keys(game.riders)[0]})

        if (server.clientCount < 2) {
            console.log("Setting status to waiting")
            game.status = "waiting";
            game.riders = {};
        }

        //Handle afk players
        for (const id in server.clients) {
            const client = server.clients[id];

            //Player didn't make any input this round
            if (!this.activeClientsCurrentRound.includes(id)) {
                client.inactiveRounds += 1;

                //Player didn't make any input for 3 rounds or more
                if (client.inactiveRounds > 2) {
                    io.sockets.emit("afk", {player: client.playernumber});
                    console.log(`Kicking player ${client.playernumber} for being afk.`)
                    client.disconnect();
                }

            }
        }
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

    //Server update at 120hz (default)
    setInterval(server.update, 1000/server.config.server_update)
}

