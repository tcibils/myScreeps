
var processLDPowerInfo = {
    run: function() {
        
		// Starting now :
		// For each of rooms having a memory
		for(var roomInMemory in Memory.rooms) {
			if(Memory.rooms[roomInMemory].powerSources.length > 0) {
				
				// On va devoir définir de quelle(s) room(s) on va partir - très probablement forcément des niveaux 8
				
				// Il faudra trois types de creeps, en quantités différentes :
				// 1. Le frappeur
				// 2. Le healeur
				// 3. Le carry
				

			}
		}
    }
}

module.exports = processLDPowerInfo;
