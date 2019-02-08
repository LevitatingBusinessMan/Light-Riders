const socket = io();
const datData = function () {
    this.connected = false;
    this.uuid = "";
    this.ping = 0;
    this.fps = 0;
    return this;
}
var dat_ = datData();

window.onload = () => {
    var gui = new dat.GUI();
    gui.add(dat_, "connected").listen();
    gui.add(dat_, "uuid").listen();
    gui.add(dat_, "ping").listen();
    gui.add(dat_, "fps").listen();
};

socket.on("onconnected", data => {
    dat_.connected = true;
    dat_.uuid = data.uuid;
    console.log("Connected with server. UUID: " + data.uuid);
})
