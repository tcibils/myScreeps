var setLDHEnergyNeedOfRoom = {
    run: function(treatedRoom) {
		
		// Parameters to get info in the console
		var showLDHEnergyDigest = false;
		var showLDHEnergySpecificRoomDigest = false; // For distant rooms
		var showLDHEnergySpecificRoomDigestTarget = 'W43N43';
		
		
		// For every room we have in memory
		for(var roomInMemory in Memory.rooms) {
			// If the sources have home rooms defined
			if(Memory.rooms[roomInMemory].sourcesHomeRooms != undefined) {
				
				// Console log printing for specific distant room
				if(showLDHEnergySpecificRoomDigest) {
					if(roomInMemory == showLDHEnergySpecificRoomDigestTarget) {
						console.log('Distant room ' + roomInMemory + ' Digest : ');
					}
				}
				
				// For each of these sources
				for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sourcesHomeRooms.length; sourceIndex++) {
					
					// Console log printing for specific distant room
					if(showLDHEnergySpecificRoomDigest) {
						if(roomInMemory == showLDHEnergySpecificRoomDigestTarget) {
							console.log('Source ' + Memory.rooms[roomInMemory].sources[sourceIndex] + ', home room ' + Memory.rooms[roomInMemory].sourcesHomeRooms[sourceIndex] + ', distance ' + Memory.rooms[roomInMemory].sourcesHomeRoomsDistance[sourceIndex]);
						}
					}
					
					// If the home room is the room we're treating - for home rooms and distant rooms, it will never be true
					if(Memory.rooms[roomInMemory].sourcesHomeRooms[sourceIndex] == treatedRoom.name) {
						
						// Console log for all rooms.
						if(showLDHEnergyDigest) {
							console.log('Distant room ' + roomInMemory + ', source ' + Memory.rooms[roomInMemory].sources[sourceIndex] + ', home room found : ' + Memory.rooms[roomInMemory].sourcesHomeRooms[sourceIndex] + ', distance : ' + Memory.rooms[roomInMemory].sourcesHomeRoomsDistance[sourceIndex])	
						}
						
						// We count the existing LDHarvesters for target room AND target source
						 let LDFHarvestersOfSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceFatHarvester' &&
							creep.memory.targetRoom == roomInMemory &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].sources[sourceIndex] &&
							(creep.ticksToLive > 150 || creep.memory.creepSpawning)
						).length;
						
						// And create the LDFHarvester need for the treated room
						treatedRoom.memory.labels.push('LDFHarvester target room ' + roomInMemory + ' source ' + Memory.rooms[roomInMemory].sources[sourceIndex])
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].sourcesWorkNeed[sourceIndex]);
						treatedRoom.memory.attached.push(LDFHarvestersOfSource);
						treatedRoom.memory.role.push('longDistanceFatHarvester');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].sources[sourceIndex]);
						treatedRoom.memory.needOriginPos.push(Memory.rooms[roomInMemory].sourcesPos[sourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);

						
						// We count the existing LDMovers for target room AND target source
						let LDFMoversOfSource = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceFastMover' &&
							creep.memory.targetRoom == roomInMemory &&
							creep.memory.needOrigin == Memory.rooms[roomInMemory].sources[sourceIndex] &&
							(creep.ticksToLive > 150 || creep.memory.creepSpawning)
						).length;
						
						// And create the LDFMover need for the treated room
						treatedRoom.memory.labels.push('LDFMover target room ' + roomInMemory + ' source ' + Memory.rooms[roomInMemory].sources[sourceIndex])
						treatedRoom.memory.need.push(Memory.rooms[roomInMemory].sourcesCarryNeed[sourceIndex]);
						treatedRoom.memory.attached.push(LDFMoversOfSource);
						treatedRoom.memory.role.push('longDistanceFastMover');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push(Memory.rooms[roomInMemory].sources[sourceIndex]);
						treatedRoom.memory.needOriginPos.push(Memory.rooms[roomInMemory].sourcesPos[sourceIndex]);
						treatedRoom.memory.criticalNeed.push(false);
						
						
						// We count the existing LDSecurity for target room
						let LDSecurityOfRoom = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'longDistanceSecurity' &&
							creep.memory.targetRoom == roomInMemory &&
							(creep.ticksToLive > 50 || creep.memory.creepSpawning)
						).length;
						
						// We also count if some creeps are attacked, which will define the need
						let creepsUnderAttack = _.filter(Game.creeps, (creep) => creep.memory.underAttackRoom == roomInMemory && creep.memory.underAttack == true && creep.getActiveBodyparts(MOVE) > 0)
						
						// Create the LDSecurity need for the treated room as well
						treatedRoom.memory.labels.push('LDSecurity target room ' + roomInMemory)
						if	   (creepsUnderAttack.length > 0) {treatedRoom.memory.need.push(1);}
						else if(creepsUnderAttack.length == 0){treatedRoom.memory.need.push(0);}
						treatedRoom.memory.attached.push(LDSecurityOfRoom);
						treatedRoom.memory.role.push('longDistanceSecurity');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						treatedRoom.memory.needOrigin.push('undefined');
						treatedRoom.memory.needOriginPos.push('undefined');
						treatedRoom.memory.criticalNeed.push(false);
						
						
						// Finally, reservers
						
						// We count the existing reservers for target room
						let LDReserverOfRoom = _.filter(Game.creeps, (creep) =>
							creep.memory.role == 'roomReserver' &&
							creep.memory.targetRoom == roomInMemory &&
							(creep.ticksToLive > 50 || creep.memory.creepSpawning)
						).length;
						
						// Do we need a reserver ?
						let reserversNeeded = 0;
						// If we have no visibility, we definitely need to reserve the room
						if(Game.rooms[roomInMemory] == undefined) {
							reserversNeeded = 1;
						}
						// If there is no reservation, we need to start it
						else if(Game.rooms[roomInMemory].controller.reservation == undefined) {
							reserversNeeded = 1;
						}
						// If there is a reservation, and it's comming to an end, we need to renew it
						else if (Game.rooms[roomInMemory].controller.reservation.ticksToEnd < 1000) {
							reserversNeeded = 1
						}
						
						// and we set the rest of the info
						treatedRoom.memory.labels.push('LDReserver target room ' + roomInMemory)
						treatedRoom.memory.need.push(reserversNeeded);
						treatedRoom.memory.attached.push(LDReserverOfRoom);
						treatedRoom.memory.role.push('roomReserver');
						treatedRoom.memory.unity.push('Number of creeps');
						treatedRoom.memory.targetRoom.push(roomInMemory);
						// The need origin will be the controller, in order to move towards it directly
						if(treatedRoom.memory.controller != undefined) {
							treatedRoom.memory.needOrigin.push(treatedRoom.memory.controller);
						}
						else {
							treatedRoom.memory.needOrigin.push('undefined');
						}
						
						if(treatedRoom.memory.controllerPos != undefined) {
							treatedRoom.memory.needOriginPos.push(treatedRoom.memory.controllerPos);
						}
						else {
							treatedRoom.memory.needOriginPos.push('undefined');
						}
						treatedRoom.memory.criticalNeed.push(false);			
					}
				}
			}	
		}
		
    }
}

module.exports = setLDHEnergyNeedOfRoom;
