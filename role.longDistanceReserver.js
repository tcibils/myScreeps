/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.longDistanceReserver');
 * mod.thing == 'a thing'; // true
 */

var longDistanceReserver = {
    
    run: function(creep) {
		// If the need origin of the creep is defined
		if(creep.memory.needOriginPos != 'undefined') {
			// If we are in the target room
			if(creep.room.name == creep.memory.targetRoom) {
				// If reserving the controller is not in range, we move towards it
				if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
				// In case it's bugged, we try moving to the right - cheap debug...
				if(creep.reserveController(creep.room.controller) == ERR_NO_PATH) {
					creep.move(RIGHT);
				}
			}
			// If we're not in the target room
			else {
				// We define a new position which is our needOriginPos - when stored in position, it's not a valid roomPosition anymore...
				let targetControllerPos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.targetRoom)
				// And move towards it
				creep.moveTo(targetControllerPos);
			}
		}
		
		// If it's not defined in memory
		if(creep.memory.needOriginPos == 'undefined') {
			// If we are in the target room
			if(creep.room.name == creep.memory.targetRoom) {
				// We move towards the room controller to reserve it
				if(creep.room.controller) {
					if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
					if(creep.reserveController(creep.room.controller) == ERR_NO_PATH) {
						creep.move(RIGHT);
					}
				}
			}
			// If we're not
			else {
				// We find the best exit to our target room, and move towards it.
				var localExit = creep.room.findExitTo(creep.memory.targetRoom);
				creep.moveTo(creep.pos.findClosestByRange(localExit));
			}
		}        
        
    }
};

module.exports = longDistanceReserver;