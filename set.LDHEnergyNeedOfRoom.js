var setLDHEnergyNeedOfRoom = {
    run: function(treatedRoom) {
		
        // Ajouter un "every X tick" ?
		
		// For every room we have in memory
		for(var roomInMemory in Memory.rooms) {
			// If the sources have home rooms defined
			if(Memory.rooms[roomInMemory].sourcesHomeRooms != undefined) {
				// For each of these sources
				for(let sourceIndex = 0; sourceIndex < Memory.rooms[roomInMemory].sourcesHomeRooms; sourceIndex++) {
					// If the home room is the room we're treating 
					if(Memory.rooms[roomInMemory].sourcesHomeRooms[sourceIndex] == treatedRoom) {
					
					}
				}
			}	
		}
		
    }
}

module.exports = setLDHEnergyNeedOfRoom;
