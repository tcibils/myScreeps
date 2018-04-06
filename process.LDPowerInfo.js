
var processLDPowerInfo = {
    run: function() {
        
		// Do all that every 50 turns for instance
        if(Game.time % 10 == 0) {
				
			// Parameters :
			let minimumPowerSourceLivingTime = 3500;
			// Arbitrary number of max distance
			let maxPowerSourceToRoomSpawnDistance = 200;
				
			let myRoomsLevelEight = _.filter(Game.rooms, (currentRoom) => currentRoom.controller != undefined && currentRoom.controller.my && currentRoom.controller.level >= 8 && currentRoom.memory.spawningPoints.length > 0);
			
			// Starting now :
			// For each of rooms having a memory
			for(var roomInMemory in Memory.rooms) {
				if(Memory.rooms[roomInMemory].powerSources != undefined) {
					// If there are some power sources
					if(Memory.rooms[roomInMemory].powerSources.length > 0) {
						// If anything is not defined yet, we define it	
						if(Memory.rooms[roomInMemory].powerSourcesHomeRooms == undefined) {
							Memory.rooms[roomInMemory].powerSourcesHomeRooms = [];
						}
						
						if(Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance == undefined) {
							Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance = [];
						}
						
						if(Memory.rooms[roomInMemory].powerSourcesPotentialHomeRooms == undefined) {
							Memory.rooms[roomInMemory].powerSourcesPotentialHomeRooms = [];
						}
						
						if(Memory.rooms[roomInMemory].powerSourcesPotentialHomeRoomsDistance == undefined) {
							Memory.rooms[roomInMemory].powerSourcesPotentialHomeRoomsDistance = [];
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
							// Note that here we check the time to live of the source at the time of finding
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
							let powerSourceAttachedRoomAlready = true;
							// ISSUE HERE - make it true somehow ?
							// On n'aura pas besoin de faire la recherche à chaque fois, une seule fois devrait suffire. C'est pas comme les sources avec les nouvelles rooms construites.					
							
							
							// Condition 4 : not having found the necessary already
							let powerSourceAlreadyTreated = false;
							if(Memory.rooms[roomInMemory].powerSourcesHomeRooms.length == Memory.rooms[roomInMemory].powerSources.length) {
								powerSourceAlreadyTreated = true;
							}
							
							// Condition 5 : source has not yet dispeared
							// We check that the game time is not passed the source expiration
							let powerSourceFinished = false;					
							let expiryTick = Memory.rooms[roomInMemory].powerSourcesDiscoveryTime[powerSourceIndex] + Memory.rooms[roomInMemory].powerSourcesTime[powerSourceIndex];

							if(Game.time > expiryTick) {
								powerSourceFinished = true;
							}
							
							console.log('Before setting needs : living long enought (T) : ' + powerSourceLivingLongEngough + ', space (T) ' + powerSourceEnoughSpace + ', room attached (T) : ' + powerSourceAttachedRoomAlready + ', room already treated (F) ' + powerSourceAlreadyTreated + ', source finished (F) : ' + powerSourceFinished)
							// If we have the above conditions
							if(powerSourceLivingLongEngough && powerSourceEnoughSpace && powerSourceAttachedRoomAlready && !powerSourceAlreadyTreated && !powerSourceFinished) {
								// We assess the distances - not before, as this is way more costly to do.
								// We will need two rooms in order to make it fast enough.
								let firstClosestRoomDistance = 10000;
								let firstClosestRoom = 'null';
								let secondClosestRoomDistance = 10000;
								let secondClosestRoom = 'null';
								
								let potentialHomeRoomsDistances = [];
								let potentialHomeRooms = [];
								
								let homeRoomsDistances = [];
								let homeRooms = [];
								
								// Position : the position of the power source, retrieved from memory - we need to re-create it
								let powerSourcePosition = new RoomPosition(Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex].x, Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex].y, Memory.rooms[roomInMemory].powerSourcesPos[powerSourceIndex].roomName);

								// For each of my room being level 8
								for(let myRoomIndex = 0; myRoomIndex < myRoomsLevelEight.length; myRoomIndex++) {
									// First spawn of the room - approximation as they are generaly grouped... Would be too CPU expensive to check all spawns
									let spawnPosition = Game.getObjectById(myRoomsLevelEight[myRoomIndex].memory.spawningPoints[0]).pos;
									
									// We find the ideal path between the two
									// HIGHLY EXPENSIVE AND INSIDE MULTIPLE LOOPS - Crashes the CPU easily...
									let idealPath = PathFinder.search(spawnPosition, {pos: powerSourcePosition, range: 1});
									
									let currentDistance = 10000;
									if(idealPath != undefined) {
										if(!idealPath.incomplete) {
											// Check if path is not empty
											currentDistance = idealPath.path.length;
										}
									}
									
									// If we get a distance better than what we have so far
									if(currentDistance < firstClosestRoomDistance || currentDistance < secondClosestRoomDistance) {
										// We set this new distance as the new optimum for the worst of the two possibilities we have
										if(firstClosestRoomDistance < secondClosestRoomDistance) {
											secondClosestRoomDistance = currentDistance;
											secondClosestRoom = myRoomsLevelEight[myRoomIndex].name;
										}
										else {
											firstClosestRoomDistance = currentDistance;
											firstClosestRoom = myRoomsLevelEight[myRoomIndex].name;
										}
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
									Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance.push(homeRoomsDistances);
									Memory.rooms[roomInMemory].powerSourcesPotentialHomeRooms.push(potentialHomeRooms);
									Memory.rooms[roomInMemory].powerSourcesPotentialHomeRoomsDistance.push(potentialHomeRoomsDistances);
									Memory.rooms[roomInMemory].powerSourcesAttackNeed.push(3);
									Memory.rooms[roomInMemory].powerSourcesHealNeed.push(3);

								}
								// If the closest home rooms are too far, we don't bother.
								else {
									Memory.rooms[roomInMemory].powerSourcesHomeRooms.push('null');
									Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance.push('null');
									Memory.rooms[roomInMemory].powerSourcesPotentialHomeRooms.push(potentialHomeRooms);
									Memory.rooms[roomInMemory].powerSourcesPotentialHomeRoomsDistance.push(potentialHomeRoomsDistances);
									Memory.rooms[roomInMemory].powerSourcesAttackNeed.push(0);
									Memory.rooms[roomInMemory].powerSourcesHealNeed.push(0);
								}
							}
							
							// If the power source do not meet the first criterias, we don't bother
							else {
								
								if(Memory.rooms[roomInMemory].powerSourcesHomeRooms.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesHomeRooms.push('null');
								}
								if(Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesHomeRoomsDistance.push('null');
								}
								if(Memory.rooms[roomInMemory].powerSourcesPotentialHomeRooms.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesPotentialHomeRooms.push('null');
								}
								if(Memory.rooms[roomInMemory].powerSourcesPotentialHomeRoomsDistance.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesPotentialHomeRoomsDistance.push('null');
								}
								if(Memory.rooms[roomInMemory].powerSourcesAttackNeed.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesAttackNeed.push(0);
								}
								if(Memory.rooms[roomInMemory].powerSourcesHealNeed.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesHealNeed.push(0);
								}
							}
							
							// For the power creeps, we have fewer conditions - especially not the "powerSourceAlreadyTreated"
							// Indeed, the carrys need would be set to 0, and never changed again. So we need to check more often
							// This shouldn't be a problem as we wont call any expensive function here.
							console.log('now setting carry needs : T T T - F needed')
							if(powerSourceLivingLongEngough && powerSourceEnoughSpace && powerSourceAttachedRoomAlready && !powerSourceFinished) {
								// For carrys, if the source is already consequently damaged, then we need some, but not before.
								// We do not need all the conditions to avoid the computations
								let currentHits = Memory.rooms[roomInMemory].powerSourcesHits[powerSourceIndex];
								let maxHitsPowerSource = Memory.rooms[roomInMemory].powerSourcesHitsMax[powerSourceIndex];
								let hitsTreshold = maxHitsPowerSource/4;
								console.log('current hits : ' + currentHits + ', max ' + maxHitsPowerSource + ', tresh : ' + hitsTreshold)
								console.log('if ' + currentHits + '<' + hitsTreshold + ' then need ' + Math.ceil(Memory.rooms[roomInMemory].powerSourcesMax / 1000) )
								if( currentHits< hitsTreshold) {
									Memory.rooms[roomInMemory].powerSourcesCarryNeed.push(Math.ceil(Memory.rooms[roomInMemory].powerSourcesMax / 1000));
								}
								else {
									Memory.rooms[roomInMemory].powerSourcesCarryNeed.push(0);
								}
							}
							else {
								if(Memory.rooms[roomInMemory].powerSourcesCarryNeed.length < Memory.rooms[roomInMemory].powerSources.length) {
									Memory.rooms[roomInMemory].powerSourcesCarryNeed.push(0);
								}
							}
							
							// "Garbage collection" : we clean up the memory. Expiry is enough, no need to check if it's been destroyed.
							// We get the expiry tick by summing the discovery time and the ticks to decay at the time of discovery.
							
							// Now if the power source has expired
							if(powerSourceFinished) {
								// We clean the memory of the whole room.
								delete Memory.rooms[roomInMemory];
							}
							

						}
						// End of "for" loop on power sources
					}
					
					else if(Memory.rooms[roomInMemory].powerSources.length == 0 && Memory.rooms[roomInMemory].powerSourcesHomeRooms != undefined) {
						if(Memory.rooms[roomInMemory].powerSourcesHomeRooms.length > 0) {
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
}

module.exports = processLDPowerInfo;
