
var withdrawSource = require('get.withdrawSource');

var roleRepairer = {
    run: function(creep) {

        var activateLog = false;

        var maxHPtable = [1000, 5000, 10000, 15000, 35000, 50000, 75000, 100000, 125000,150000,175000/*,200000,225000,250000,275000,300000*/];


        if(creep.memory.repairing == null) {
            creep.memory.repairing = false;
        }

        if(creep.memory.building == null) {
            creep.memory.building = false;
        }

        // Repairer should only build walls or remparts. If we are building,
	    if(creep.memory.building) {
	        // If there are some construction sites for rampart or walls
	        var potentialBuildingTargets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_ROAD});
    	    if(potentialBuildingTargets != null) {
    	        // Then we set the building target.

                creep.memory.targetBuild = potentialBuildingTargets.id;
            }

            // Now, if there is a building target,
            if(creep.memory.targetBuild != null) {
                // We build it.
                if(creep.build(Game.getObjectById(creep.memory.targetBuild)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.targetBuild));
                }
            }

            // If we have no energy or no building target, we go refill.
            if(creep.carry[RESOURCE_ENERGY] == 0 || creep.memory.targetBuild == null /*|| Game.getObjectById(creep.memory.targetBuild).progress == Game.getObjectById(creep.memory.targetBuild).progressTotal*/) {
                creep.say('Gathering');
                creep.memory.repairing = false;
                creep.memory.building = false;
                creep.memory.targetRefill = null;
                creep.memory.targetRepair = null;
                creep.memory.targetBuild = null;
            }

            // If there are no construction sites, but we still have some energy, we go repair.
            if(creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_ROAD}).length == 0 && creep.carry[RESOURCE_ENERGY] > 0) {
                creep.say('Repairing');
                creep.memory.repairing = true;
                creep.memory.building = false;
                creep.memory.targetRefill = null;
                creep.memory.targetRepair = null;
                creep.memory.targetBuild = null;
            }
        }


	    // Now if we are repairing
	    if(creep.memory.repairing) {
            // -----------------LOOK FOR REPAIRING TARGET





            if(Game.getObjectById(creep.memory.targetRepair) == null) {
                // First we take our structures to repair them, but not the controller or the ramparts
                var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER  && s.structureType != STRUCTURE_RAMPART)})
	            if(primaryTarget != null){
	                creep.memory.targetRepair = primaryTarget.id
	                if(activateLog) {
    	                console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing primaryTarget ' + primaryTarget)
	                }

	            }
                if(primaryTarget == null) {
                    var primaryDotFiveTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < 350  && (s.structureType == STRUCTURE_WALL ||s.structureType == STRUCTURE_RAMPART))});
                    if(primaryDotFiveTarget != null) {
                        creep.memory.targetRepair = primaryDotFiveTarget.id;
	                    if(activateLog){
    	                    console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing primaryDotFiveTarget' + primaryDotFiveTarget)

	                    }
                    }


                    if(primaryDotFiveTarget == null) {
    	                // And if all our structures are fine, then we repair the rest - roads for instance - but still not walls or ramparts
                        var secondaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax  && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)});
                        if(secondaryTarget != null){
                            creep.memory.targetRepair = secondaryTarget.id;
                            if(activateLog) {
    	                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing secondaryTarget ' + secondaryTarget)
                            }

    	                }
    	                // If everything is ok, we look at walls and ramparts
        	            if(secondaryTarget == null) {
        	                creep.memory.targetRepair = null;
        	                //----------- Then remparts and walls under maxHPtable[i] HP
    	                    for(let i = 0; i<maxHPtable.length && Game.getObjectById(creep.memory.targetRepair) == null; i++) {
        	                    var potentialTargetRampart = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < maxHPtable[i]  && s.structureType == STRUCTURE_RAMPART)});
                                if(potentialTargetRampart != null){
	                                creep.memory.targetRepair = potentialTargetRampart.id;
	                                if(activateLog) {
    	                                console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing rampart ' + potentialTargetRampart + ', on iteration ' + i + ', with maxHP ' + maxHPtable[i])

	                                }
                                }

    	                        if(potentialTargetRampart == null) {
    	                            var potentialTargetWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < maxHPtable[i]  && s.structureType == STRUCTURE_WALL)});
	                                if(potentialTargetWall != null) {
            	                        creep.memory.targetRepair = potentialTargetWall.id;
	                                    if(activateLog) {
	                                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing wall ' + potentialTargetWall + ', on iteration ' + i + ', with maxHP ' + maxHPtable[i])
	                                    }
	                                }
    	                        }
	                        }
    	                }
    	            }
                }
            }

            // If we already have a target
            if(Game.getObjectById(creep.memory.targetRepair) != null) {
                // But it is full of HP
                if(Game.getObjectById(creep.memory.targetRepair).structureType != STRUCTURE_WALL && Game.getObjectById(creep.memory.targetRepair).structureType != STRUCTURE_RAMPART) {
                    if(activateLog) {
                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', target : ' + Game.getObjectById(creep.memory.targetRepair) + ',hits : ' + Game.getObjectById(creep.memory.targetRepair).hits + ', hitsmax :' + Game.getObjectById(creep.memory.targetRepair).hitsMax)
                    }
                    if(Game.getObjectById(creep.memory.targetRepair).hits == Game.getObjectById(creep.memory.targetRepair).hitsMax) {
                        // First we take our structures to repair them, but not the controller or the ramparts
                        var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER  && s.structureType != STRUCTURE_RAMPART)})

	                    if(primaryTarget != null){
	                        creep.memory.targetRepair = primaryTarget.id;
	                        if(activateLog) {
    	                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing primaryTarget ' + primaryTarget)
                            }
                        }
                        if(primaryTarget == null) {
                            var primaryDotFiveTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < 350  && (s.structureType == STRUCTURE_WALL ||s.structureType == STRUCTURE_RAMPART))});

                            if(primaryDotFiveTarget != null) {
                                creep.memory.targetRepair = primaryDotFiveTarget.id;
                                if(activateLog) {
    	                            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing primaryDotFiveTarget' + primaryDotFiveTarget)
                                }
                            }

                            if(primaryDotFiveTarget == null) {
	                            // And if all our structures are fine, then we repair the rest - roads for instance - but still not walls or ramparts
                                var secondaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax  && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)});


                                if(secondaryTarget != null){
                                    creep.memory.targetRepair = secondaryTarget.id;
                                    if(activateLog) {
        	                            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing secondaryTarget ' + secondaryTarget)
                                    }
        	                    }
    	                        // If everything is ok, we look at walls and ramparts
        	                    if(secondaryTarget == null) {
        	                        creep.memory.targetRepair = null;
        	                        //----------- Then remparts and walls under maxHPtable[i] HP
            	                    for(let i = 0; i<maxHPtable.length && Game.getObjectById(creep.memory.targetRepair) == null; i++) {
        	                        // console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', in loop for i ' + i + ', maxHPtable.length : ' + maxHPtable.length + ', Game.getObjectById(creep.memory.targetRepair) ' + Game.getObjectById(creep.memory.targetRepair))
                	                    var potentialTargetRampart = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < maxHPtable[i]  && s.structureType == STRUCTURE_RAMPART)});
                                        if(potentialTargetRampart != null){
	                                        creep.memory.targetRepair = potentialTargetRampart.id;
	                                        if(activateLog) {
    	                                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing rampart ' + potentialTargetRampart + ', on iteration ' + i + ', with maxHP ' + maxHPtable[i])
            	                            }
                                        }
        	                            if(potentialTargetRampart == null) {
	                                        var potentialTargetWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < maxHPtable[i]  && s.structureType == STRUCTURE_WALL)});
	                                        if(potentialTargetWall != null) {
        	                                    creep.memory.targetRepair = potentialTargetWall.id;
        	                                    if(activateLog) {
            	                                    console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing wall ' + potentialTargetWall + ', on iteration ' + i + ', with maxHP ' + maxHPtable[i])
        	                                    }
        	                                }
    	                                }
	                                }
        	                    }
    	                    }
    	                }
                    }
                }
            if(Game.getObjectById(creep.memory.targetRepair) != undefined) {
                if(Game.getObjectById(creep.memory.targetRepair).structureType == STRUCTURE_WALL || Game.getObjectById(creep.memory.targetRepair).structureType == STRUCTURE_RAMPART) {
                    if(Game.getObjectById(creep.memory.targetRepair).hits > 1000) {
                        // First we take our structures to repair them, but not the controller or the ramparts
                        var primaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER  && s.structureType != STRUCTURE_RAMPART)})

	                    if(primaryTarget != null){
	                        creep.memory.targetRepair = primaryTarget.id;
	                        if(activateLog) {
    	                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing primaryTarget ' + primaryTarget)
                            }
                        }
                        if(primaryTarget == null) {
                            var primaryDotFiveTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < 350  && (s.structureType == STRUCTURE_WALL ||s.structureType == STRUCTURE_RAMPART))});

                            if(primaryDotFiveTarget != null) {
                                creep.memory.targetRepair = primaryDotFiveTarget.id;
                                if(activateLog) {
    	                            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing primaryDotFiveTarget' + primaryDotFiveTarget)
                                }
                            }

                            if(primaryDotFiveTarget == null) {
	                            // And if all our structures are fine, then we repair the rest - roads for instance - but still not walls or ramparts
                                var secondaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax  && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)});


                                if(secondaryTarget != null){
                                    creep.memory.targetRepair = secondaryTarget.id;
                                    if(activateLog) {
        	                            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing secondaryTarget ' + secondaryTarget)
                                    }
        	                    }
    	                        // If everything is ok, we look at walls and ramparts
        	                    if(secondaryTarget == null) {
        	                        creep.memory.targetRepair = null;
        	                        //----------- Then remparts and walls under maxHPtable[i] HP
            	                    for(let i = 0; i<maxHPtable.length && Game.getObjectById(creep.memory.targetRepair) == null; i++) {
        	                        // console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', in loop for i ' + i + ', maxHPtable.length : ' + maxHPtable.length + ', Game.getObjectById(creep.memory.targetRepair) ' + Game.getObjectById(creep.memory.targetRepair))
                	                    var potentialTargetRampart = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < maxHPtable[i]  && s.structureType == STRUCTURE_RAMPART)});
                                        if(potentialTargetRampart != null){
	                                        creep.memory.targetRepair = potentialTargetRampart.id;
	                                        if(activateLog) {
        	                                    console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing rampart ' + potentialTargetRampart + ', on iteration ' + i + ', with maxHP ' + maxHPtable[i])

	                                        }
                                        }
        	                            if(potentialTargetRampart == null) {
	                                        var potentialTargetWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < maxHPtable[i]  && s.structureType == STRUCTURE_WALL)});
	                                        if(potentialTargetWall != null) {
        	                                    creep.memory.targetRepair = potentialTargetWall.id;
        	                                    if(activateLog) {
        	                                        console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing wall ' + potentialTargetWall + ', on iteration ' + i + ', with maxHP ' + maxHPtable[i])
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
            }


            // --------------------------- GOING TO REPAIR

            if(Game.getObjectById(creep.memory.targetRepair) != null) {
                if(creep.repair(Game.getObjectById(creep.memory.targetRepair)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.targetRepair), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }

            // -------------------------- NO ENERGY => BACK GET SOME

            if(creep.carry[RESOURCE_ENERGY] == 0) {
                creep.say('Gathering');
                creep.memory.repairing = false;
                creep.memory.building = false;
                creep.memory.targetRefill = null;
                creep.memory.targetRepair = null;
                creep.memory.targetBuild = null;
            }
            if(creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_ROAD}).length > 0) {
	            creep.say('BuildingW');
                creep.memory.building = true;
                creep.memory.repairing = false;
            }

	    }


        // --------------------------------------- IF NOT REPAIRING, GATHERING ENERGY

        if(!creep.memory.repairing && !creep.memory.building) {
            withdrawSource.run(creep);

            if(Game.getObjectById(creep.memory.targetRefill) != null) {
                if(creep.withdraw(Game.getObjectById(creep.memory.targetRefill),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.targetRefill));
                }
            }



            if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {

                creep.memory.targetRefill = null;
                creep.memory.targetRepair = null;
                creep.memory.targetBuild = null;

                if(creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL}).length > 0) {
	                creep.say('BuildingW');
                    creep.memory.building = true;
                    creep.memory.repairing = false;
                }
                else {
	                creep.say('Repairing');
                    creep.memory.building = false;
                    creep.memory.repairing = true;
                }
            }
        }


    }

};

module.exports = roleRepairer;
