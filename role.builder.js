var withdrawSource = require('get.withdrawSource');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        

	    if(creep.memory.building && creep.carry.energy == 0) {
	        creep.memory.targetRepair = null;
            creep.memory.building = false;
            creep.say('🔄 Builder Gather');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity ) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }
	    
	    if(creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
	        creep.memory.role = 'upgrader';
	    }
	    
	    if(creep.memory.building == undefined) {
	        creep.memory.building = false;
	    }
	    
	    if(creep.memory.targetRefill == undefined) {
	        creep.memory.targetRefill = null;
	    }
	    if(creep.memory.targetBuild == undefined) {
	        creep.memory.targetBuild = null;
	    }
	    if(creep.memory.targetRepair == undefined) {
	        creep.memory.targetRepair = null;
	    }
	    
	    
	    if(creep.memory.building) {
	        // First we find a target to build, if we don't have one
	        if(Game.getObjectById(creep.memory.targetBuild) == null) {
	            // We just take the closest one, if it exists
	            if(creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) != null) {
	                creep.memory.targetBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES).id;
	            }
	        }
	        
	        // We also look for a repairing target, if we don't have one, or if our target is full HP
	        if(Game.getObjectById(creep.memory.targetRepair) == null || Game.getObjectById(creep.memory.targetRepair).hits == Game.getObjectById(creep.memory.targetRepair).hitsMax) {
                
                // First we take our structures to repair them, but not the controller or the ramparts
	            if(creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER  && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL)}) != null){
	                creep.memory.targetRepair = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART}).id;
	            }
	            
	            
	            // And if all our structures are fine, then we repair the rest - roads for instance
	            if(Game.getObjectById(creep.memory.targetRepair) == null || Game.getObjectById(creep.memory.targetRepair).hits == Game.getObjectById(creep.memory.targetRepair).hitsMax) {
	                if(creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax  && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)}) != null){
	                    creep.memory.targetRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART}).id;
	                }
	            }
	            /*
	            // And if all the structures are fine, then we repairs remparts
	            if(Game.getObjectById(creep.memory.targetRepair) == null || Game.getObjectById(creep.memory.targetRepair).hits == Game.getObjectById(creep.memory.targetRepair).hitsMax) {
	                if(creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < 15000  && s.structureType == STRUCTURE_RAMPART)}) != null){
	                    creep.memory.targetRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < 15000 && s.structureType == STRUCTURE_RAMPART}).id;
	                }
	            }
	            
	            // And finally walls
	            if(Game.getObjectById(creep.memory.targetRepair) == null || (Game.getObjectById(creep.memory.targetRepair).hits >= 15000 && Game.getObjectById(creep.memory.targetRepair).structureType == STRUCTURE_RAMPART)) {
	                if(creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.hits < 15000  && s.structureType == STRUCTURE_WALL)}) != null){
	                    creep.memory.targetRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < 15000 && s.structureType == STRUCTURE_WALL}).id;
	                }
	            }*/
	        }
	        
	        // If we have a target to repair, now
	        if(Game.getObjectById(creep.memory.targetRepair) != null) {
	            // But it is full HP
	            if(Game.getObjectById(creep.memory.targetRepair).hits == Game.getObjectById(creep.memory.targetRepair).hitsMax) {
	                // We take a new one, with one of our structures
	                if(creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax  && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)}) != null){
	                    creep.memory.targetRepair = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART}).id;
	                }
	            }
	        }
	        
	        // And after all that, if we have a target to repair, we go repair it
            if(Game.getObjectById(creep.memory.targetBuild) != null) {
                creep.memory.targetRefill = null;
                if(creep.build(Game.getObjectById(creep.memory.targetBuild)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.targetBuild), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if(Game.getObjectById(creep.memory.targetRepair) != null && Game.getObjectById(creep.memory.targetBuild) == null) {
                creep.memory.targetRefill = null;
                if(creep.repair(Game.getObjectById(creep.memory.targetRepair)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.targetRepair), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }

	    }
	    
	    if(!creep.memory.building) {
            withdrawSource.run(creep);
            if(Game.getObjectById(creep.memory.targetRefill) != null) {
                if(creep.withdraw(Game.getObjectById(creep.memory.targetRefill),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.targetRefill), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            
	    }
	}
};

module.exports = roleBuilder;