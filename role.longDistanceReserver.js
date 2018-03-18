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
        // If we are in the target room
        if(creep.room.name == creep.memory.targetRoom) {
            if(creep.room.controller) {
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        
        else if(creep.room.name == creep.memory.homeRoom) {
            var localExit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(localExit));
        }
        
        else {
            var localExit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(localExit));
        }
        
        
    }
};

module.exports = longDistanceReserver;