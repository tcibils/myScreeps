

var roleSpreaderPower = {
    run: function(creep) {
		let naturallyDeadTime = 30;
		
		if(creep.memory.gathering == undefined) {
			creep.memory.gathering = false;
		}
		if(creep.memory.gatheringPower == undefined) {
			creep.memory.gatheringPower = false;
		}
		if(creep.memory.gatheringEnergy == undefined) {
			creep.memory.gatheringEnergy = false;
		}
		
		// If creep has few ticks to live, we don't want to loose power - too precious!
		if(creep.ticksToLive < naturallyDeadTime) {
			creep.memory.gathering = false;
			if(_.sum(creep.carry) == 0) {
				creep.suicide();
			}
		}
		
		// If we're gathering power from deposit
		if(creep.memory.gathering) {
			// If we'ew under our capacity
			if(_.sum(creep.carry) < creep.carryCapacity) {
				// If we're gathering power
				if(creep.memory.gatheringPower) {
					// We withdraw some from the deposit
					if(creep.withdraw(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
						// If we're too far we move towards the storage.
						creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
					}
				}
				// If we're gathering energy
				if(creep.memory.gatheringEnergy) {
					// We check the energy in the storage
					let energyInRoomStorage = 0;
					if(Game.getObjectById(creep.room.memory.storages[0]) != undefined) {
						energyInRoomStorage = Game.getObjectById(creep.room.memory.storages[0]).store[RESOURCE_ENERGY];
					}
					// If there's enought
					if(energyInRoomStorage > 100) {
						// we try to withdraw from the storage
						if(creep.withdraw(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						// If we're too far we move towards the storage.
							creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
						}
					}
					// If there's not enough
					else {
						// The idea here, long term, is that other rooms might send energy to the terminal.
						// (also that my rooms currently stacked energy in terminals and I want to use it ^^)
						// If we have a terminal
						if(creep.room.terminal != undefined) {
							// And there is some energy
							if(creep.room.terminal.store[RESOURCE_ENERGY] > 100) {
								// We withdraw this energy
								if(creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(creep.room.terminal);
								}
							}
						}
					}
				}
			}
			
			// If we're at capacity
			if(_.sum(creep.carry) == creep.carryCapacity) {
				// We stop gathering
				creep.memory.gathering = false;
				creep.memory.gatheringPower = false;
				creep.memory.gatheringEnergy = false;
			}
		}
		

		
		// If we're not gathering
		if(!creep.memory.gathering) {
			// If we have some resource
			if(_.sum(creep.carry) > 0) {
				// We try to transfer it to the power spawn
				if(creep.carry[RESOURCE_POWER] > 0) {
					if(creep.transfer(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
						creep.moveTo(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]));
					}
				}
				if(creep.carry[RESOURCE_ENERGY] > 0) {
					let energyInPowerSpawn = Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energy;
					let maxEnergyInPowerSpawn = Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energyCapacity;
					
					if(energyInPowerSpawn < maxEnergyInPowerSpawn) {
						if(creep.transfer(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]));
						}
					}
					if(energyInPowerSpawn == maxEnergyInPowerSpawn) {
						if(creep.transfer(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
						}
					}
				}
				if(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energy < 100) {
					if(creep.transfer(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
						creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
					}
				}
			}
			
			// If the creep is empty
			if(_.sum(creep.carry) == 0) {
				// If the spawning point is full of energy
				if(creep.ticksToLive >= naturallyDeadTime && Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energy == Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energyCapacity){
					// Then we gather power to deposit it on the power spawn
					creep.memory.gathering = true;
					creep.memory.gatheringPower = true;
				}
				// If the spawning point is not full of energy, we fill it with energy
				if(creep.ticksToLive >= naturallyDeadTime && Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energy < Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energyCapacity) {
					creep.memory.gathering = true;
					creep.memory.gatheringEnergy = true;
				}
			}
		}
		
    }
};

module.exports = roleSpreaderPower;
