var freeFatSpotsOfSource = require('get.freeFatSpotsOfSource');
var workPartsNeededOfSource = require('get.workPartsNeededOfSource');
var underAttackCreepMemory = require('info.underAttackCreepMemory');


/*
Concept :
1.  Get to target room
2.  Find a source with spots
3.  Go to source
4.  Find a container near source
5.  If non-existant, build one by harvesting the source
6.  Put creep on container, harvest and repair container
*/


var longDistanceFatHarvester = {
    run: function(creep) {

        underAttackCreepMemory.run(creep);

        // Step 0 : we check that we do have a target room
        if(creep.memory.targetRoom == null || creep.memory.targetRoom == undefined) {
            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', ISSUE : NO TARGET ROOM');
        }


        // If we do have one
        else {
            // Step 1 : we get to the target room
            if(creep.room.name != creep.memory.targetRoom) {
                var localExit = creep.room.findExitTo(creep.memory.targetRoom);
                // console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', not in target toom, target : ' + creep.memory.targetRoom + ', move : ' + creep.moveTo(creep.pos.findClosestByRange(localExit), {visualizePathStyle: {stroke: '#ffbc11'}, reusePath: 5}))
                creep.moveTo(creep.pos.findClosestByRange(localExit), {visualizePathStyle: {stroke: '#ffbc11'}, reusePath: 10});
            }

            // Step 1 : complete
            if(creep.room.name == creep.memory.targetRoom) {
                // Step 2 : find a source target
                if(Game.getObjectById(creep.memory.attachedSource) == undefined) {
                    var potentialSource = null;
//                    if(creep.room.controller.reservation.username == 'Blaugaard') {
                        // Then we look for the closest source with free spots, no ennemy, and needing at least as many work parts as we have
      //                  potentialSource = creep.pos.findClosestByPath(FIND_SOURCES, {
        //                    filter: (source) => {
          //                  return (freeFatSpotsOfSource.run(source) > 0 && workPartsNeededOfSource.run(source) >= counterOfCurrentWorkBodyParts)}
            //            });
  //                  }
    //                if(creep.room.controller.reservation == null) {
                        potentialSource = creep.pos.findClosestByPath(FIND_SOURCES, {
                            filter: (source) => {
                            return (freeFatSpotsOfSource.run(source) > 0 && workPartsNeededOfSource.run(source) > 0)}
                        });
        //            }

                    // ISSUE HERE : WE DO NOT FIND TARGETS CORRECTLY

                    // If there is one, we attach it.
                    if(potentialSource != null) {
                        // On trouve une source : on l'attache.
                        creep.memory.attachedSource = potentialSource.id;
                    }
                }

                // Step 2 : complete - We need to have a container attached, so we look for one close to the target source one we're near it
                if(Game.getObjectById(creep.memory.attachedContainer) == null && Game.getObjectById(creep.memory.attachedSource) != undefined) {

                    // Step 3 : go to source
                    if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.attachedSource).pos) > 1) {
                        creep.moveTo(Game.getObjectById(creep.memory.attachedSource), {visualizePathStyle: {stroke: '#ffbc11'}, reusePath: 3, maxRooms: 1});

                    }

                    // Step 4 : get container
                    if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.attachedSource).pos) <= 1) {
                        // But we only look for one if there are no construction sites attached  -which would be our container, being build !
                        if(Game.getObjectById(creep.memory.attachedConstructionContainer) == null) {
                            // We look for the closest close container
                            var potentialContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.pos.getRangeTo(creep) <= 2)}});
                            // If thre is one

                            if(potentialContainer != null) {
                                // We secure that it is close enough from the source (in order to be here, we already need to be close enough to source to harvest)
                                if(creep.pos.x != potentialContainer.pos.x || creep.pos.y != potentialContainer.pos.y) {
                                    creep.moveTo(potentialContainer.pos);
                                }
                                if(creep.pos.x == potentialContainer.pos.x && creep.pos.y == potentialContainer.pos.y) {
                                    creep.memory.attachedContainer = potentialContainer.id;
                                    creep.memory.attachedConstructionContainer = null;
                                    creep.memory.building = false;
                                }

                            }

                            // The previous IF told us that we were close enough from the attached source to harvest it,
                            // So if we create a construction site here, it will be OK to put the creep over it to harvest.
                            // If there is no container close enough, and no construction site near
                            if(potentialContainer == null) {
                                // We automatically create a dedicated construction site
                                creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
                                creep.memory.attachedConstructionContainer = creep.pos.findInRange(FIND_CONSTRUCTION_SITES,1)[0].id;
                            }
                        }

                        // Step 5 : if there is none, build one
                        if(Game.getObjectById(creep.memory.attachedConstructionContainer) != null && Game.getObjectById(creep.memory.attachedContainer) == null) {

                            var closeEnnemies = Game.getObjectById(creep.memory.attachedConstructionContainer).pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                            if(closeEnnemies.length == 0 || creep.getActiveBodyparts(ATTACK) == 0) {
                                // Launching the building logic
                                if(creep.memory.building == undefined) {
                                    creep.memory.building = false;
                                }
                                if(Game.getObjectById(creep.memory.attachedConstructionContainer) == undefined) {
                                    creep.memory.attachedConstructionContainer = null;
                                }

                                // If we are building
                                if(creep.memory.building) {
                                    // While we have energy, we build
                                    if(creep.carry.energy > 0) {
                                        if(creep.build(Game.getObjectById(creep.memory.attachedConstructionContainer)) == ERR_NOT_IN_RANGE) {
                                            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', ISSUE : WE SEEM TOO FAR FOR CONSTRUCTION SITE ' + creep.memory.attachedConstructionContainer);
                                        }
                                    }
                                    // No energy, we stop building
                                    if(creep.carry.energy == 0) {
                                        creep.say('Mining')
                                        creep.memory.building = false;
                                    }
                                }

                                // If we are not building
                                if(!creep.memory.building) {
                                    // If we are under capactiy, we harvest
                                    if(creep.carry.energy < creep.carryCapacity) {
                                        if(creep.harvest(Game.getObjectById(creep.memory.attachedSource)) == ERR_NOT_IN_RANGE) {
                                            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', ISSUE : WE SEEM TOO FAR FROM SOURCE ' + creep.memory.attachedSource + ' TO HARVEST TO BUILD CONTAINER');
                                        }
                                    }
                                    // If we are at capacity, we start building
                                    if(creep.carry.energy == creep.carryCapacity) {
                                        creep.say('Building')
                                        creep.memory.building = true;
                                    }
                                }
                            }

                            if(closeEnnemies.length > 0 && creep.getActiveBodyparts(ATTACK) > 0) {
                                creep.say('⚔️')
                                if(creep.attack(closeEnnemies[0]) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(closeEnnemies[0],{visualizePathStyle: {stroke: '#00ffff'}});
                                }
                            }
                        }
                    }
                }

                // Now, if we have a source and an attached controller, we can harvest and repair it from time to time - kinda the easy part
                if(Game.getObjectById(creep.memory.attachedContainer) != null && Game.getObjectById(creep.memory.attachedSource) != null) {

                    var closeEnnemies = Game.getObjectById(creep.memory.attachedContainer).pos.findInRange(FIND_HOSTILE_CREEPS, 4);

                    if(closeEnnemies.length == 0 || creep.getActiveBodyparts(ATTACK) == 0 || creep.moveTo(closeEnnemies[0]) == ERR_NO_PATH) {
                        // First things first : we need to be over it to create canned energy
                        if(creep.pos.x != Game.getObjectById(creep.memory.attachedContainer).pos.x || creep.pos.y != Game.getObjectById(creep.memory.attachedContainer).pos.y) {
                            creep.moveTo(Game.getObjectById(creep.memory.attachedContainer).pos, {visualizePathStyle: {stroke: '#ffbc11'}, reusePath: 5});
                        }

                        if(creep.memory.repairing == undefined) {
                            creep.memory.repairing = false;
                        }


                        if(creep.memory.repairing) {
                            if(creep.carry[RESOURCE_ENERGY] > 0) {
                                if(Game.getObjectById(creep.memory.attachedContainer).hits < Game.getObjectById(creep.memory.attachedContainer).hitsMax) {
                                    creep.say('Repairing');
                                    if(creep.repair(Game.getObjectById(creep.memory.attachedContainer)) == ERR_NOT_IN_RANGE) {
                                        console.log('Room ' + creep.room.name+ ', creep ' + creep.name + ', ISSUE : NEED REPAIR ATTACHED CONTAINER, BUT TOO FAR')
                                    }
                                }
                            }

                            if(creep.carry[RESOURCE_ENERGY] == 0 || Game.getObjectById(creep.memory.attachedContainer).hits == Game.getObjectById(creep.memory.attachedContainer).hitsMax) {
                                creep.say('Mining')
                                creep.memory.repairing = false;
                            }
                        }

                        if(!creep.memory.repairing) {
                            if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                                if(Game.getObjectById(creep.memory.attachedContainer).hits < Game.getObjectById(creep.memory.attachedContainer).hitsMax) {
                                    creep.say('Repairing')
                                    creep.memory.repairing = true;
                                }
                            }
                            creep.say('Mining')
                            if(creep.harvest(Game.getObjectById(creep.memory.attachedSource)) == ERR_NOT_IN_RANGE) {
                                console.log('Room ' + creep.room.name+ ', creep ' + creep.name + ', ISSUE : NEED HARVEST ATTACHED SOURCE, BUT TOO FAR')
                            }
                        }
                    }
                    if(closeEnnemies.length > 0 && creep.getActiveBodyparts(ATTACK) > 0 && creep.moveTo(closeEnnemies[0]) != ERR_NO_PATH) {
                        creep.say('Fighting')
                        creep.drop(RESOURCE_ENERGY);
                        if(creep.attack(closeEnnemies[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closeEnnemies[0],{visualizePathStyle: {stroke: '#00ffff'}});
                        }
                    }
                }
            }
        }



    }
};

module.exports = longDistanceFatHarvester;
