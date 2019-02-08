const socket = io();
const datData = function () {
    this.connected = false;
    this.socket = "none";
    this.playernumber = "none";
    this.players = "uknown";
    this.status = "uknown";
    this.bg_color = " #336699";
    this.ping = 0;
    this.fps = 0;
    return this;
}
var dat_ = datData();

window.onload = () => {
    var gui = new dat.GUI();
    gui.add(dat_, "connected").listen();
    gui.add(dat_, "socket").listen();
    gui.add(dat_, "playernumber").listen();
    gui.add(dat_, "players").listen();
    gui.add(dat_, "status").listen();
    gui.add(dat_, "bg_color");
    gui.add(dat_, "ping").listen();
    gui.add(dat_, "fps").listen();
};

//Game vars
var riders,
    playernumber,
    status;

socket.on("onconnected", data => {
    dat_.connected = true;
    dat_.playernumber = playernumber = data.playernumber;
    dat_.socket = data.id;
    console.log("Connected with server. Socket id: " + data.id);
});

socket.on("playerconnected", data => {
    //alert(`Player ${data.playernumber} connected!`);
});

socket.on("update", data => {
    riders = data.riders;
    dat_.players = data.players;
    status = data.status;
});