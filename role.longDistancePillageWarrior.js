/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.longDistancePillageWarrior');
 * mod.thing == 'a thing'; // true
 */

var longDistancePillageWarrior = {
    run: function(creep) {
        if(creep.memory.targetRoom == undefined) {
            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', issue : no target Room')
        }
        
        if(creep.memory.targetRoom != creep.room.name) {
            var localExit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(localExit));
        }
        
        if(creep.memory.targetRoom == creep.room.name) {
            
            
            // Destroy juiciest target
            
            
        }
        
        
    }
};

module.exports = longDistancePillageWarrior;