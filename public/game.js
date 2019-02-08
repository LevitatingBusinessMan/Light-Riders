const canvas = document.getElementsByTagName("canvas")[0];
const {width, height} = canvas;
const ctx = canvas.getContext('2d');

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
 * @param {Object} r_coord - Object with current riders coords
 * @param {string} color - color of rider/light
 */
function drawLight(light, r_coord, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    let begin = [...light].splice(0,1);
    ctx.moveTo(begin.x, begin.y);
    light.forEach(l => ctx.lineTo(l.x, l.y));
    //Lastly we draw to the riders location
    ctx.lineTo(r_coord.x, r_coord.y);
    ctx.stroke();
}

let r1_coord = {x:700, y:780, dr:0};
let r1_light = [{x:700, y:780}];
function draw() {
    //Grey background
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let spd = 2;
    switch (r1_coord.dr) {
        case 0:
            r1_coord.y-=spd;
            break;
        case 1:
            r1_coord.x-=spd;
            break;
        case 2:
            r1_coord.y+=spd;
            break;
        case 3:
            r1_coord.x+=spd;
    }

    //console.log(r1_coord)
    
    drawLight(r1_light, r1_coord, "cyan");
    drawRider(r1_coord, "cyan");
}

document.onkeydown = e => {
    switch (e.key) {
        case "w":
        case "ArrowUp":
            r1_coord.dr = 0;
            break;
        case "a":
        case "ArrowLeft":
            r1_coord.dr = 1;
            break;
        case "s":
        case "ArrowDown":
            r1_coord.dr = 2;
            break;
        case "d":
        case "ArrowRight":
            r1_coord.dr = 3;
    }
    r1_light.push({x:r1_coord.x, y:r1_coord.y});
};

setInterval(() => {
    draw();
}, 1000/60);
