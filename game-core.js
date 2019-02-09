//Most of the code here is exactly the same as the client code. With the biggest difference that the client doesn't do collision calculations.
//Also note that the server code has all vars attached to the "game" object for access by the game-server

module.exports = server => {
    
    //Game vars
    let game = {};

    game.riders = {};
    game.inputs =[];

    //Physics loop at 45 fps (default)
    game.msfps = 1000/server.config.server_physics;

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
        game.inputs.forEach(game.onKey);
        game.inputs = [];

        for (const i in game.riders) {
            const rider = game.riders[i];

            let spd = (0.18) * game.msfps;
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
            delete game.riders[i];

            //Check ALL lights and see if rider is in them
            //Server side only
            else {
                for (const j in game.riders) {
                    let light = [...game.riders[j].light];
                    light.push(game.riders[j].pos);

                    for (let n = 0; n < light.length; n++) {
                        const light1 = light[n];
                        const light2 = light[n+1];

                        if (light2) {
                            if (light1.y == light2.y)
                                if (rider.pos.y > light1.y-3 && rider.pos.y < light1.y+3)
                                    if (rider.pos.x > light1.x && rider.pos.x < light2.x || rider.pos.x > light2.x && rider.pos.x < light1.x)
                                        delete game.riders[i]
                            
                            if (light1.x == light2.x)
                                    if (rider.pos.x > light1.x-3 && rider.pos.x < light1.x+3)
                                        if (rider.pos.y > light1.y && rider.pos.y < light2.y || rider.pos.y > light2.y && rider.pos.y < light1.y)
                                            delete game.riders[i]
                        }
                    }
                }
            }
        }

        //Someone won, restart
        if (Object.keys(game.riders).length < 2 && server.clientCount > 1) {
            server.startRound();
        }

    }

    game.onKey = ({key, playernumber}) => {
        if (!game.riders[playernumber])
            return;
        
        switch (key) {
            case "w":
            case "ArrowUp":
                if (game.riders[playernumber].pos.dr !== 2)
                    game.riders[playernumber].pos.dr = 0;
                break;
            case "a":
            case "ArrowLeft":
                if (game.riders[playernumber].pos.dr !== 3)
                    game.riders[playernumber].pos.dr = 1;
                break;
            case "s":
            case "ArrowDown":
                if (game.riders[playernumber].pos.dr !== 0)
                    game.riders[playernumber].pos.dr = 2;
                break;
            case "d":
            case "ArrowRight":
                if (game.riders[playernumber].pos.dr !== 1)
                    game.riders[playernumber].pos.dr = 3;
        }

        game.riders[playernumber].light.push({x:game.riders[playernumber].pos.x, y:game.riders[playernumber].pos.y});
    }

    setInterval(game.physics, game.msfps)

    return game;
};

