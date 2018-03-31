// First we restrict the perimeter of distant rooms we want to assess
// Then we define the perimeter of potential home rooms
// And we try not to assess potential home rooms if it's not useful - sources in distant room do not change place


var processLDEnergyInfo = {
    run: function() {
        
		// Do all that every 2000 or 5000 turns for instance - we only need to update it if I got a new room
        if(Game.time % 5000 == 0) {
			
			// variable array with rooms to be excluded (parameters), for diplomacy (Ringo86)
			let roomsExceptions = ['W45N52'];
			
			// variable array with my rooms names, for comparaison later
			let myRooms = _.filter(Game.rooms, (currentRoom) => currentRoom.controller != undefined && currentRoom.controller.my);

			// variable array with my rooms names HAVING A STORAGE
			let myRoomsWithSenderLink = _.filter(Game.rooms, (currentRoom) => currentRoom.controller != undefined && currentRoom.controller.my && currentRoom.memory.senderLinks.length > 0);
			
			
			
			
			
			// Starting now :
			// For each of rooms having a memory
			for(var roomInMemory in Memory.rooms) {
				// First, we check if the room is mine or not
				let roomIsMine = false;
				// we scroll all my rooms
				for(let currentMyRoomIndex = 0; currentMyRoomIndex < myRooms.length; currentMyRoomIndex++) {
					// If our room is memory is one of mines
					if(roomInMemory == myRooms[currentMyRoomIndex].name) {
						// We set the variable to true
						roomIsMine = true;
					}
				}
				
				// We also check if the room is occupied, reserved, or an exception
				let distantRoomOccupied = false;
				let distantRoomReserved = false;
				let distantRoomDiplomacy = false;
				
				// We check if the room has ownership
				if(Memory.rooms[roomInMemory].roomOwner != undefined) {
					distantRoomOccupied = true;
				}

				// We check if there's a reservation saved
				if(Memory.rooms[roomInMemory].roomOwnerReservation != undefined) {
					distantRoomReserved = true;
				}
				
				// We check all registered exceptions to see if one is true
				if(roomsExceptions.length > 0) {
					for(let exceptionIndex = 0; exceptionIndex < roomsExceptions.length; exceptionIndex++) {
						if(roomsExceptions[exceptionIndex] == roomInMemory) {
							distantRoomDiplomacy = true;
						}
					}
				}
				
				
				// if the room is mine, or meets on of the above criteria, we don't do stuff
				// if the room is not mine
				if(!roomIsMine && !distantRoomOccupied && !distantRoomReserved && !distantRoomDiplomacy) {
					
					// If anything is not defined yet, we define it, by security.
					
					if(Memory.rooms[roomInMemory].sourcesHomeRooms == undefined) {
						Memory.rooms[roomInMemory].sourcesHomeRooms = [];
					}
					
					if(Memory.rooms[roomInMemory].sourcesHomeRoomsDistance == undefined) {
						Memory.rooms[roomInMemory].sourcesHomeRoomsDistance = [];
					}
					
					if(Memory.rooms[roomInMemory].sourcesWorkNeed == undefined) {
						Memory.rooms[roomInMemory].sourcesWorkNeed = [];
					}
					
					if(Memory.rooms[roomInMemory].sourcesCarryNeed == undefined) {
						Memory.rooms[roomInMemory].sourcesCarryNeed = [];
					}
					
					if(Memory.rooms[roomInMemory].sourcesSenderLink == undefined) {
						Memory.rooms[roomInMemory].sourcesSenderLink = [];
					}
					
					
					
					// Now, either we already have the home rooms, and we'll have to assess if it's the best
					if(Memory.rooms[roomInMemory].sourcesHomeRooms.length == Memory.rooms[roomInMemory].sources.length){
						// A possibility would be the number of sender links having changed
						// Si une home room potentielle construit de nouveaux sender links, celle ci seulement doit être ré-assessée
						
						
						// Si la distance a changé entre la source et le sender link, ça veut dire que le sender a été détruit, donc il faut trouver un nouveau
						
						
						
					}
					
					
					
					
					
					
					// Or we don't already have a home room, and we need to find one, and we iterate over everything
					else {
						// So, for each source in the room
						for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sources.length; sourceIndex++) {						
							
							// we find the room with the closest sender link to the said source (rather than storage)
							let closestRoomDistance = 10000;
							let closestRoom = null;
							let closestSenderLinkId = null;
							

							// For each of my room having sender links
							for(let myRoomIndex = 0; myRoomIndex < myRoomsWithSenderLink.length; myRoomIndex++) {
								// We check the closeness of each source with each sender link
								for(let senderLinkIndex = 0; senderLinkIndex < myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length; senderLinkIndex++) {
									// First position : the sender link assessed
									let firstPosition = Game.getObjectById(myRoomsWithSenderLink[myRoomIndex].memory.senderLinks[senderLinkIndex]).pos;
									// Second position : the position of the source, retrieved from memory - we need to re-create it
									let secondPosition = new RoomPosition(Memory.rooms[roomInMemory].sourcesPos[sourceIndex].x, Memory.rooms[roomInMemory].sourcesPos[sourceIndex].y, Memory.rooms[roomInMemory].sourcesPos[sourceIndex].roomName);
									
									// We find the ideal path between the two
									// HIGHLY EXPENSIVE AND INSIDE MULTIPLE LOOPS - Crashes the CPU easily...
									let idealPath = PathFinder.search(firstPosition, secondPosition);
									
									let currentDistance = 10000;
									if(idealPath != undefined) {
										// Check if path is not empty
										currentDistance = idealPath.path.length;
									}
									
									if(currentDistance < closestRoomDistance) {
										closestRoomDistance = currentDistance;
										closestRoom = myRoomsWithSenderLink[myRoomIndex].name;
										closestSenderLinkId = myRoomsWithSenderLink[myRoomIndex].memory.senderLinks[senderLinkIndex];
									}
								}
							}
							
							// We already add the distance to the room memory 
							Memory.rooms[roomInMemory].sourcesHomeRoomsDistance.push(closestRoomDistance);
							
							// We check if the room isn't too far - arbitrary parameter here
							if(closestRoomDistance <= 68) {
								// we define it as the home room of the source
								Memory.rooms[roomInMemory].sourcesHomeRooms.push(closestRoom);

								
								// define the number of work parts needed, in function of size of source. Now only in number of creeps.
								Memory.rooms[roomInMemory].sourcesWorkNeed.push(1);
							
								// Commented formula for number of working creeps parts :
								// time it takes to get refilled, divided by 2 because each work body part takes 2 per turn
								// let workPartsNeeded = (Math.ceil(Memory.rooms[roomInMemory].sources[sourceIndex].energyCapacity / 300) / 2);
								// Memory.rooms[roomInMemory].sourcesWorkNeed.push(workPartsNeeded);
								
								// Number of carrying creeps needed, assumed that they each carry 400 units of ressource
								// We want that by the time they go and come back, 400 units of ressources have been produced
								// typical LDFH have 3 work parts, thus produce 6 per turn
								// As LDFM move 1 tile per turn, we want one creep per 400/6 = 66 tiles of distance
								
								let carryNeeded = Math.ceil(closestRoomDistance / (30));
								Memory.rooms[roomInMemory].sourcesCarryNeed.push(carryNeeded);
								Memory.rooms[roomInMemory].sourcesSenderLink.push(closestSenderLinkId);
							}
							// If one of the event is met
							else {
								// Then LD harvesting will not have to take place.
								Memory.rooms[roomInMemory].sourcesHomeRooms.push('null');
								Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders.push(0);
								Memory.rooms[roomInMemory].sourcesWorkNeed.push(0);
								Memory.rooms[roomInMemory].sourcesCarryNeed.push(0);
								Memory.rooms[roomInMemory].sourcesSenderLink.push(0);
							}
							
						}
					}
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					// ----------- Legacy code ------------------
					
					
					
					// we also want to reset these tables in othere cases to be adressed
					
					if(Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried == undefined) {
						// We also keep in memory the room we've already tried to link to the assessed room, in order to avoid multiple computations
						// This is gonna be an array of array with for a given source (which is a point in the first array) the list of rooms already tried
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried = [];
					}
					
					// For each source, we will store the number of sender links in each potential home room
					// So if new links get built or destroyed, we will re-assess the potential home room
					if(Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders == undefined) {
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders = [];
					}

					
					
					
					// So, for each source in the room
					for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sources.length; sourceIndex++) {						
						
						// we find the room with the closest sender link to the said source (rather than storage)
						let closestRoomDistance = 10000;
						let closestRoom = null;
						
						// Gonna be an array of potential home rooms tested
						let testedRooms = [];
						// Gonna be an array containing number of sender links in each potential home room
						let testedRoomsNumberSenders = [];

						// For each of my room having sender links
						for(let myRoomIndex = 0; myRoomIndex < myRoomsWithSenderLink.length; myRoomIndex++) {
							
							// We check if its relevance has already been tested
							let roomAlreadyTested = false;
							// We check each room already listed
							for(let alreadyTestedRoomsIndex = 0; alreadyTestedRoomsIndex < Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried[sourceIndex].length; alreadyTestedRoomsIndex++) {
								// And if the home room we assess is in the array (meaning we already checked)
								if(Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried[sourceIndex][alreadyTestedRoomsIndex] == myRoomsWithSenderLink[myRoomIndex]) {
									// We set the value to true
									roomAlreadyTested = true;
								}
							}
							
							// We check that the number of sender links didn't move since last assesment
							let senderLinkNumberChanged = false;
							// If the number of links stored during last assesment is different from the current number of sender links
							if(Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders[sourceIndex][myRoomIndex] != myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length) {
								// Then yes, there's been a change - added or destroyed links
								senderLinkNumberChanged = true;
							}
							
							
							// If we didn't check the room already, or if its number of sender links changed (ie new one making the potential home room more competitive)
							if(!roomAlreadyTested || !senderLinkNumberChanged) {
								// We check the closeness of each source with each sender link
								for(let senderLinkIndex = 0; senderLinkIndex < myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length; senderLinkIndex++) {
									// First position : the sender link assessed
									let firstPosition = Game.getObjectById(myRoomsWithSenderLink[myRoomIndex].memory.senderLinks[senderLinkIndex]).pos;
									// Second position : the position of the source, retrieved from memory - we need to re-create it
									let secondPosition = new RoomPosition(Memory.rooms[roomInMemory].sourcesPos[sourceIndex].x, Memory.rooms[roomInMemory].sourcesPos[sourceIndex].y, Memory.rooms[roomInMemory].sourcesPos[sourceIndex].roomName);
									
									// We find the ideal path between the two
									// HIGHLY EXPENSIVE AND INSIDE MULTIPLE LOOPS - Crashes the CPU easily...
									let idealPath = PathFinder.search(firstPosition, secondPosition);
									
									let currentDistance = 10000;
									if(idealPath != undefined) {
										// Check if path is not empty
										currentDistance = idealPath.path.length;
									}
									
									if(currentDistance < closestRoomDistance) {
										closestRoomDistance = currentDistance;
										closestRoom = myRoomsWithSenderLink[myRoomIndex].name;
									}
								}
							}
							// Now that we parsed all links of a potential room, we add the home room in the list of tested rooms
							testedRooms.push(myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length);
							// We also store the number of sender links
							testedRoomsNumberSenders.push(myRoomsWithSenderLink[myRoomIndex].memory.sender);
						}
						// And now that we've tested all potential rooms, we add the array of room tested in the memory of the room, under the correct source index
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried[sourceIndex].push(testedRooms);
						
						// We also store the correspondant number of sender links
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders[sourceIndex].push(testedRoomsNumberSenders);
						
						// We already add the distance to the room memory 
						Memory.rooms[roomInMemory].sourcesHomeRoomsDistance.push(closestRoomDistance);
						
						// ------------------------

						// We check if the room isn't too far - arbitrary parameter here
						if(!closestRoomDistance > 68) {
							// we define it as the home room of the source
							Memory.rooms[roomInMemory].sourcesHomeRooms.push(closestRoom);

							
							// define the number of work parts needed, in function of size of source. Now only in number of creeps.
							Memory.rooms[roomInMemory].sourcesWorkNeed.push(1);
						
							// Commented formula for number of working creeps parts :
							// time it takes to get refilled, divided by 2 because each work body part takes 2 per turn
							// let workPartsNeeded = (Math.ceil(Memory.rooms[roomInMemory].sources[sourceIndex].energyCapacity / 300) / 2);
							// Memory.rooms[roomInMemory].sourcesWorkNeed.push(workPartsNeeded);
							
							// Number of carrying creeps needed, assumed that they each carry 400 units of ressource
							// We want that by the time they go and come back, 400 units of ressources have been produced
							// typical LDFH have 3 work parts, thus produce 6 per turn
							// As LDFM move 1 tile per turn, we want one creep per 400/6 = 66 tiles of distance
							
							let carryNeeded = Math.ceil(closestRoomDistance / (30));
							Memory.rooms[roomInMemory].sourcesCarryNeed.push(carryNeeded);
						}
						// If one of the event is met
						else {
							// Then LD harvesting will not have to take place.
							Memory.rooms[roomInMemory].sourcesHomeRooms.push('null');
							Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders.push(0);
							Memory.rooms[roomInMemory].sourcesWorkNeed.push(0);
							Memory.rooms[roomInMemory].sourcesCarryNeed.push(0);
						}
					}	
				}
				
				
				
					// ----------- </Legacy code> ------------------
				
				// if the room is mine, or meets on of the above criteria, we don't do stuff
				else {
					// Then LD harvesting will not have to take place.
					Memory.rooms[roomInMemory].sourcesHomeRooms.push('null');
					Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders.push(0);
					Memory.rooms[roomInMemory].sourcesWorkNeed.push(0);
					Memory.rooms[roomInMemory].sourcesCarryNeed.push(0);
				}
			
			
			
			
			}
		}
    }
}

module.exports = processLDEnergyInfo;
