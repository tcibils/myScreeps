var setNeedCreepsUpgradersOfRoom = {
    run: function(treatedRoom) {

        treatedRoom.memory.labels.push('Upgraders')
        treatedRoom.memory.role.push('upgrader')
        treatedRoom.memory.unity.push('Number of creeps')
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined')
        treatedRoom.memory.needOriginPos.push('undefined')
        treatedRoom.memory.criticalNeed.push(false);



        // This variable is the energy the upgrader creep is supposed to consume during its life
        let baseUnitUpgradersNeed = 40000;

        // Max harvesters in order not to clog the room
        let maxUpgraders = 4;
		
		// Time after which we consider the upgraders as non-existing
		let naturallyDeadTime = 100;
		
		// If the controller time to downgrade gets under this (room level 8), we force the need for an upgrader
		let tickLimitsToDowngrade = 2000;
		
		// If room is level 8
        if(treatedRoom.controller.level == 8) {
			// If the controller is going to get downgraded, we absolutely need an upgrader
			if(treatedRoom.controller.ticksToDowngrade < tickLimitsToDowngrade) {
				treatedRoom.memory.need.push(1);
			}
			// If there's no problem with the timer
			else {
				// We only spawn one if we have enough energy to feed it.
				if(Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] > baseUnitUpgradersNeed) {
					treatedRoom.memory.need.push(1);
				}
				else {
					treatedRoom.memory.need.push(0);
				}
			}
		}

        if(treatedRoom.controller.level < 8) {
            // If we have a storage
            if(treatedRoom.memory.storages.length > 0) {
                // But not enough energy in it
                if(Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] < baseUnitUpgradersNeed) {
                    // We do not create upgraders
                    treatedRoom.memory.need.push(0);
                }

                else if (Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] > baseUnitUpgradersNeed * maxUpgraders) {
                    treatedRoom.memory.need.push(maxUpgraders);
                }

                else {
                    // If we have enough energy, we check how much we could sustain
                    let maximumReached = false;
                    for(let maxFactor = 1; maxFactor < maxUpgraders && !maximumReached; maxFactor++) {
                        if(Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] > (baseUnitUpgradersNeed * maxFactor) && Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] <= (baseUnitUpgradersNeed * (maxFactor+1))) {
                            treatedRoom.memory.need.push(maxFactor);
                        }
                    }
                }
            }
            // If we have no storage, we still need upgraders ! The room is just low level.
            else {
                let builderNeededOfRoom = 0;
                let maxSpaceAroundContainer = 4;
                for(let findBuilderIndex = 0; findBuilderIndex < treatedRoom.memory.need.length; findBuilderIndex++) {
                    if(treatedRoom.memory.role[findBuilderIndex] == 'builder') {
                        builderNeededOfRoom = treatedRoom.memory.need[findBuilderIndex];
                    }
                }
                // We need 1 spot free around container for fast movers to acess it
                let result = maxSpaceAroundContainer - 1 - builderNeededOfRoom;
                if(result >= 0) {
                    treatedRoom.memory.need.push(result);
                }
                else {
                    treatedRoom.memory.need.push(0);
                }
            }
        }

        treatedRoom.memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' && creep.memory.homeRoom == treatedRoom.name)).length);

    }
}

module.exports = setNeedCreepsUpgradersOfRoom;
