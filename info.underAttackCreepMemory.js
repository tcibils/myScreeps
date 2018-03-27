/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('info.underAttackCreepMemory');
 * mod.thing == 'a thing'; // true
 */
var underAttackCreepMemory = {
    run: function(creep) {
        if(creep.memory.underAttack == undefined) {
            creep.memory.underAttack = false;
        }

        if(creep.memory.underAttackRoom == undefined) {
            creep.memory.underAttackRoom = null;
        }

        if(creep.hits < creep.hitsMax && !creep.memory.underAttack && creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
            creep.say('HEY!!', true);
            creep.memory.underAttack = true;
            creep.memory.underAttackRoom = creep.room.name;
        }

        if(creep.memory.underAttack) {
            creep.say('Im hit');
        }

        if(creep.memory.underAttack && creep.room.name == creep.memory.underAttackRoom && creep.room.find(FIND_HOSTILE_CREEPS).length == 0) {
            creep.say('Safe =)');
            creep.memory.underAttack = false;
            creep.memory.underAttackRoom = null;
        }
    }
};

module.exports = underAttackCreepMemory;
