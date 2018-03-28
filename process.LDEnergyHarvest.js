/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */

var processLDEnergyInfo = {
    run: function() {
        
		// Do all that every 2000 or 5000 turns for instance - we only need to update it if I got a new room
		
		// create variable array with rooms to be excluded (parameters), for diplomacy (Ringo86)
		// create variable array with my rooms names, for comparaison later
		
		
		// for each of rooms having a memory
		
			// if the room is mine, we don't do stuff
		
			// if the room is not mine
				// for each source in the room
					// we find the room with the closest storage to the said source
					// we define it as the home room of the source
					// come up with a formula to get number of LDFMovers in function of distance from source to said storage
					// define the number of work parts needed as well, in function of size of source

    }
}

module.exports = processLDEnergyInfo;
