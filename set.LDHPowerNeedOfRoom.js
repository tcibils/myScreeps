var setLDHEnergyNeedOfRoom = {
    run: function(treatedRoom) {
		
        // Ajouter un "every X tick" ?
		
		// Fait vite, à re-checker
		
		// For every room we have in memory
		for(var roomInMemory in Memory.rooms) {
			// If the sources have home rooms defined
			if(Memory.rooms[roomInMemory].powerSourcesHomeRooms != undefined) {
				// For each of these sources
				for(let powerSourceIndex = 0; powerSourceIndex < Memory.rooms[roomInMemory].powerSourcesHomeRooms.length; powerSourceIndex++) {
					// If the home room is the room we're treating - for home rooms and distant rooms, it will never be true
					if(Memory.rooms[roomInMemory].powerSourcesHomeRooms[powerSourceIndex] == treatedRoom) {
					
						
						// ------------ Attackers
						
						// We count the existing LDHarvesters for target room AND target source
						 let LDAttackersOfPowerSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceAttackerPower' &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].powerSourcesHomeRooms[powerSourceIndex] &&
							(creep.ticksToLive > 1 || creep.memory.creepSpawning)
						).length;
						
						// And create the LDAttackerPower need for the treated room
						treatedRoom.memory.labels.push('LDAttackerPower')
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].powerSourcesAttackNeed[powerSourceIndex]);
						treatedRoom.memory.attached.push(LDAttackersOfPowerSource);
						treatedRoom.memory.role.push('longDistanceAttackerPower');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].powerSources[powerSourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);
						
						
						// ------------- Healers
						
						// We count the existing LDHealerPower for target room AND target source
						let LDFHealersOfPowerSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceHealerPower' &&
							creep.memory.targetRoom == roomInMemory &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].powerSources[powerSourceIndex] &&
							(creep.ticksToLive > 1 || creep.memory.creepSpawning)
						).length;
						
						// And create the LDHealerPower need for the treated room
						treatedRoom.memory.labels.push('LDHealerPower')
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].powerSourcesHealNeed[powerSourceIndex]);
						treatedRoom.memory.attached.push(LDFHealersOfPowerSource);
						treatedRoom.memory.role.push('longDistanceHealerPower');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].powerSourcesHealNeed[powerSourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);
						
						
						// ------------- Carrys
						
						// We count the existing LDCarryPower for target room
						let LDCarrysOfPowerSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceCarryPower' &&
							creep.memory.targetRoom == roomInMemory &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].powerSources[powerSourceIndex] &&
							(creep.ticksToLive > 1 || creep.memory.creepSpawning)
						).length;						
						
						// Create the LDCarryPower need for the treated room as well
						treatedRoom.memory.labels.push('LDSecurity');
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].powerSourcesCarryNeed[powerSourceIndex]);
						treatedRoom.memory.attached.push(LDCarrysOfPowerSource);
						treatedRoom.memory.role.push('longDistanceCarryPower');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].powerSourcesHealNeed[powerSourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);
				
						
					}
				}
			}	
		}
		
    }
}

module.exports = setLDHEnergyNeedOfRoom;
