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
			
			// if room reserved or exception ?

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
					
					// we first reset all variables in memory
					Memory.rooms[roomInMemory].memory.sourcesHomeRooms = [];
					Memory.rooms[roomInMemory].memory.sourcesWorkNeed = [];
					Memory.rooms[roomInMemory].memory.sourcesCarryNeed = [];
					
					// for each source in the room
					for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sources.length; sourceIndex++) {
						// we find the room with the closest storage to the said source
						let closestRoomDistance = 10000;
						let closestRoom = null;
						
						// FOr each of my room having sender links
						for(let myRoomIndex = 0; myRoomIndex < myRoomsWithSenderLink.length; myRoomIndex++) {
							// We check the closeness of each source with each sender link
							for(let senderLinkIndex = 0; senderLinkIndex < myRoomsWithSenderLink[myRoomIndex].memory.senderLinks.length; senderLinkIndex++) {
								let idealPath = PathFinder.search(
									Game.getObjectById(myRoomsWithSenderLink[myRoomIndex].memory.storages[senderLinkIndex]).pos,
									Memory.rooms[roomInMemory].sources[sourceIndex].pos);
								
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
						
						// If the source is close enough to a deposit, then we define the home room and all (arbitrary value)
						if(closestRoomDistance <= 210) {
							// we define it as the home room of the source
							Memory.rooms[roomInMemory].memory.sourcesHomeRooms.push(closestRoom);
										
							// define the number of work parts needed, in function of size of source. Now only in number of creeps.
							Memory.rooms[roomInMemory].memory.sourcesWorkNeed.push(1);
						
							// Commented formula for number of working creeps parts :
							// time it takes to get refilled, divided by 2 because each work body part takes 2 per turn
							// let workPartsNeeded = (Math.ceil(Memory.rooms[roomInMemory].sources[sourceIndex].energyCapacity / 300) / 2);
							// Memory.rooms[roomInMemory].memory.sourcesWorkNeed.push(workPartsNeeded);
							
							// Number of carrying creeps needed, assumed that they each carry 400 units of ressource
							// We want that by the time they go and come back, 400 units of ressources have been produced
							// typical LDFH have 3 work parts, thus produce 6 per turn
							// As LDFM move 1 tile per turn, we want one creep per 400/6 = 66 tiles of distance
							
							let carryNeeded = Math.ceil(closestRoomDistance / (400/6));
							Memory.rooms[roomInMemory].memory.sourcesCarryNeed.push(carryNeeded);
						}
						// If the source is too far from a deposit, we ignore it
						else {
							Memory.rooms[roomInMemory].memory.sourcesHomeRooms.push('null');
							Memory.rooms[roomInMemory].memory.sourcesWorkNeed.push(0);
							Memory.rooms[roomInMemory].memory.sourcesCarryNeed.push(0);
						}
					}	
				}
			}
		}
    }
}

module.exports = processLDEnergyInfo;
