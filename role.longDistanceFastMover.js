



var underAttackCreepMemory = require('info.underAttackCreepMemory');

// Improvement idea 1 : set deposit target based on room memory, go there directly
// Improvement idea 2 : move toward needOriginPos stored in memory directly

var longDistanceFastMover = {
    run: function(creep) {
        
        underAttackCreepMemory.run(creep);
	
		let naturallyDeadTime = 100;
	
		let targetEnergySourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
		
        if(creep.memory.gathering == undefined) {creep.memory.gathering = false;}
		if(creep.memory.attachedContainer == undefined) {creep.memory.attachedContainer = null;}
		if(creep.memory.nearEnergySource == undefined) {creep.memory.nearEnergySource = false;}
		
		if(creep.pos.getRangeTo(targetEnergySourcePos) < 4) {
			creep.memory.nearEnergySource = true;
		}
		else {
			creep.memory.nearEnergySource = false;
		}
        
		
        // If creep is not gathering, meaning he's going back home with energy
        if(creep.memory.gathering == false) {
            // If he's home
            if(creep.room.name == creep.memory.homeRoom) {
                // If he has some energy - meaning he just came back
                if(creep.carry[RESOURCE_ENERGY] > 0) {
					
					// We'll check if the deposit target is full
					// First define the deposit amounts
					let depositTargetEnergy = 0;
					let depositTargetEnergyMax = 0;
					let depositTargetType = 'null';
					// Then we fill the variables if we have a deposit target
					if(Game.getObjectById(creep.memory.depositTarget) != undefined) {
						depositTargetType = Game.getObjectById(creep.memory.depositTarget).structureType;
						// First case,it's a storage
						if(depositTargetType == STRUCTURE_STORAGE) {
							depositTargetEnergy = _.sum(Game.getObjectById(creep.memory.depositTarget).store);
							depositTargetEnergyMax = Game.getObjectById(creep.memory.depositTarget).storeCapacity;
						}
						// Second case, it's a link
						if(depositTargetType == STRUCTURE_LINK) {
							depositTargetEnergy = Game.getObjectById(creep.memory.depositTarget).energy;
							depositTargetEnergyMax = Game.getObjectById(creep.memory.depositTarget).energyCapacity;
						}
					}
					
					
					// If we do not know where to deposit this energy, or if the target is full
					if(Game.getObjectById(creep.memory.depositTarget) == undefined || depositTargetEnergy == depositTargetEnergyMax || depositTargetType == STRUCTURE_STORAGE || depositTargetType == STRUCTURE_TERMINAL) {
						
						if(_.sum(Game.getObjectById(Memory.rooms[creep.memory.homeRoom].storages[0]).store) < STORAGE_CAPACITY * 0.95) {
							// We list the possibilities
							// First, the non-full links
							let potentialDepositTargets = creep.room.find(FIND_MY_STRUCTURES, {filter: function(object) {return (object.structureType == STRUCTURE_LINK && object.energy < object.energyCapacity)}});

							// We also add the deposit - assume here's never full
							// If we were physicians, we could say "we assume that 1 million is close to infinity"
							// But no. We'll just make sure with the rest of the code that it never gets full xD
							/*
							if(Memory.rooms[creep.memory.homeRoom].storages.length > 0) {
								if(Game.getObjectById(Memory.rooms[creep.memory.homeRoom].storages[0]) != undefined) {
									potentialDepositTargets.push(Game.getObjectById(Memory.rooms[creep.memory.homeRoom].storages[0]));
								}
							}
							*/
							
							// And we take the closest of the objects.
							var potentialTarget = creep.pos.findClosestByPath(potentialDepositTargets);

						
							// If it exists
							if(potentialTarget != null) {
								// We set it as final target.
								creep.memory.depositTarget = potentialTarget.id;
							}
						}
						else {
							creep.memory.depositTarget = creep.room.terminal.id;
						}
					}
					
					// If we have a deposit target
					if (Game.getObjectById(creep.memory.depositTarget) != undefined){
                        // Then he tries to transfer and go there.
                        if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.depositTarget).pos, {visualizePathStyle: {stroke: '#08ff00'}});
                        }						
					}
                }
                
                // If the creep is empty, he goes gathering !
                if(creep.carry[RESOURCE_ENERGY] == 0 && creep.ticksToLive > naturallyDeadTime) {
                    creep.memory.gathering = true;
                }
            }
            
            // If the creep is not in his home, he gets back
            if(creep.room.name != creep.memory.homeRoom) {
				// If we have a deposit (meaning we already took time to define it)
                if(creep.memory.depositTarget != undefined) {
					// Then we move towards it. Works cross-rooms.
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 10});
                }
				// If we don't have a deposit (first time it comes back)
				else {
					// Then we simply target "center of home room", and we'll get more precise later
					let tempTarget = new RoomPosition(25,25,creep.memory.homeRoom);
					creep.moveTo(tempTarget, {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 10});
				}
            }
        }

		
        // If the creep is gathering
        if(creep.memory.gathering == true) {
			// If we're far away from target source we move towards it
			if(!creep.memory.nearEnergySource) {
				creep.moveTo(targetEnergySourcePos, {visualizePathStyle: {stroke: '#ffbc11'}, reusePath: 10});
			}
			// If we're near it
			else {
                // And is full, then we stop gathering.
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity || creep.ticksToLive < naturallyDeadTime) {
                    creep.memory.gathering = false;
                }				
				// If we're under capacity
                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
					// If we do not have a container target yet
					if(Game.getObjectById(creep.memory.attachedContainer) == undefined) {
						let potentialContainers = targetEnergySourcePos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}});
						// If there is one
						if(potentialContainers.length > 0) {
							// Then we attach it
							creep.memory.attachedContainer = potentialContainers[0].id; // We attach the container
						}
					}
					// If we have one
					else if(Game.getObjectById(creep.memory.attachedContainer) != undefined) {
						// We simply withdraw from it
						if(creep.withdraw(Game.getObjectById(creep.memory.attachedContainer), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(Game.getObjectById(creep.memory.attachedContainer));
						}
					}
				}
			}
		}
    }
};


module.exports = longDistanceFastMover;