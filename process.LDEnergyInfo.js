var processLDEnergyInfo = {
    run: function() {
        
		// Do all that every 2000 or 5000 turns for instance - we only need to update it if I got a new room
        if(Game.time % 5000 == 0) {
			// variable array with rooms to be excluded (parameters), for diplomacy (Ringo86)
			let roomsExceptions = [];
			
			// variable array with my rooms names, for comparaison later
			let myRooms = _.filter(Game.rooms, (currentRoom) => currentRoom.controller != undefined && currentRoom.controller.my);
			
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
					// for each source in the room
					for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sources.length; sourceIndex++) {
						// we find the room with the closest storage to the said source
						// we define it as the home room of the source
						// come up with a formula to get number of LDFMovers in function of distance from source to said storage
						// define the number of work parts needed as well, in function of size of source
						let closestRoomDistance = 1000;
						let closestRoom = null;
						
						for(let myRoomIndex = 0; myRoomIndex < myRooms.length; myRoomIndex++) {
							
							
						}
					}
				}	
			}
		}
    }
}

module.exports = processLDEnergyInfo;
