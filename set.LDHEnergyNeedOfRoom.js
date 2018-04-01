var setLDHEnergyNeedOfRoom = {
    run: function(treatedRoom) {
		
        // Ajouter un "every X tick" ?
		
		
		// For every room we have in memory
		for(var roomInMemory in Memory.rooms) {
			// If the sources have home rooms defined
			if(Memory.rooms[roomInMemory].sourcesHomeRooms != undefined) {
				// For each of these sources
				for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sourcesHomeRooms.length; sourceIndex++) {
					// If the home room is the room we're treating - for home rooms and distant rooms, it will never be true
					if(Memory.rooms[roomInMemory].sourcesHomeRooms[sourceIndex] == treatedRoom) {
						
						// We count the existing LDHarvesters for target room AND target source
						 let LDFHarvestersOfSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceFatHarvester' &&
							creep.memory.targetRoom == roomInMemory &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].sources[sourceIndex] &&
							(creep.ticksToLive > 150 || creep.memory.creepSpawning)
						).length;
						
						// And create the LDFHarvester need for the treated room
						treatedRoom.memory.labels.push('LDFHarvester')
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].sourcesWorkNeed[sourceIndex]);
						treatedRoom.memory.attached.push(LDFHarvestersOfSource);
						treatedRoom.memory.role.push('longDistanceFatHarvester');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].sources[sourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);

						
						// We count the existing LDMovers for target room AND target source
						let LDFMoversOfSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceFastMover' &&
							creep.memory.targetRoom == roomInMemory &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].sources[sourceIndex] &&
							(creep.ticksToLive > 150 || creep.memory.creepSpawning)
						).length;
						
						// And create the LDFMover need for the treated room
						treatedRoom.memory.labels.push('LDFMover')
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].sourcesCarryNeed[sourceIndex]);
						treatedRoom.memory.attached.push(LDFMoversOfSource);
						treatedRoom.memory.role.push('longDistanceFastMover');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].sources[sourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);
						
						
						// We count the existing LDSecurity for target room
						let LDSecurityOfSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceSecurity' &&
							creep.memory.targetRoom == roomInMemory &&
							(creep.ticksToLive > 50 || creep.memory.creepSpawning)
						).length;
						
						// We also count if some creeps are attacked, which will define the need
						let creepsUnderAttack = _.filter(Game.creeps, (creep) => creep.memory.underAttackRoom == roomInMemory && creep.memory.underAttack == true && creep.getActiveBodyparts(MOVE) > 0)
						
						// Create the LDSecurity need for the treated room as well
						treatedRoom.memory.labels.push('LDSecurity')
						if	   (creepsUnderAttack.length > 0) {treatedRoom.memory.need.push(1);}
						else if(creepsUnderAttack.length == 0){treatedRoom.memory.need.push(0);}
						treatedRoom.memory.attached.push(LDSecurityOfSource);
						treatedRoom.memory.role.push('longDistanceSecurity');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push('undefined');
						treatedRoom.memory.criticalNeed.push(false);
						
						
						/*  // Reserver creep for the room as well ?
						treatedRoom.memory.labels.push('LDReserver')
						treatedRoom.memory.need.push();
						treatedRoom.memory.attached.push();
						treatedRoom.memory.role.push();
						treatedRoom.memory.unity.push();
						treatedRoom.memory.targetRoom.push();
						treatedRoom.memory.needOrigin.push();
						treatedRoom.memory.criticalNeed.push();
						*/
						
						
					}
				}
			}	
		}
		
    }
}

module.exports = setLDHEnergyNeedOfRoom;
