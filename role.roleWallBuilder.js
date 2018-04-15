
var withdrawSource = require('get.withdrawSource');

/*
Concept explanation :
 - This creep aims to get walls and ramparts up to a target HP level, to defend the room.
 - It uses energy as per "withdrawSource" function
 - It :
	1. First gets existing ramparts up to the desired level
	2. Then build construction sites for additional ramparts (note that once built, they will fall under 1 directly)
	3. Then build construction sites for walls, and keep them all 1HP
	4. Then finally get walls HP up to desired level, one by one, without spreading the effort.
 - This, while perpetually checking that ramparts remain at a percentage of the desired level

 The "desired level" is a formula the played can change
 The "rampart decaying tolerance" is also a parameter available.
*/


var roleWallBuilder = {
    run: function(creep) {
		let roomLevel = creep.room.controller.level;
		
		// Parameters changeable by player
		let activateLog = true;
		// This is the level the walls and ramparts will be reaching. 
		// 0'640'000 at level 4
		// 1'250'000 at level 5
		// 2'160'000 at level 6
		// 3'430'000 at level 7
		// 5'120'000 at level 8.
		let workingTargetHPGoal = 10000 * roomLevel * roomLevel * roomLevel;
		// And we will repair target when they fall below this treshold
		let rampartTolerance = 0.75;
		
		
		// Variables used
		let wallsToBuild = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_WALL});
		let rampartsToBuild = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
		let rampartsOfRoom = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
		
		// If we do not know if we're gathering, we set the memory to true.
		if(creep.memory.gathering == undefined) {creep.memory.gathering = true;}
		
		
		// --------- Starting creep job -------------
		
		// If we are not gathering
		if(!creep.memory.gathering) {
			// While we have some energy
			if(creep.carry[RESOURCE_ENERGY] > 0) {
				// First we check the validity of our target
				let noTargetDefined = false;
				let targetFilled = false;
				let thereIsworstRampartDecayed = false;
				let worstRampartDecayed = 0;
				let worstRampartDecayedHP = 1000000000;
				
				// If we don't have one, we need one
				if(Game.getObjectById(creep.memory.workTarget) == undefined) {
					noTargetDefined = true;
				}
				// If we have one
				if(Game.getObjectById(creep.memory.workTarget) != undefined) {
					// If it's filled, we need a new one
					if(Game.getObjectById(creep.memory.workTarget).hits >= workingTargetHPGoal) {
						targetFilled = true;
					}
					// If our target type isn't a rampart, we better check that there's not one decaying somewhere
					if(Game.getObjectById(creep.memory.workTarget).structureType != STRUCTURE_RAMPART) {
						// We take all ramparts
						for(let rampartIndex = 0; rampartIndex < rampartsOfRoom.length; rampartIndex++) {
							// If we're below tolerance for one of them
							if(rampartsOfRoom[rampartIndex].hits < (workingTargetHPGoal * rampartTolerance)) {
								// We need a new target
								thereIsworstRampartDecayed = true;
								// We use the opportunity to find the most decayed rampart
								if(rampartsOfRoom[rampartIndex].hits < worstRampartDecayedHP) {
									worstRampartDecayed = rampartsOfRoom[rampartIndex].id;
									worstRampartDecayedHP = rampartsOfRoom[rampartIndex].hits;
								}
							}
						}
					}
				}
				
				// So, if needed we get a new working target
				if(noTargetDefined || targetFilled || thereIsworstRampartDecayed) {
					if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', we found that theres a need for new target. No target defined : ' + noTargetDefined + ', targetFilled : ' + targetFilled + ', rampart decayed ' + thereIsworstRampartDecayed);}
					
					// If we have a rampart decayed defined, we already found which one it is. It's gonna be the target.
					if(Game.getObjectById(worstRampartDecayed) != undefined) {
						creep.memory.workTarget = worstRampartDecayed;
						if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', rampart decayed : ' + thereIsworstRampartDecayed + ', target selected ' + creep.memory.workTarget + ', pos ' + Game.getObjectById(creep.memory.workTarget).pos + ', hits : ' + Game.getObjectById(creep.memory.workTarget).hits + '/' + workingTargetHPGoal);}
					}
					// If it's not the rampart decaying thing that got us here
					else {
						// If we have ramparts to build, we build it. It's gonna fall under "ramparts to build" straight after as target.
						if(rampartsToBuild.length > 0) {
							creep.memory.workTarget = rampartsToBuild[0].id;
							if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', rampart to build : ' + creep.memory.workTarget + ', pos ' + Game.getObjectById(creep.memory.workTarget).pos);}
						}
						// If there are no ramparts to build
						else {
							// If we have walls to build
							if(wallsToBuild.length > 0) {
								// We build the 1hp walls one by one
								creep.memory.workTarget = wallsToBuild[0].id;
								if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', wall to build : ' + creep.memory.workTarget + ', pos ' + Game.getObjectById(creep.memory.workTarget).pos);}
							}
							// If all walls are built, and ramparts are fine
							else {
								// We find the closest wall with less HP than intended.
								let potentialWallTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL && s.hits < workingTargetHPGoal});
								if(potentialWallTarget != undefined) {creep.memory.workTarget = potentialWallTarget.id;}
								if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', ramparts are OK and no wall or rampart to build. Wall target : ' + creep.memory.workTarget + ', pos ' + Game.getObjectById(creep.memory.workTarget).pos);}
							}
						}
					}
				}
				
				// If we have a target
				if(Game.getObjectById(creep.memory.workTarget) != undefined) {
					// Either it's a construction sites, so it has progress attributes
					if(Game.getObjectById(creep.memory.workTarget).progress < Game.getObjectById(creep.memory.workTarget).progressTotal) {
						// And we build it
						creep.build(Game.getObjectById(creep.memory.workTarget));
						if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', building target ' + Game.getObjectById(creep.memory.workTarget) + ' in ' + Game.getObjectById(creep.memory.workTarget).pos);}
					}
					// Or it doesn't have such attributes - I hope - and we get here
					else {
						// And we need to "repair" the target.
						creep.repair(Game.getObjectById(creep.memory.workTarget));
						if(activateLog) {console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', repairing target ' + Game.getObjectById(creep.memory.workTarget) + ' in ' + Game.getObjectById(creep.memory.workTarget).pos + ', HP : ' + Game.getObjectById(creep.memory.workTarget) + '/' + workingTargetHPGoal);}
					}
				}
			}
		
			// Obviously and as ever, if the creep is out of energy
			if(creep.carry[RESOURCE_ENERGY] == 0) {
				// We go gathering
				creep.memory.gathering = true;
			}
		}




		// If we're out of energy
		if(creep.memory.gathering) {
			// While we're under capacity
			if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
				// We look for a withdraw source
				withdrawSource.run(creep);
				// If we're too far from it
				if(creep.withdraw(Game.getObjectById(creep.memory.targetRefill)) == ERR_NOT_IN_RANGE) {
					// We move towards it
					creep.moveTo(Game.getObjectById(creep.memory.targetRefill));
				}
			}
			
			// If we are full of energy
			if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
				// Then we stop gathering
				creep.memory.gathering = false;
			}
		}
		
    }
};

module.exports = roleWallBuilder;
