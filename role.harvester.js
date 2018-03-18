var placesOfSource = require('get.placesOfSource');
var freeSpotsOfSource = require('get.freeSpotsOfSource');
var ennemyAroundSource = require('get.ennemyAroundSource');
var getDepositTarget = require('get.depositTarget');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.isThereAFirstSourceAttached == undefined) {
            creep.memory.isThereAFirstSourceAttached = false;
        }
        
        if(creep.memory.isThereAFirstSourceAttached == false) {
            var potentialTarget = creep.pos.findClosestByPath(FIND_SOURCES);
            if(potentialTarget != null) {
                creep.memory.attachedSource = potentialTarget.id;
                creep.memory.isThereAFirstSourceAttached = true;
            }
        }
        
        if(creep.memory.isThereAFirstSourceAttached == true) {
            // If creep is not filled, it goes search for energy
	        if(creep.carry.energy < creep.carryCapacity) {
	            // If the source attached has as much creeps as room, we continue to mine it (>= 0 bc we take this creep into account)
                if(freeSpotsOfSource.run(Game.getObjectById(creep.memory.attachedSource)) >= 0 && !ennemyAroundSource.run(Game.getObjectById(creep.memory.attachedSource))) { 
                    if(creep.harvest(Game.getObjectById(creep.memory.attachedSource)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.attachedSource), {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                // If all spaces are taken for the source of the creep, we look for another one
	            else {
	                var creepHasFoundANewSource = false;
	                // If there is a source with some space, we attach it to the creep
                    var sources= creep.room.find(FIND_SOURCES);
    	            for(var i = 0; i<sources.length; i++) {
	                    if(freeSpotsOfSource.run(sources[i]) > 0 && !ennemyAroundSource.run(sources[i])) {
	                        creep.memory.attachedSource = sources[i].id;
	                        creepHasFoundANewSource = true;
	                        if(creep.harvest(sources[i]) == ERR_NOT_IN_RANGE) {
                                 creep.moveTo(sources[i], {visualizePathStyle: {stroke: '#00ff00'}});
                        }
	                    }
	                }
    	            // If there is none, then we change the role of the creeps
	                if(!creepHasFoundANewSource) {
	                    // creep.memory.role = 'builder';
	                }
	            }  
            }
        
            // If the creep is full, we get the energy back to the base
            else {
                getDepositTarget.run(creep);

                if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget), {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
	    }
    }
};

module.exports = roleHarvester;