//Game vars
let game = {};

game.riders = {};
game.inputs =[];

//Generate starting position
game.generatePos = () => {
    let side = Math.floor(Math.random() * 4) + 1; //side of field to start at
    let pos = Math.floor(Math.random() * 770) + 30; //Position if the width of the playing field is 800 (margin of 30)

    // We start 20 pixels away from the walls
    let starting_coords = {};
    switch (side) { 
        case 1: //Upper
            starting_coords = {x: pos, y:20, dr:2};
            break;
        case 2: //Right
            starting_coords = {x: 780, y: pos, dr:1};
            break;
        case 3: //Lower
            starting_coords = {x: pos, y: 780, dr:0};
            break;
        case 4: //Left
            starting_coords = {x: 20, y:pos, dr:3}
    }
    
    return starting_coords;
}

game.physics = () => {

    //Use input
    game.inputs.forEach(game.onKey)
    for (const i in game.riders) {
        const rider = game.riders[i];

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
}

game.onKey = ({key, playernumber}) => {
    if (!game.riders[playernumber])
        return;
    
    switch (key) {
        case "w":
        case "ArrowUp":
            game.riders[playernumber].pos.dr = 0;
            break;
        case "a":
        case "ArrowLeft":
            game.riders[playernumber].pos.dr = 1;
            break;
        case "s":
        case "ArrowDown":
            game.riders[playernumber].pos.dr = 2;
            break;
        case "d":
        case "ArrowRight":
            game.riders[playernumber].pos.dr = 3;
    }

    game.riders[playernumber].light.push({x:game.riders[playernumber].pos.x, y:game.riders[playernumber].pos.y});
}

//Physics loop at 30 fps
setInterval(game.physics, 1000/60)

module.exports = game;