// Pour une source donnée, indique le nombre de cases "utilisables" de 1 à 8 autour de cette source
// Fatharvester va juste prendre ce paramètre pour prendre la source en mémoire et la miner ou non
// Harvester va prendre ce paramètre, moins les creeps ayant déjà cette source en mémoire (harvester ou fatharvesters)

// Almost obsolete, see get.freeFatSpotsOfSource...

var placesOfSource = {

    run: function(toBeAssessed) {
        var counter = 0;
        
//        console.log('source position : x : ' + toBeAssessed.pos.x + ', y : ' + toBeAssessed.pos.y);
        for(var x = -1; x<=1; x++) {
            for(var y = -1; y<=1; y++) {
                if (Game.map.getTerrainAt(toBeAssessed.pos.x + x, toBeAssessed.pos.y + y, toBeAssessed.room.name) == 'plain' || Game.map.getTerrainAt(toBeAssessed.pos.x + x, toBeAssessed.pos.y + y, toBeAssessed.room.name) == 'swamp') {
                    counter ++;
//                    console.log('counter+1 avec x = ' + x + ' et y = ' + y);
                }/*
                else if (Game.map.getTerrainAt(toBeAssessed.pos.x + x, toBeAssessed.pos.y + y, toBeAssessed.room.name) == 'swamp') {
                    counter ++;
//                    console.log('counter+1 avec x = ' + x + ' et y = ' + y);
                }*/
            }
        }
    return counter;
    }
};

module.exports = placesOfSource;