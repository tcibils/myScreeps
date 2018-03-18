var getDepositTarget = require('get.depositTarget');

var roleFastMover = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var spawningPoints = creep.room.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_SPAWN}} );
        
        // Avoids that the creep takes some energy and dies with it somewhere in the room
        if(creep.ticksToLive < 10 && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.say('Hara Kiri')
            creep.suicide;
        }
        
        // First, if we have little energy, we go pickup some
	    if(creep.carry.energy < creep.carryCapacity/3) {
	        
	        
	        // If we have no source attached, then we attach one, which needs as much capacity as this creep have
	        if(Game.getObjectById(creep.memory.attachedSource) == null) {
               creep.memory.attachedSource = creep.memory.needOrigin;
	        }
	        
	        // If we have a source, but we are far away, we move towards it
            else if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.attachedSource).pos) > 3) {
	            creep.moveTo(Game.getObjectById(creep.memory.attachedSource).pos);
	        }
	       
	        // If we are close to it, we pickup the energy
	        else if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.attachedSource).pos) <= 3){
	            
	            // We take the biggest energy spot around, in order to avoid being stuck by a small harvester dropping 2 per turn
	            var potentialEnergySpots = Game.getObjectById(creep.memory.attachedSource).pos.findInRange(FIND_DROPPED_RESOURCES,2);
	            var targetEnergySpot = 0;
	            if(potentialEnergySpots.length > 0){
    	            for(let i = 0; i<potentialEnergySpots; i++) {
	                    if(potentialEnergySpots[i] > targetEnergySpot) {
	                        targetEnergySpot = i;
	                    }
	                }
	            }   
	            // ... aaand pickup.
                if(creep.pickup(potentialEnergySpots[targetEnergySpot]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(potentialEnergySpots[targetEnergySpot], {reusePath: 5});
                }
	        }
	    }
           
           
        // now if we carry enough energy, we go drop some.
        if(creep.carry[RESOURCE_ENERGY] >= creep.carryCapacity/3 ){
            getDepositTarget.run(creep);
            
            if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.depositTarget), {reusePath: 5});
            }
            
        }
	}
};

module.exports = roleFastMover;