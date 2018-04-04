// Used to define the memory " targetRefill" of a creep which needs to withdraw energy
// For instance, an upgrader or a builder
// This should allow a better control over withdrawing source, especially over increase of the controller level, for all such creeps


var withdrawSource = {
    run: function(creep) {

                creep.memory.targetRefill = null;
        var spawningPoints = creep.room.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_SPAWN}} );


        // Control variable : if set to true, if
        // 1. All containers and storage are empty OR
        // 2. There is no container in the room,
        // Then we will withdraw from spawns and extensions
        // The goal of this mechanism is to allow the very first buildings to be build, when creating the room.
        var takeFromSpawnAndExtensionsIfNeeded = true;
        if(creep.room.energyAvailable > 1000) {
           takeFromSpawnAndExtensionsIfNeeded = true;
        }
        // We first manage the case of not having any targetRefill in memory
       if(Game.getObjectById(creep.memory.targetRefill) == null) {

           var primaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
               filter: (i) => (i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) &&
                              i.store[RESOURCE_ENERGY] > 0
           });
           if(primaryTarget != null) {
               creep.memory.targetRefill = primaryTarget.id;
           }
           // If we did not find storage,then we search a container
           if(primaryTarget == null) {
                // Carfeull here : not FIND_MY_STRUCTURES, but FIND_STRUCTURES, as containers do not belong to anyone
                var secondaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                                   i.store[RESOURCE_ENERGY] > 0
                    });
                if(secondaryTarget != null) {
                    creep.memory.targetRefill = secondaryTarget.id;
                }
                // No container, then we try extensions and spawn iff no harvesters needed and control variable to Y and there's no container
                if(secondaryTarget == null) {
                    if(creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTAINER}).length == 0 && takeFromSpawnAndExtensionsIfNeeded) {
                        var tertiaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_SPAWN) && structure.energy > 0;
                            }
                        });
                        if(tertiaryTarget != null) {
                            creep.memory.targetRefill = tertiaryTarget.id;
                        }
                    }
                }
            }
        }

        // Now if we already have one, we'll have to go through each "empty" case to find a new one
        if(Game.getObjectById(creep.memory.targetRefill) != null) {

            // For containers and storage
            if(Game.getObjectById(creep.memory.targetRefill).structureType == STRUCTURE_CONTAINER || Game.getObjectById(creep.memory.targetRefill).structureType == STRUCTURE_STORAGE) {
                // We have to use the ".store[RESOURCE_ENERGY]"
                if(Game.getObjectById(creep.memory.targetRefill).store[RESOURCE_ENERGY] == 0) {
                    var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                       filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                                      i.store[RESOURCE_ENERGY] > 0
                   });
                   if(primaryTarget != null) {
                       creep.memory.targetRefill = primaryTarget.id;
                   }

                   if(primaryTarget == null) {
                        // Carfeull here : not FIND_Y_STRUCTURES, but FIND_STRUCTURES, as containers do not belong to anyone
                        var secondaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                                           i.store[RESOURCE_ENERGY] > 0
                            });
                        if(secondaryTarget != null) {
                            creep.memory.targetRefill = secondaryTarget.id;
                        }
                        if(secondaryTarget == null) {
                            if(creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTAINER}).length == 0 && takeFromSpawnAndExtensionsIfNeeded) {
                                var tertiaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                                structure.structureType == STRUCTURE_SPAWN) && structure.energy > 0;
                                    }
                                });
                                if(tertiaryTarget != null) {
                                    creep.memory.targetRefill = tertiaryTarget.id;
                                }
                            }
                        }
                    }
                }
            }

            // For spawns and extensions
            if(Game.getObjectById(creep.memory.targetRefill).structureType == STRUCTURE_SPAWN || Game.getObjectById(creep.memory.targetRefill).structureType == STRUCTURE_EXTENSION) {
                // We have to use the ".energy"
                if(Game.getObjectById(creep.memory.targetRefill).energy == 0) {
                    var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                       filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                                      i.store[RESOURCE_ENERGY] > 0
                   });
                   if(primaryTarget != null) {
                       creep.memory.targetRefill = primaryTarget.id;
                   }

                   if(primaryTarget == null) {
                        // Carfeull here : not FIND_Y_STRUCTURES, but FIND_STRUCTURES, as containers do not belong to anyone
                        var secondaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                                           i.store[RESOURCE_ENERGY] > 0
                            });
                        if(secondaryTarget != null) {
                            creep.memory.targetRefill = secondaryTarget.id;
                        }
                        if(secondaryTarget == null) {
                            if(creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTAINER}).length == 0 && takeFromSpawnAndExtensionsIfNeeded) {
                                var tertiaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                                structure.structureType == STRUCTURE_SPAWN) && structure.energy > 0;
                                    }
                                });
                                if(tertiaryTarget != null) {
                                    creep.memory.targetRefill = tertiaryTarget.id;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = withdrawSource;
