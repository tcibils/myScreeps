
var depositTargetUnderlying = require('get.depositTargetUnderlying');

// This function defined the conditions depending on which we'll look for a new desposit target.

var depositTarget = {
     run: function(creep) {
        // Control variables leting us set the maximum in each type of storage before moving on to the extensions and spawn
        let maximumFillingOfContainer = 1750;
        let maximumFillingOfStorage = 37500; 
        let maximumFillingOfTerminal = 20000;
		
		// Control variable to fill towers in priority if eneded
		let minimumFillingOfRepairingTower = TOWER_CAPACITY/1.5; // MUST BE ALIGNED WITH TOWER SCRIPT
		let minimumFillingOfAttackingTower = TOWER_CAPACITY/1.05;
        // keeping this high should ensure us that when spawning an upgrader creep, we will have enough to feed him for a loong time.
        // MUST BE ALIGNED WITH THE SAME CONSTANT IN DESPOSITTARGETUNDERLYING
        

        
        // If we have no deposit target 
        if(Game.getObjectById(creep.memory.depositTarget) == undefined) {
			// We get one
            depositTargetUnderlying.run(creep);
        }
        
		// If we have a deposit target
        if(Game.getObjectById(creep.memory.depositTarget) != undefined) {
			// We look at the said target and memorize its attributes.
            let currentDepositTarget = Game.getObjectById(creep.memory.depositTarget)
            let currentDepositTargetType = Game.getObjectById(creep.memory.depositTarget).structureType;
            let fractionOfCapacity = 2;
            let energyAvailableTooLow = false;
            
			// If the room has low energy
            if(creep.room.energyAvailable < (creep.room.energyCapacityAvailable / fractionOfCapacity)) {
                energyAvailableTooLow = true;
            }
			
			// If the room is under threat
			if(creep.room.memory.threatLevel > 0) {
                // We will look for the best target while gathering, without saving on CPU. Best target finding is done in the underlying.
                // Doing so that once target is locked, we deliver to it, and once creep is empty, we get a new one
                // This is linked with the logic in underlying function, as we do not take into considerations tower with a non-gathering creep already attached
                if(creep.memory.gathering || currentDepositTarget.energy > minimumFillingOfAttackingTower) {
                    depositTargetUnderlying.run(creep);
                }
			}
            
            
            // We change deposit target if the structures are filled above the treshold, or if the energy in room is too low
            if(currentDepositTargetType == STRUCTURE_CONTAINER) {
                if(currentDepositTarget.store[RESOURCE_ENERGY] > maximumFillingOfContainer || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            if(currentDepositTargetType == STRUCTURE_STORAGE) {
                if(currentDepositTarget.store[RESOURCE_ENERGY] > maximumFillingOfStorage || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            
            if(currentDepositTargetType == STRUCTURE_TERMINAL) {
                if(currentDepositTarget.store[RESOURCE_ENERGY] > maximumFillingOfTerminal || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            if(currentDepositTargetType == STRUCTURE_NUKER ||currentDepositTargetType == STRUCTURE_POWER_SPAWN) {
                if(currentDepositTarget.energy == currentDepositTarget.energyCapacity || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
			
			if(currentDepositTargetType == STRUCTURE_TOWER && creep.room.memory.threatLevel == 0) {
				if(currentDepositTarget.energy == currentDepositTarget.energyCapacity || energyAvailableTooLow) {
					depositTargetUnderlying.run(creep);
				}
			}
            
            // Just for spawns and extenions, we don't change if energy available is too low
            if(currentDepositTargetType == STRUCTURE_SPAWN || currentDepositTargetType == STRUCTURE_EXTENSION) {
				// In order to avoid going to a far away target missing 10 energy, we reset the deposit target if target has >0 energy.
                if(currentDepositTarget.energy > 0) {
                    depositTargetUnderlying.run(creep);
                }
            }
        }
    }
};

module.exports = depositTarget;