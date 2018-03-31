// To Do :
// Si le nombre de sender links change dans la home room sélectionée (en plus ou en moins), re.assess toutes les rooms
// Garder en mémoire les rooms déjà assess pour pas les refaire tant que le nombre de sender links a pas changé


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
			
			// for each of rooms having a memory
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
				
				// if the room is mine, we don't do stuff
				// if the room is not mine
				if(!roomIsMine) {
					
					// we first reset all variables in memory. To each source :
					// 1. A Home room
					Memory.rooms[roomInMemory].sourcesHomeRooms = [];
					// We keep in memory the closest distance found so far.
					Memory.rooms[roomInMemory].sourcesHomeRoomsDistance = [];

					// 2. A number of harvesters needed (currently number of creeps rather than work body parts)
					Memory.rooms[roomInMemory].sourcesWorkNeed = [];

					// 3. A number of carriers needed (currently number of creeps as well)
					Memory.rooms[roomInMemory].sourcesCarryNeed = [];
					
					
					
					// we also want to reset these tables in othere cases to be adressed
					
					if(Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried == undefined) {
						// We also keep in memory the room we've already tried to link to the assessed room, in order to avoid multiple computations
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried = [];
					}

					if(Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders == undefined) {
						// Nevertheless, if the rooms already tried have changed their number of senders, we shall retry the computation
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders = [];
					}

					
					
					
					// So, for each source in the room
					for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sources.length; sourceIndex++) {						
						
						// we find the room with the closest sender link to the said source (rather than storage)
						let closestRoomDistance = 10000;
						let closestRoom = null;
						let closestRoomNumberSenderLinks = 0;
						let testedRooms = [];

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
							
							// If we didn't check the room already
							if(!roomAlreadyTested) {
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
										closestRoomNumberSenderLinks = myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length;
									}
								}
							}
							// Now that we parsed all links of a potential room, we add the home room in the list of tested rooms
							testedRooms.push(myRoomsWithSenderLink[myRoomIndex]);							
						}
						// And now that we've tested all potential rooms, we add the array of room tested in the memory of the room, under the correct source index
						Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTried[sourceIndex].push(testedRooms);
						
						// We already add the distance to the room memory 
						Memory.rooms[roomInMemory].sourcesHomeRoomsDistance.push(closestRoomDistance);

						// Now we have the "raw" information. But certain elements might make us decide that no harvesting is needed :
						// 1. Room is too far
						// 2. Room is occupied by some onlse
						// 3. Room is reserved by someone else
						// 4. We specifically agreed not to harvest it for diplomatic reasons

						let closestRoomTooFar = false;
						let distantRoomOccupied = false;
						let distantRoomReserved = false;
						let distantRoomDiplomacy = false;

						// We check if the room isn't too far - arbitrary parameter here
						if(closestRoomDistance > 68) {
							closestRoomTooFar = true;
						}

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
						
						// If we encounter none of these events, we add the info
						if(!closestRoomTooFar && !distantRoomOccupied && !distantRoomReserved && !distantRoomDiplomacy) {
							// we define it as the home room of the source
							Memory.rooms[roomInMemory].sourcesHomeRooms.push(closestRoom);
							Memory.rooms[roomInMemory].sourcesHomeRoomsAlreadyTriedNumberSenders.push(closestRoomNumberSenderLinks);

							
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
			}
		}
    }
}

module.exports = processLDEnergyInfo;
