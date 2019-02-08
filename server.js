const express = require("express"),
    socketIO = require("socket.io"),
    path = require("path"),
    config = require(path.join(__dirname, "config/config.js")),
    gameserver = require(path.join(__dirname, "game-server.js")),
    app = express(),
    http = require('http').Server(app);

app.use(express.static(path.join(__dirname,"./public")));

http.listen(config.port, () => console.log("Listening on port: " + config.port));

const io = socketIO.listen(http);

gameserver(io);
