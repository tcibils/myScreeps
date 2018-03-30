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
					// 2. A number of harvesters needed (currently number of creeps rather than work body parts)
					Memory.rooms[roomInMemory].sourcesWorkNeed = [];
					// 3. A number of carriers needed (currently number of creeps as well)
					Memory.rooms[roomInMemory].sourcesCarryNeed = [];
					Memory.rooms[roomInMemory].sourcesHomeRoomsDistance = [];
					
					// So, for each source in the room
					for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sources.length; sourceIndex++) {
						// we find the room with the closest sender link to the said source (rather than storage)
						let closestRoomDistance = 10000;
						let closestRoom = null;
						
						// For each of my room having sender links
						for(let myRoomIndex = 0; myRoomIndex < myRoomsWithSenderLink.length; myRoomIndex++) {
							// We check the closeness of each source with each sender link
							for(let senderLinkIndex = 0; senderLinkIndex < myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length; senderLinkIndex++) {
								// First position : the sender link assessed
								let firstPosition = Game.getObjectById(myRoomsWithSenderLink[myRoomIndex].memory.senderLinks[senderLinkIndex]).pos;
								// Second position : the position of the source, retrieved from memory - we need to re-create it
								let secondPosition = new RoomPosition(Memory.rooms[roomInMemory].sourcesPos[sourceIndex].x, Memory.rooms[roomInMemory].sourcesPos[sourceIndex].y, Memory.rooms[roomInMemory].sourcesPos[sourceIndex].roomName);
								
								// We find the ideal path between the two
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
						if(closestRoomDistance > 210) {
							closestRoomTooFar = true;
						}

						// We check if the room has ownership
						if(Memory.rooms[roomInMemory].roomOwner != "none") {
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
						
						Memory.rooms[roomInMemory].sourcesHomeRoomsDistance.push(closestRoomDistance);
						// If we encounter none of these events, we add the info
						if(!closestRoomTooFar && !distantRoomOccupied && !distantRoomReserved && !distantRoomDiplomacy) {
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
							
							let carryNeeded = Math.ceil(closestRoomDistance / (400/6));
							Memory.rooms[roomInMemory].sourcesCarryNeed.push(carryNeeded);
						}
						// If one of the event is met
						else {
							// Then LD harvesting will not have to take place.
							Memory.rooms[roomInMemory].sourcesHomeRooms.push('null');
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
