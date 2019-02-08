const canvas = document.getElementsByTagName("canvas")[0];
const {width, height} = canvas;
const ctx = canvas.getContext('2d');

//rider_color lookup table
const rider_color = [undefined, "cyan","red","green","yellow"]

/**
 * 
 * @param {Object} data - x,y and Direction: Value between 0 and 3. (up: 0, left: 1, down: 2, right: 3)
 * @param {String} color - color of rider
 */
function drawRider({x,y,dr}, color) {
    // rider is 19 pixels long and 11 pixels wide
    ctx.fillStyle = color;
    
    if (dr == 0 || dr == 2) {
        ctx.fillRect(x-5, y-9, 11, 19); //Color outline
        ctx.fillStyle = "black";
        ctx.fillRect(x-3, y-7, 7, 15); //Inner rectangle
    }
    
    if (dr == 1 || dr == 3) {
        ctx.fillRect(x-9, y-5, 19, 11); //Color outline
        ctx.fillStyle = "black";
        ctx.fillRect(x-7, y-3, 15, 7); //Inner rectangle
    }

}
/**
 * @param {Array} light - Array with coordinates to draw points between
 * @param {Object} pos - Object with current riders coords
 * @param {string} color - color of rider/light
 */
function drawLight(light, pos, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    let begin = [...light].splice(0,1);
    ctx.moveTo(begin.x, begin.y);
    light.forEach(l => ctx.lineTo(l.x, l.y));
    //Lastly we draw to the riders location
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function draw() {
    //background
    ctx.fillStyle = dat_.bg_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (const i in riders) {
        const rider = riders[i]
        const color = rider_color[i] || "grey";
        drawLight(rider.light, rider.pos, color);
        drawRider(rider.pos, color);
    }

}

function physics() {
    for (const i in riders) {
        const rider = riders[i];
        
        let spd = 2;
        switch (rider.pos.dr) {
            case 0:
                rider.pos.y-=spd;
                break;
            case 1:
                rider.pos.x-=spd;
                break;
            case 2:
                rider.pos.y+=spd;
                break;
            case 3:
                rider.pos.x+=spd;
        }
    }

    draw();
}

//Physics loop at 30 fps
setInterval(physics, 1000/60);

document.onkeydown = e => {

    if (["w","a","s","d","ArrowUp","ArrowLeft","ArrowDown","ArrowRight"].includes(e.key)) {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                riders[playernumber].pos.dr = 0;
                break;
            case "a":
            case "ArrowLeft":
                riders[playernumber].pos.dr = 1;
                break;
            case "s":
            case "ArrowDown":
                riders[playernumber].pos.dr = 2;
                break;
            case "d":
            case "ArrowRight":
                riders[playernumber].pos.dr = 3;
        }

        riders[playernumber].light.push({x:riders[playernumber].pos.x, y:riders[playernumber].pos.y});
        socket.emit("input", {key:e.key})
    }

};
