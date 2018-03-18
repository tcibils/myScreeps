/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.longDistancePillageCarry');
 * mod.thing == 'a thing'; // true
 */


var longDistancePillageCarry = {
    run: function(creep) {
        if(creep.memory.targetRoom == undefined) {
            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', issue : no target Room')
        }
        
        if(creep.memory.gathering == undefined) {
            creep.memory.gathering = false;
        }
        
        let creepTotalCarry = _.sum(creep.carry);
        
        if(creep.room.name == creep.memory.targetRoom) {
            if(creep.memory.gathering) {
                
                
                // Go pickup resources
                if(Game.getObjectById(creep.memory.pickupTarget) == undefined) {
                    let mainTarget = creep.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE)
                        }
                    });
                    if(maintTarget != null){
                        creep.memory.pickupTarget = mainTarget.id;
                    }
                }            
                
                if(creep.carryCapacity == creepTotalCarry) {
                    creep.memory.gathering = false;
                }
            }
            
            if(!creep.memory.gathering) {
                // Get home
                var localExit = creep.room.findExitTo(creep.memory.homeRoom);
                creep.moveTo(creep.pos.findClosestByRange(localExit));
            }
        }
        
        if(creep.room.name == creep.memory.homeRoom) {
            if(creep.memory.gathering) {
                // Fo to target room
                var localExit = creep.room.findExitTo(creep.memory.targetRoom);
                creep.moveTo(creep.pos.findClosestByRange(localExit));
            }
            
            if(!creep.memory.gathering) {
                
                
                // Transfer resources
                
                
                if(creepTotalCarry == 0) {
                    creep.memory.gathering = true;
                }
            }
            
        }
        
        if(creep.room.name != creep.memory.targetRoom && creep.room.name != creep.memory.homeRoom) {
            if(creep.memory.gathering) {
                // Fo to target room
                var localExit = creep.room.findExitTo(creep.memory.targetRoom);
                creep.moveTo(creep.pos.findClosestByRange(localExit));
            }
            
            if(!creep.memory.gathering) {
                // Fo to home room
                var localExit = creep.room.findExitTo(creep.memory.homeRoom);
                creep.moveTo(creep.pos.findClosestByRange(localExit));
            }
        }
        
        
    }
};

module.exports = longDistancePillageCarry;