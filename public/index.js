const socket = io();
const datData = function () {
    this.connected = false;
    this.socket = "none";
    this.playernumber = "none";
    this.players = "uknown";
    this.status = "uknown";
    this.bg_color = " #336699";
    this.server_update_hz = "uknown";
    this.server_physics_hz = "uknown";
    this.ping = 0;
    this.fps = 60;
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
    gui.add(dat_, "server_update_hz").listen();
    gui.add(dat_, "server_physics_hz").listen();
    gui.add(dat_, "fps");
};

//Game vars
var riders,
    playernumber,
    status;

//Server vars
var ping = 0,
    server_update_hz = null;
    server_physics_hz = null;

socket.on("onconnected", data => {
    dat_.connected = true;
    dat_.playernumber = playernumber = data.playernumber;
    dat_.socket = data.id;
    server_update_hz = dat_.server_update_hz = data.server_update_hz;
    server_physics_hz = dat_.server_physics_hz = data.server_physics_hz;
    console.log("Connected with server. Socket id: " + data.id);
});

//Disconnected reset dat_?

socket.on("playerconnected", data => {
    //alert(`Player ${data.playernumber} connected!`);
});

socket.on("update", data => {
    riders = data.riders;
    dat_.players = data.players;
    status = data.status;
});

socket.on("ping", data => {
    let ping_ = new Date().getTime() - data.start;
    ping = dat_.ping = ping_;
});
