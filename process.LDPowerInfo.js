
var processLDPowerInfo = {
    run: function() {
        
		// Parameters :
		let minimumPowerSourceLivingTime = 3500;
		// Arbitrary number of max distance
		let maxPowerSourceToRoomSpawnDistance = 200;
			
		let myRoomsLevelEight = _.filter(Game.rooms, (currentRoom) => currentRoom.controller != undefined && currentRoom.controller.my && currentRoom.controller.level >= 8 && currentRoom.memory.spawningPoints.length > 0);
		
		// Starting now :
		// For each of rooms having a memory
		for(var roomInMemory in Memory.rooms) {
			// If there are some power sources
			if(Memory.rooms[roomInMemory].powerSources.length > 0) {
				// If anything is not defined yet, we define it	
				if(Memory.rooms[roomInMemory].powerSourcesHomeRooms == undefined) {
					Memory.rooms[roomInMemory].powerSourcesHomeRooms = [];
				}
				
				if(Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance == undefined) {
					Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance = [];
				}
				
				if(Memory.rooms[roomInMemory].powerSourcesAttackNeed == undefined) {
					Memory.rooms[roomInMemory].powerSourcesAttackNeed = [];
				}
				
				if(Memory.rooms[roomInMemory].powerSourcesHealNeed == undefined) {
					Memory.rooms[roomInMemory].powerSourcesHealNeed = [];
				}
				
				if(Memory.rooms[roomInMemory].powerSourcesCarryNeed == undefined) {
					Memory.rooms[roomInMemory].powerSourcesCarryNeed = [];
				}
				
				// For each power source
				for(let powerSourceIndex = 0; powerSourceIndex < Memory.rooms[roomInMemory].powerSources.length; powerSourceIndex++) {
					// We need to assess if we will harvest it.
					
					// Condition 1 : will it live long enough for us to have the time to harvest it ?
					let powerSourceLivingLongEngough = false;
					if(Memory.rooms[roomInMemory].powerSourcesTime[powerSourceIndex] > minimumPowerSourceLivingTime) {
						powerSourceLivingLongEngough = true;
					}
					
					// Condition 2 : do we have enough space around it to harvest it without boosts ?
					let powerSourceEnoughSpace = false;
					if(Memory.rooms[roomInMemory].powerSourceFreeSpots[powerSourceIndex] > 1) {
						powerSourceEnoughSpace = true;
					}
					
					// Condition 3 : we do not already have attached rooms for this power source
					let powerSourceAttachedRoomAlready = false;
					// ISSUE HERE - make it true somehow ?
					// On n'aura pas besoin de faire la recherche à chaque fois, une seule fois devrait suffire. C'est pas comme les sources avec les nouvelles rooms construites.					
					
					// If we have the above conditions
					if(powerSourceLivingLongEngough && powerSourceEnoughSpace && powerSourceAttachedRoomAlready) {
						// We assess the distances - not before, as this is way more costly to do.
						// We will need two rooms in order to make it fast enough.
						let firstClosestRoomDistance = 10000;
						let firstClosestRoom = null;
						let secondClosestRoomDistance = 10000;
						let secondClosestRoom = null;
						
						let potentialHomeRoomsDistances = [];
						let potentialHomeRooms = [];
						
						let homeRoomsDistances = [];
						let homeRooms = [];
						
						// For each of my room being level 8
						for(let myRoomIndex = 0; myRoomIndex < myRoomsLevelEight.length; myRoomIndex++) {
							// First position : first spawn of the room - approximation as they are generaly grouped... Would be too CPU expensive to check all spawns
							let firstPosition = Game.getObjectById(myRoomsLevelEight[myRoomIndex].memory.spawningPointsPos[0]).pos;
							// Second position : the position of the power source, retrieved from memory - we need to re-create it
							let secondPosition = new RoomPosition(Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex].x, Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex].y, Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex].roomName);
							
							// We find the ideal path between the two
							// HIGHLY EXPENSIVE AND INSIDE MULTIPLE LOOPS - Crashes the CPU easily...
							let idealPath = PathFinder.search(firstPosition, secondPosition);
							
							let currentDistance = 10000;
							if(idealPath != undefined) {
								// Check if path is not empty
								currentDistance = idealPath.path.length;
							}
							
							// We get the closest rooms.
							if(currentDistance < firstClosestRoomDistance) {
								firstClosestRoomDistance = currentDistance;
								firstClosestRoom = myRoomsLevelEight[myRoomIndex].name;
							}
							else if (currentDistance < secondClosestRoomDistance) {
								secondClosestRoomDistance = currentDistance;
								secondClosestRoom = myRoomsLevelEight[myRoomIndex].name;
							}
						}
						
						// Now, we know the closest rooms. We keep them in memory for debug purposes
						potentialHomeRooms.push(firstClosestRoom);
						potentialHomeRooms.push(secondClosestRoom);
						potentialHomeRoomsDistances.push(firstClosestRoomDistance);
						potentialHomeRoomsDistances.push(secondClosestRoomDistance);
						
						if(firstClosestRoomDistance < maxPowerSourceToRoomSpawnDistance && secondClosestRoomDistance < maxPowerSourceToRoomSpawnDistance) {
							homeRooms.push(firstClosestRoom);
							homeRooms.push(secondClosestRoom);
							homeRoomsDistances.push(firstClosestRoomDistance);
							homeRoomsDistances.push(secondClosestRoomDistance);
							
							Memory.rooms[roomInMemory].powerSourcesHomeRooms.push(homeRooms);
							Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance(homeRoomsDistances);
							
							Memory.rooms[roomInMemory].powerSourcesAttackNeed.push(3);
							Memory.rooms[roomInMemory].powerSourcesHealNeed.push(3);
							
							// ISSUE HERE - still need carry needs - depends on power bank quantity and on the size of creeps we'll make...
						}
						// If the closest home rooms are too far, we don't bother.
						else {
							Memory.rooms[roomInMemory].powerSourcesHomeRooms.push('null');
							Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance('null');
							Memory.rooms[roomInMemory].powerSourcesAttackNeed.push(0);
							Memory.rooms[roomInMemory].powerSourcesHealNeed.push(0);
							Memory.rooms[roomInMemory].powerSourcesCarryNeed.push(0);
						}
					}
					
					// If the power source do not meet the first criterias, we don't bother
					else {
						Memory.rooms[roomInMemory].powerSourcesHomeRooms.push('null');
						Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance('null');
						Memory.rooms[roomInMemory].powerSourcesAttackNeed.push(0);
						Memory.rooms[roomInMemory].powerSourcesHealNeed.push(0);
						Memory.rooms[roomInMemory].powerSourcesCarryNeed.push(0);
					}
					
					// "Garbage collection" : we clean up the memory. Expiry is enough, no need to check if it's been destroyed.
					// We get the expiry tick by summing the discovery time and the ticks to decay at the time of discovery.
					let expiryTick = Memory.rooms[roomInMemory].powerSourcesDiscoveryTime[powerSourceIndex] + Memory.rooms[roomInMemory].powerSourcesTime[powerSourceIndex];
					// Now if the power source has expired
					if(Game.time > expiryTick) {
						// We clean the memory of the whole room.
						delete Memory.rooms[roomInMemory];
					}
				}
		
		// On va spawner 
		// Warriors 20-20 x3 cout 2600
		// Healers 25-25 x3 cout 7500
		// Total 10100, une paire ça passe en une fois pour un room lvl 8
		// Plus les carrys.
		// On comptera les creeps sans leur home room =)
				

			}
		}
    }
}

module.exports = processLDPowerInfo;
