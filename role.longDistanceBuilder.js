// Long distance builder role. Memory "targetRoom" and "homeRoom".
// If fills itself on a container in homeRoom
// Then goes on the targetRoom, and builds whatever is there, by feeding itself on the local energy source


var withdrawSource = require('get.withdrawSource');

var freeSpotsOfSource = require('get.freeSpotsOfSource');

module.exports = {
    run: function(creep) {
        
        // If we are in the target room
        if(creep.room.name == creep.memory.targetRoom) {
            // Reset the pickup from home room, just in case
            
            // If we are in the "building" mindset
            if(creep.memory.building) {
                // While we have some energy
                if(creep.carry[RESOURCE_ENERGY] > 0) {
                    // If we do not have a building target
                    if(Game.getObjectById(creep.memory.targetBuilding) == null || Game.getObjectById(creep.memory.targetBuilding).progressTotal == Game.getObjectById(creep.memory.targetBuilding).progress ){
                        // We find the closest one
                        var primaryTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: function(object) {return object.structureType == STRUCTURE_SPAWN}});
                        // console.log(buildingPotentialTarget)
                        if(primaryTarget != null) {
                            creep.memory.targetBuilding = primaryTarget.id;
                        }
                        if(primaryTarget == null) {
                            var secondaryTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                            // console.log(buildingPotentialTarget)
                            if(secondaryTarget != null) {
                                creep.memory.targetBuilding = secondaryTarget.id;
                            }
                            if(secondaryTarget == null) {
                                // Is an issue : home room was spamming creeps to compensate this
                                // creep.memory.role = 'harvester';
                            }
                        }
                    }
                    
                    else {
                        if(creep.build(Game.getObjectById(creep.memory.targetBuilding)) == ERR_NOT_IN_RANGE ) {
                            creep.moveTo(Game.getObjectById(creep.memory.targetBuilding));
                        }
                    }                  
                }
                


                // If we do not have any energy left
                if(creep.carry[RESOURCE_ENERGY] == 0) {
                    // we stop building
                    creep.memory.building = false;
                    creep.memory.targetEnergy = null;
                    creep.memory.targetSource = null;
                }
            }
            
            // If we are not in the "building" mindset
            if(!creep.memory.building) {
                
                //  If we are below capacity
                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                     // If we have no source to harvest from, we get one
                    if(creep.memory.targetSource == null || Game.getObjectById(creep.memory.targetSource).energy == 0) {
                        // We find the closest
                        var potentialTarget = creep.pos.findClosestByPath(FIND_SOURCES, {
                            filter: (source) => {return (source.energy > 0 && freeSpotsOfSource.run(source) >= 0)}
                        });
                        // If it exist
                        if(potentialTarget != null) {
                            // We attach it
                            creep.memory.targetSource = potentialTarget.id;
                        }                            
                        else {
                            var otherTargets = creep.room.find(FIND_SOURCES);
                            if(otherTargets.length > 0) {
                                for(let i = 0; i < otherTargets.length; i++) {
                                    if(freeSpotsOfSource.run(otherTargets[i]) >= 0) {
                                        creep.memory.targetSource = otherTargets[i].id;
                                    }
                                }
                            }
                        }
                    }
                    if(creep.memory.targetEnergy == null || Game.getObjectById(creep.memory.targetEnergy) == undefined) {
                        var testTarget = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY , {filter: function(object) {return object.amount >= 100}});
                        if(testTarget != null) {
                            creep.memory.targetEnergy = testTarget.id;
                        }
                    }
                
                    // If we have a source to harvest
                    if(Game.getObjectById(creep.memory.targetEnergy) == null && Game.getObjectById(creep.memory.targetSource) != null) {
                        // If we are too far to harvest
                        if(creep.harvest(Game.getObjectById(creep.memory.targetSource)) == ERR_NOT_IN_RANGE) {
                            // We move toward the source
                            creep.moveTo(Game.getObjectById(creep.memory.targetSource));
                        }
                    }
                    
                    // But we could simply also have some dropped energy to pickup...
                    if(Game.getObjectById(creep.memory.targetEnergy) != null) {
                        if(creep.pickup(Game.getObjectById(creep.memory.targetEnergy)) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.targetEnergy));
                        }
                    }
                }
                // If we are full of energy
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                    // We start building
                    creep.memory.building = true;
                }

            }
        }
        
        if(creep.room.name != creep.memory.originRoom && creep.room.name != creep.memory.targetRoom) {
            var localExit = creep.room.findExitTo(creep.memory.targetRoom);
            // And we move towards our target !
            creep.moveTo(creep.pos.findClosestByRange(localExit));
        }
        
        // And if we are in our home room
        if(creep.room.name == creep.memory.originRoom) {
                    console.log('here, ress carry ' + creep.carry[RESOURCE_ENERGY] + 'capacity' + creep.carryCapacity )
            // If we are not full of energy
            if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                creep.memory.building = false;
                creep.memory.targetSource = null;
                creep.memory.targetBuilding = null;
                // If we have nowhere to pickup some
                withdrawSource.run(creep);
                
                // If we have a target to pickup
                if(Game.getObjectById(creep.memory.targetRefill) != null) {
                    // We try to pickup from there
                    if(creep.withdraw(Game.getObjectById(creep.memory.targetRefill), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // And if we are too far, we go towards it
                        creep.moveTo(Game.getObjectById(creep.memory.targetRefill));
                    }
                }
            }
            
            // Now, if we are full of energy
            if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
                console.log('looking for exit ' + creep.name)
                // We find the closest exit towards target room
                var localExit = creep.room.findExitTo(creep.memory.targetRoom);
                // And we move towards our target !
                creep.moveTo(creep.pos.findClosestByRange(localExit));
            }
        }
    }

};