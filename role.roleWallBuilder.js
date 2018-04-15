
var withdrawSource = require('get.withdrawSource');

var roleWallBuilder = {
    run: function(creep) {
		
		// Parameters changeable by player
		var activateLog = false;
        var wallMaxHPtable = [1000, 5000, 10000, 15000, 35000, 50000, 75000, 100000, 125000,150000,175000/*,200000,225000,250000,275000,300000*/];
        var rampartMaxHPtable = [1000, 5000, 10000, 15000, 35000, 50000, 75000, 100000, 125000,150000,175000/*,200000,225000,250000,275000,300000*/];
		
		// Variables used
		let roomLevel = creep.room.controller.level;
		let wallsToBuild = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_WALL});
		let rampartsToBuild = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_WALL});
		let wallsOfRoom = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL});
		let rampartsOfRoom = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
		
		if(creep.memory.gathering == undefined) {creep.memory.gathering = false;}
		
		// If we have enough energy
		if(!creep.memory.gathering) {
			
			// We need to build walls while maintaining ramparts

		}




		// If we're out of energy
		if(creep.memory.gathering) {
			// While we're under capacity
			if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
				// We look for a withdraw source
				withdrawSource.run(creep);
				// If we're too far from it
				if(creep.withdraw(Game.getObjectById(creep.memory.targetRefill)) == ERR_NOT_IN_RANGE) {
					// We move towards it
					creep.moveTo(Game.getObjectById(creep.memory.targetRefill));
				}
			}
			
			// If we are full of energy
			if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
				// Then we stop gathering
				creep.memory.gathering = false;
			}
		}
		
    }
};

module.exports = roleWallBuilder;
