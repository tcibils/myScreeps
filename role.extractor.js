/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.extractor');
 * mod.thing == 'a thing'; // true
 */

var roleExtractor = {
    run: function(creep) {
        if(creep.memory.mining == undefined) {
            creep.memory.mining = false;
        }
        
        if(creep.memory.mineralTarget == null) {
            var primaryTarget = creep.pos.findClosestByPath(FIND_MINERALS);
            if(primaryTarget != null) {
                creep.memory.mineralTarget = primaryTarget.id;
            }
        }
        
        if(creep.memory.depositTarget == null) {
            if(creep.room.terminal != null) {
                creep.memory.depositTarget = creep.room.terminal.id;
            }
        }
        
        if(creep.memory.mining) {
            if(_.sum(creep.carry) < creep.carryCapacity) {
                if(creep.harvest(Game.getObjectById(creep.memory.mineralTarget)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.mineralTarget));
                }
            }
            
            if(_.sum(creep.carry) == creep.carryCapacity || creep.ticksToLive < 50) {
                creep.memory.mining = false;
            }
        }
        
        if(!creep.memory.mining) {
            if(_.sum(creep.carry) > 0) {
                if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget));
                }
                if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget));
                }
                if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget));
                }
                if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_OXYGEN) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget));
                }
            }
            
            if(_.sum(creep.carry) == 0 && creep.ticksToLive > 50) {
                creep.memory.mining = true;
            }
            
        }
        
    }
};

module.exports = roleExtractor;