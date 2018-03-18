
var getDepositTarget = require('get.depositTarget');

var roleSpreaderEfficient = {
    run: function(creep) {
        var spawningPoints = creep.room.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_SPAWN}} );

        var activateLog = false;
        
        // If we do not have a storage attached
        if(Game.getObjectById(creep.memory.storageAttached) == null) {
            // If we have one, we take the closest storage
            creep.memory.storageAttached = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_STORAGE}}).id;
                
            if(creep.memory.storageAttached != null) {
                if(activateLog) {
                    console.log('For creep ' + creep.name + ', we attached the following storage : ' + creep.memory.storageAttached)
                }
            }
            if(creep.memory.storageAttached == null) {
                if(activateLog) {
                    console.log('For creep ' + creep.name + ', we were not able to find a storage to attach : '+ creep.memory.storageAttached);
                }
            }
            
        }
        
        if(creep.memory.depositing == undefined) {
            creep.memory.depositing = false;
        }
        
        if(creep.ticksToLive < 20) {
            if(creep.transfer(Game.getObjectById(creep.memory.storageAttached), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.storageAttached));
            }
            if(creep.carry[RESOURCE_ENERGY] == 0) {
                creep.say('Hara Kiri');
                creep.suicide();
            }
        }
        
        if(Game.getObjectById(creep.memory.storageAttached) != null && spawningPoints.length > 0 && creep.ticksToLive >= 20) {
            if(creep.memory.depositing) {
                if(creep.carry[RESOURCE_ENERGY] > 0) {
                    getDepositTarget.run(creep);
                    if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.depositTarget))
                    }
                }
                if(creep.carry[RESOURCE_ENERGY] == 0) {
                    creep.memory.depositing = false;
                }
                
            }
            
            if(!creep.memory.depositing) {
                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                    if(creep.withdraw(Game.getObjectById(creep.memory.storageAttached), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.storageAttached));
                    }
                }
                
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                    creep.memory.depositing = true;
                }
            }
        }
        
    }
};

module.exports = roleSpreaderEfficient;
