/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('get.depositTargetUnderlying');
 * mod.thing == 'a thing'; // true
 */
 
 var depositTargetUnderlying = {
     run: function(creep) {
        
        var activateLog = false;
        
        // Control variables leting us set the maximum in each type of storage before moving on to the extensions and spawn
        let maximumFillingOfContainer = 1750;
        let maximumFillingOfStorageOne = 37500; 
        let maximumFillingOfStorageTwo = 650000;
        let maximumFillingOfTerminal = 20000;
        // keeping this high should ensure us that when spawning an upgrader creep, we will have enough to feed him for a loong time.
        // MUST BE ALIGNED WITH THE SAME CONSTANT IN DEPOSITTARGET
        
        var mainTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if(mainTarget != null) {
            if(activateLog) {
                console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null main target, ' + mainTarget)
            }
            creep.memory.depositTarget = mainTarget.id;
        }
        
        
        else {
            var secondaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            if(secondaryTarget != null) {
                if(activateLog) {
                    console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null secondary target, ' + secondaryTarget)
                }
                creep.memory.depositTarget = secondaryTarget.id;            
            }
            
            else {
                var tertiaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER)   && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && structure.store[RESOURCE_ENERGY] < maximumFillingOfContainer;
                    }
                });
                
                if(tertiaryTarget != null) {
                    if(activateLog) {
                        console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null tertiary target, ' + tertiaryTarget)
                    }
                    creep.memory.depositTarget = tertiaryTarget.id;                    
                }
                
                else {
                    var quatriTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && structure.store[RESOURCE_ENERGY] < maximumFillingOfStorageOne;
                            }
                    });
                    
                    if(quatriTarget != null) {
                        if(activateLog) {
                            console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null quatri target, ' + quatriTarget)
                        }
                        creep.memory.depositTarget = quatriTarget.id;                      
                    }
                    
                    else {
                        var quintoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_TERMINAL) && structure.store[RESOURCE_ENERGY] < maximumFillingOfTerminal;
                                }
                        });
                        
                        if(quintoTarget != null) {
                            if(activateLog) {
                                console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null quinto target, ' + quintoTarget)
                            }
                            creep.memory.depositTarget = quintoTarget.id;    
                        }
                        else {
                            var quintoDotFiveTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_POWER_SPAWN) && structure.energy < structure.energyCapacity;
                                }
                            });
                            
                            if(quintoDotFiveTarget != null) {
                                if(activateLog) {
                                    console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null quinto dot five target, ' + quintoDotFiveTarget)
                                }
                                creep.memory.depositTarget = quintoDotFiveTarget.id;   
                                
                            }
                        
                            else {
                                var sextoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_NUKER)   && structure.energy < structure.energyCapacity;
                                    }
                                });
                                if(sextoTarget != null ) {
                                    if(activateLog) {
                                        console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null sexto target, ' + sextoTarget)
                                    }
                                    creep.memory.depositTarget = sextoTarget.id;        
                                }
                                else {
                                    var septoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_STORAGE)   && structure.store[RESOURCE_ENERGY] < maximumFillingOfStorageTwo;
                                        }
                                    });
                                
                                    if(septoTarget != null) {
                                        if(activateLog) {
                                            console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null septo target, ' + septoTarget)
                                        }
                                        creep.memory.depositTarget = septoTarget.id;    
                                    }
                                    else {
                                        var octoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                        filter: (structure) => {
                                            return (structure.structureType == STRUCTURE_TERMINAL)   && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                                            }
                                        });
                                        if(octoTarget != null) {
                                            if(activateLog) {
                                                console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null octo target, ' + octoTarget)
                                            }
                                            creep.memory.depositTarget = octoTarget.id;    
                                        }
                                        
                                        
                                    
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
     }
 };

module.exports = depositTargetUnderlying;