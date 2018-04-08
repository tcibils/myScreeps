
// Old function, coded in simulation, to see if there's an enemy creep arround the source.
// Obsolete I guess.

var ennemyAroundSource = {
    run: function(toBeAssessed) {
        var ennemyPresent = false;
        for(var x = -1; x<=1; x++) {
            for(var y = -1; y<=1; y++) {
				// On regarde les creeps autour de la source dans la pièce, pas de soucis pour le multi-rooming
                var localCreeps = toBeAssessed.room.lookForAt(LOOK_CREEPS,toBeAssessed.pos.x + x, toBeAssessed.pos.y + y);
                if(localCreeps.length > 0) {
                    for(var i=0; i<localCreeps.length; i++) {
                        if(!localCreeps[i].my) {
                            ennemyPresent = true;
                        }
                    }
                }
            }   
        }
    return ennemyPresent;
    }
};

module.exports = ennemyAroundSource;