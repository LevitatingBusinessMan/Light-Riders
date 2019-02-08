const express = require("express"),
    socketIO = require("socket.io"),
    path = require("path"),
    UUID = require('uuid/v4'),
    config = require(path.join(__dirname, "/config/config.js")),
    app = express(),
    http = require('http').Server(app);

app.use(express.static(path.join(__dirname,"./public")));

http.listen(config.port, () => console.log("Listening on port: " + config.port));

const io = socketIO.listen(http);

io.on("connection", client => {
    console.log("Player connected");
    client.userId = UUID();
    client.emit("onconnected", {uuid: client.userId});

    client.on("disconnect", () => {
        console.log("Player disconnected")
    });
});