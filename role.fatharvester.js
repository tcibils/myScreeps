var senderLinkCloseToSource = require('info.senderLinkCloseToSource');

var roleFatHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var spreaders = creep.room.find(FIND_MY_CREEPS,{filter: {memory: {role: 'spreader'}}});
        
        var sources = creep.room.find(FIND_SOURCES);
        var counterOfCurrentCarryParts = 0;
        
        // Toute la logique d'attachement de source ci dessous sera plus logique dans le prototype de spawn que dans le corps même du creep
        
                
                // IF we have no source target defined, we find one
                if(Game.getObjectById(creep.memory.attachedSource) == undefined) {
                   creep.memory.attachedSource = creep.memory.needOrigin;
                }

        // ISSUE HERE - CREEPS TOO FAR AWAY FROM LINK WILL STOP WORKING !
        
        if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity || (!senderLinkCloseToSource.run(Game.getObjectById(creep.memory.attachedSource)) && spreaders.length == 0) || counterOfCurrentCarryParts == 0) {
            if(creep.harvest(Game.getObjectById(creep.memory.attachedSource)) == ERR_NOT_IN_RANGE || creep.harvest(Game.getObjectById(creep.memory.attachedSource)) == ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(Game.getObjectById(creep.memory.attachedSource), {visualizePathStyle: {stroke: '#ffbc11'}});
            }
        }
        
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            if(Game.getObjectById(creep.memory.link) == null) {
                var potentialLink = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK)}});
                if(potentialLink != null) {
                    if(creep.pos.getRangeTo(potentialLink.pos) < 3) {
                        creep.memory.link = potentialLink.id;
                    }
                }
            }
            
            if(Game.getObjectById(creep.memory.link) != null) {
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                    if(creep.transfer(Game.getObjectById(creep.memory.link), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.link));
                    }
                }
            }
        }
	}
};

module.exports = roleFatHarvester;