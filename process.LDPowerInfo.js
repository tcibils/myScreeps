
var processLDPowerInfo = {
    run: function() {
        
		// Starting now :
		// For each of rooms having a memory
		for(var roomInMemory in Memory.rooms) {
			if(Memory.rooms[roomInMemory].powerSources.length > 0) {
				
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
