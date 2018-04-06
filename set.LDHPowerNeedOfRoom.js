var setLDHPowerNeedOfRoom = {
    run: function(treatedRoom) {
		
		let displayPowerSummary = true;
		
        // Ajouter un "every X tick" ?
		
		// For every room we have in memory
		for(var roomInMemory in Memory.rooms) {
			// If the power sources have home rooms defined
			if(Memory.rooms[roomInMemory].powerSourcesHomeRooms != undefined) {
				// For each of these power sources
				for(let powerSourceIndex = 0; powerSourceIndex < Memory.rooms[roomInMemory].powerSourcesHomeRooms.length; powerSourceIndex++) {

					let expiryTick = Memory.rooms[roomInMemory].powerSourcesDiscoveryTime[powerSourceIndex] + Memory.rooms[roomInMemory].powerSourcesTime[powerSourceIndex];
					if(Game.time > expiryTick) {
						if(displayPowerSummary) {
							console.log('Distant room ' + roomInMemory + ', power source found : ' + Memory.rooms[roomInMemory].powerSources[powerSourceIndex] + ', home rooms : ' + Memory.rooms[roomInMemory].powerSourcesHomeRooms[powerSourceIndex])
						}

						// Remember : we have multiple home rooms for the same power source !
						for(let homeRoomOfPowerSourceIndex=0; homeRoomOfPowerSourceIndex < Memory.rooms[roomInMemory].powerSourcesHomeRooms[powerSourceIndex].length; homeRoomOfPowerSourceIndex++) {
							// If the home room is the room we're treating - for home rooms and distant rooms, it will never be true
							if(Memory.rooms[roomInMemory].powerSourcesHomeRooms[powerSourceIndex][homeRoomOfPowerSourceIndex] == treatedRoom.name) {
							
								
								// ------------ Attackers
								
								// We count the existing LDHarvesters for target room AND target source
								 let LDAttackersOfPowerSource = _.filter(Game.creeps, (creep) =>
									creep.memory.role == 'longDistanceAttackerPower' &&
									creep.memory.needOrigin == Memory.rooms[roomInMemory].powerSources[powerSourceIndex] &&
									(creep.ticksToLive > 1 || creep.memory.creepSpawning)
								).length;
								
								// And create the LDAttackerPower need for the treated room
								treatedRoom.memory.labels.push('LDAttackerPower target room ' + roomInMemory + ' power source ' + Memory.rooms[roomInMemory].powerSources[powerSourceIndex])
								treatedRoom.memory.need.push(Memory.rooms[roomInMemory].powerSourcesAttackNeed[powerSourceIndex]);
								treatedRoom.memory.attached.push(LDAttackersOfPowerSource);
								treatedRoom.memory.role.push('longDistanceAttackerPower');
								treatedRoom.memory.unity.push('Number of creeps');
								treatedRoom.memory.targetRoom.push(roomInMemory);
								treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].powerSources[powerSourceIndex]);
								treatedRoom.memory.needOriginPos.push(Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex]);
								treatedRoom.memory.criticalNeed.push(false);
								
								
								// ------------- Healers
								
								// We count the existing LDHealerPower for target room AND target source
								let LDFHealersOfPowerSource = _.filter(Game.creeps, (creep) =>
									creep.memory.role == 'longDistanceHealerPower' &&
									creep.memory.needOrigin == Memory.rooms[roomInMemory].powerSources[powerSourceIndex] &&
									(creep.ticksToLive > 1 || creep.memory.creepSpawning)
								).length;
								
								// And create the LDHealerPower need for the treated room
								treatedRoom.memory.labels.push('LDHealerPower target room ' + roomInMemory + ' power source ' + Memory.rooms[roomInMemory].powerSources[powerSourceIndex])
								treatedRoom.memory.need.push(Memory.rooms[roomInMemory].powerSourcesHealNeed[powerSourceIndex]);
								treatedRoom.memory.attached.push(LDFHealersOfPowerSource);
								treatedRoom.memory.role.push('longDistanceHealerPower');
								treatedRoom.memory.unity.push('Number of creeps');
								treatedRoom.memory.targetRoom.push(roomInMemory);
								treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].powerSources[powerSourceIndex]);
								treatedRoom.memory.needOriginPos.push(Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex]);
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
								treatedRoom.memory.labels.push('LDCarryPower target room ' + roomInMemory + ' power source ' + Memory.rooms[roomInMemory].powerSources[powerSourceIndex]);
								treatedRoom.memory.need.push(Memory.rooms[roomInMemory].powerSourcesCarryNeed[powerSourceIndex]);
								treatedRoom.memory.attached.push(LDCarrysOfPowerSource);
								treatedRoom.memory.role.push('longDistanceCarryPower');
								treatedRoom.memory.unity.push('Number of creeps');
								treatedRoom.memory.targetRoom.push(roomInMemory);
								treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].powerSources[powerSourceIndex]);
								treatedRoom.memory.needOriginPos.push(Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex]);
								treatedRoom.memory.criticalNeed.push(false);
						
								
							}
						}					
					
					}
				}
			}	
		}
		
    }
}

module.exports = setLDHPowerNeedOfRoom;
