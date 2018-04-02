
var processLDPowerInfo = {
    run: function() {
        
		// Parameters :
		let minimumPowerSourceLivingTime = 3500;
		
		
		// Starting now :
		// For each of rooms having a memory
		for(var roomInMemory in Memory.rooms) {
			// If there are some power sources
			if(Memory.rooms[roomInMemory].powerSources.length > 0) {
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
					
					// If we have the above conditions
					if(powerSourceLivingLongEngough && powerSourceEnoughSpace) {
						// We assess the distances - not before, as this is way more costly to do.
						
					}
				}
        // Condition 1 sur le nombre de ticks - je dirais 3500 mini restants
		// Condition 2 sur la proximité - Il nous faut les deux rooms non-encore power-occupées les plus proches à moins de 200 cases
		
		// On n'aura pas besoin de faire la recherche à chaque fois, une seule fois devrait suffire. C'est pas comme les sources avec les nouvelles rooms construites.
		
		// On va spawner 
		// Warriors 20-20 x3 cout 2600
		// Healers 25-25 x3 cout 7500
		// Total 10100, une paire ça passe en une fois pour un room lvl 8
		
		// On comptera les creeps sans leur home room =)
				

			}
		}
    }
}

module.exports = processLDPowerInfo;
