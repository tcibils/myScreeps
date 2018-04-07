
/*
Concept :
1. Goes to target room
2. Fills up with containers from there, taking the fullest container (minus the carry capacity of creeps already attached to it)
3. Once filled, get backs to home room
4. Deposits energy in storage

Loop
*/


var underAttackCreepMemory = require('info.underAttackCreepMemory');

// Improvement idea 1 : set deposit target based on room memory, go there directly
// Improvement idea 2 : move toward needOriginPos stored in memory directly

var longDistanceFastMover = {
    run: function(creep) {
        
        underAttackCreepMemory.run(creep);
        
        if(creep.memory.gathering == undefined) {
            creep.memory.gathering = false;
        }
        
        if(creep.ticksToLive < 80) {
            creep.memory.gathering = false;
            if(creep.carry[RESOURCE_ENERGY] == 0) {
                creep.say('Hara-Kiri')
                creep.suicide();
            }
        }
        
        
        // If creep is not gathering, meaning he's going back home with energy
        if(creep.memory.gathering == false) {
            // If he's home
            if(creep.room.name == creep.memory.homeRoom) {
                // If he has some energy
                if(creep.carry[RESOURCE_ENERGY] > 0) {
                    // If he does not know where to deposit it
                    if(Game.getObjectById(creep.memory.depositTarget) == null) {
                        
                        var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                                filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && structure.energy < structure.energyCapacity}
                            });
                        if(primaryTarget != null) {
                            creep.memory.depositTarget = primaryTarget.id;
                        }
                        
                        if(primaryTarget == null) {
                            var secondaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                                filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE)}
                            });
                            if(secondaryTarget != null) {
                                creep.memory.depositTarget = secondaryTarget.id;
                            }
                        }
                    }
                    // If he knows where to deposit
                    if(Game.getObjectById(creep.memory.depositTarget) != null) {
                        // Then he tries to transfer and go there.
                        if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.depositTarget), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 5});
                        }
                    }
                }
                
                // If the creep is empty, he goes gathering !
                if(creep.carry[RESOURCE_ENERGY] == 0 && creep.ticksToLive > 150) {
                    creep.memory.gathering = true;
                }
            }
            
            // If the creep is not in his home, he gets back - this is EXPENSIVE
            if(creep.room.name != creep.memory.homeRoom) {
                var localExit = creep.room.findExitTo(creep.memory.homeRoom);
                creep.moveTo(creep.pos.findClosestByRange(localExit), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 5});
            }
        }
        
        // TO BE IMPROVED : if creep life just long enough to get back to base, then get back to base. don't wait to be full.
        
        // If the creep is gathering
        if(creep.memory.gathering == true) {
            // If he is in its target room
            if(creep.room.name == creep.memory.targetRoom) {
                // And is full, then we stop gathering. We set deposit target to null to reset it, in case link is full.
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                    creep.memory.gathering = false;
                    creep.memory.depositTarget = null;
                }
                
                // If we're under capacity
                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                    
                    // If we have no target or if it's empty, we do a compliacted rocade to find one.

                    // TO BE IMPROVED : each containuer, quantity minus creeps already attached to it
                    if(Game.getObjectById(creep.memory.containerTarget) == null || Game.getObjectById(creep.memory.containerTarget).store[RESOURCE_ENERGY] == 0) {
                        var maximumContained = 0;
                        var finalTarget = null;
                        var roomContainers = creep.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0)}
                            });
                        

                        if(roomContainers.length > 0) {
                            for(let i = 0; i < roomContainers.length; i++) {
                                var otherCreepsAttached = _.filter(Game.creeps, (otherCreep) => otherCreep.memory.role == 'longDistanceFastMover' && creep.room.name == otherCreep.room.name && otherCreep.memory.containerTarget == roomContainers[i].id);    
                                var result = 0;
                                for(let j = 0; j < otherCreepsAttached.length; j++) {
                                    result += (otherCreepsAttached[j].carryCapacity - otherCreepsAttached[j].carry[RESOURCE_ENERGY]);
                                }
                                
                                if(roomContainers[i].store[RESOURCE_ENERGY] > (maximumContained - result)) {
                                    maximumContained = roomContainers[i].store[RESOURCE_ENERGY];
                                    finalTarget = roomContainers[i];
                                }
                            }
                        }
                        
                        if(finalTarget != null) {
                            creep.memory.droppedEnergy = null;
                            creep.memory.containerTarget = finalTarget.id;
                        }
                        if(finalTarget == null) {
                            var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                            if(droppedEnergy != null ) {
                                creep.memory.containerTarget = null;
                                creep.memory.droppedEnergy = droppedEnergy.id;
                            }
                        }
                        
                    }
                    
                    // now we target our container to picup energy
                    if(Game.getObjectById(creep.memory.containerTarget) != null) {
                        if(creep.withdraw(Game.getObjectById(creep.memory.containerTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            if(creep.moveTo(Game.getObjectById(creep.memory.containerTarget), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 5, maxRooms: 1})== ERR_NO_PATH) {
                                creep.move(RIGHT);
                            }
                        }
                    }
                    // Or dropped energy if container is full
                    else if(Game.getObjectById(creep.memory.droppedEnergy) != null) {
                        if(creep.pickup(Game.getObjectById(creep.memory.droppedEnergy)) == ERR_NOT_IN_RANGE) {
                            if(creep.moveTo(Game.getObjectById(creep.memory.droppedEnergy), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 5, maxRooms: 1}) == ERR_NO_PATH) {
                                creep.move(RIGHT);
                            }
                        }
                    }
                }
            }
            
            // And if we're not in our target room, we move towards it.
            if(creep.room.name != creep.memory.targetRoom) {
                
        		let targetEnergySourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
                creep.moveTo(targetEnergySourcePos);                
            }
            
        }
    }
};


module.exports = longDistanceFastMover;