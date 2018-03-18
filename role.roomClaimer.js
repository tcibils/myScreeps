

var roomClaimer = {
    run: function(creep) {
		// Changer les positions absolues, encore
		
        // If the target room is not my room
//        if(!Game.rooms[creep.memory.targetRoom].my) {
            if(creep.memory.targetRoom != creep.room.name) {
                // We find the closest exit towards target room
                var localExit = creep.room.findExitTo(creep.memory.targetRoom);
                // And we move towards our target !
                creep.moveTo(creep.pos.findClosestByRange(localExit));
            }
            
            if(creep.memory.targetRoom == creep.room.name) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE || creep.signController(creep.room.controller, 'Member of Alliance #Overlords.') == ERR_NOT_IN_RANGE ) {
                    creep.moveTo(creep.room.controller);
                }
            }
//        }
        /*
        if(Game.rooms[creep.memory.targetRoom].my) {
            creep.memory.role = 'longDisttanceBuilder';
        }*/
            
        
        /*
        // If it is, let's build a spawn !
        if(Game.rooms[creep.memory.targetRoom].my) {
			// Not enough energy, go pick some
            if(creep.energy < creep.energyCapacity/3){
                if(creep.room.name != creep.memory.originRoom) {
                    creep.moveTo(new RoomPosition(20,13,creep.memory.originRoom));
                }
                else if (creep.room.name == creep.memory.targetRoom) {
                    if(Game.getObjectById(creep.memory.target) == null) {
                        var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_EXTENSION ||
                                            structure.structureType == STRUCTURE_SPAWN ||
                                            structure.structureType == STRUCTURE_CONTAINER) && structure.energy == structure.energyCapacity;
                            }
                        });
                        if(primaryTarget != null) {
                            creep.memory.target = primaryTarget.id;
                        }
                    }
                    else {
                        if(creep.withdraw(Game.getObjectById(creep.memory.target),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
            
			// Enough energy, let's build
            if(creep.energy >= creep.energyCapacity/3) {
                creep.memory.target = null;
                if(creep.room.name != creep.memory.targetRoom) {
                    creep.moveTo(new RoomPosition(41,47,creep.memory.targetRoom));
                }
                else if(creep.room.name == creep.memory.targetRoom) {
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length > 0) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
            }
        }*/
    }
};

module.exports = roomClaimer;