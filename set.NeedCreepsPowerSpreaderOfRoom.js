var setNeedCreepsPowerSpreaderOfRoom = {
    run: function(treatedRoom) {
		
		treatedRoom.memory.labels.push('Power Spreader');
		
		// If we have a storage
		if(Game.getObjectById(treatedRoom.memory.storages[0]) != undefined) {
			// If we have some power and enough energy in the room, we need a spreader
			
			// We check how much power and energy to use we have
			let powerStored = 0;
			let energyStoredDeposit = 0;
			let energyStoredTerminal = 0;
			if(Game.getObjectById(treatedRoom.memory.storages[0]) != undefined) {
				powerStored = Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_POWER];
				energyStoredDeposit = Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY];
			}
			if(treatedRoom.terminal != undefined) {
				energyStoredTerminal = treatedRoom.terminal.store[RESOURCE_ENERGY];
			}

			// If we have power, but also enough energy, we need a spreader.
			if(powerStored > 0 && (energyStoredDeposit > 5000 || energyStoredTerminal > 5000)) {
				treatedRoom.memory.need.push(1);
			}
			else {
				treatedRoom.memory.need.push(0);
			}
		}
		else {
			treatedRoom.memory.need.push(0);
		}
		
		// Counting the existing ones in the room
        var spreadersPowerExisting = _.filter(Game.creeps, (creep) => (creep.memory.role == 'spreaderPower' && creep.memory.homeRoom == treatedRoom.name));
        treatedRoom.memory.attached.push(spreadersPowerExisting.length);
		
		// Filling the rest of the data tables
        treatedRoom.memory.role.push('spreaderPower');
        treatedRoom.memory.unity.push('number of creeps');
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined');
        treatedRoom.memory.needOriginPos.push('undefined');
        treatedRoom.memory.criticalNeed.push(false);


    }
}

module.exports = setNeedCreepsPowerSpreaderOfRoom;
