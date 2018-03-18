var withdrawSource = require('get.withdrawSource');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 Upgrader harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy > 0) {
	        creep.memory.targetRefill = null;
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }
	    
	    if(creep.memory.targetRefill == undefined) {
	        creep.memory.targetRefill = null;
	    }
	    
	    if(creep.memory.upgrading == undefined) {
	        creep.memory.upgrading = false;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE/* || creep.signController(creep.room.controller, 'Member of alliance #overlords.') == ERR_NOT_IN_RANGE*/) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                
            }
        }
        if(!creep.memory.upgrading) {
            withdrawSource.run(creep);
            if(creep.withdraw(Game.getObjectById(creep.memory.targetRefill),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(Game.getObjectById(creep.memory.targetRefill), {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 3});
            }
        }
	}
};

module.exports = roleUpgrader;