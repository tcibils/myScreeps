// Returns the number of "WORK" body parts needed to optimaly exploit the source, minus the number of "WORK" body parts already attached to the source
// We do not take into account the creeps that are gonna die (say, less than 150 ticks to live)

var workPartsNeededOfSource = {
    run: function(toBeAssessed) {
        // time it takes to get refilled, divided by 2 because each work body part takes 2 per turn...
        var maxNeeded = Math.ceil(toBeAssessed.energyCapacity / 300) / 2;  
        var creepsOnSource = _.filter(Game.creeps, (creep) => creep.memory.attachedSource == toBeAssessed.id);

        var counterOfCurrentWorkBodyParts = 0;
        
        for(var i = 0; i<creepsOnSource.length; i++) {
            if(creepsOnSource[i].ticksToLive >= 125) {
                for(var j = 0; j<creepsOnSource[i].body.length; j++) {
                    if(creepsOnSource[i].body[j].type == WORK) {
                        counterOfCurrentWorkBodyParts++;
                    }
                }
            }
        }
        
        var result = maxNeeded - counterOfCurrentWorkBodyParts;
        // console.log('Room ' + toBeAssessed.room.name + ', source ' + toBeAssessed.id + ', total needed : ' + maxNeeded + ', current counter : ' + counterOfCurrentWorkBodyParts + ', thus result needed : ' + result);
        return result;
    }  
};

module.exports = workPartsNeededOfSource;