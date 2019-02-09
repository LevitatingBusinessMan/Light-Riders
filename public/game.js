const canvas = document.getElementsByTagName("canvas")[0];
const {width, height} = canvas;
const ctx = canvas.getContext('2d');

//rider_color lookup table
const rider_color = [undefined, "cyan","red","green","yellow", "blue", "purple"]

//milliseconds per frame to run the physics loop at
let msfps = 1000/dat_.fps;

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
    ctx.lineWidth = 5;
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
    
    if (status == "waiting") {
        ctx.font = "60px Arial";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        ctx.fillText("Waiting for players...", 400, 400);
    }

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
        
        let spd = (0.18) * msfps;
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

        //Rider inside the walls, he ded, so in pure Tron style we delete him
        if (rider.pos.x < 0 || rider.pos.x > 800 || rider.pos.y < 0 || rider.pos.y > 800)
            delete riders[i];

        //Death calculation by light is done server sided only
    }

    //The user can change the fps at runtime, so we need to update it
    if (msfps !== 1000/dat_.fps) {
        msfps = 1000/dat_.fps;
        clearInterval(physicsLoop);
        physicsLoop = setInterval(physics, msfps);
    }

    draw();
}

let physicsLoop = setInterval(physics, msfps);

document.onkeydown = e => {

    if (["w","a","s","d","ArrowUp","ArrowLeft","ArrowDown","ArrowRight"].includes(e.key)) {
        socket.emit("input", {key:e.key});

/*          //We delay input because for better client prediction
        if (server_physics_hz)
            setTimeout(() => {
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
            }, ping*2+(1000/server_physics_hz)+(1000/server_update_hz));
 */
    }

};
