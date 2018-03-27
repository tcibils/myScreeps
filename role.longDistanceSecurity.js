/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.longDistanceSecurity');
 * mod.thing == 'a thing'; // true
 */


var underAttackCreepMemory = require('info.underAttackCreepMemory');

var longDistanceSecurity = {
    run: function(creep) {

        underAttackCreepMemory.run(creep);

        if(creep.memory.targetRoom == undefined) {
            console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', ISSUE : NO TARGET ROOM')
        }
        else {
            if(creep.room.name != creep.memory.targetRoom) {
                var localExit = creep.room.findExitTo(creep.memory.targetRoom);
                creep.moveTo(creep.pos.findClosestByRange(localExit), {visualizePathStyle: {stroke: '#ff0000'}, reusePath: 5});
                creep.say('Helping');
            }

            if(creep.room.name == creep.memory.targetRoom) {
                if(Game.getObjectById(creep.memory.attackTarget) == undefined || Game.time % 10 == 0) {
                    var mainTarget = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: function(object) {return object.getActiveBodyparts(HEAL) > 0}});
                    if(mainTarget != null) {
                        creep.memory.attackTarget = mainTarget.id;
                    }
                    if(mainTarget == null ) {
                        var secondaryTarget = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                        if(secondaryTarget != null) {
                            creep.memory.attackTarget = secondaryTarget.id;
                        }
                    }
                }
                if(Game.getObjectById(creep.memory.attackTarget) != undefined) {
                    creep.say('Attacking!');
                    if(creep.rangedAttack(Game.getObjectById(creep.memory.attackTarget)) == ERR_NOT_IN_RANGE || creep.attack(Game.getObjectById(creep.memory.attackTarget)) == ERR_NOT_IN_RANGE) {
                        if(creep.moveTo(Game.getObjectById(creep.memory.attackTarget), {visualizePathStyle: {stroke: '#ff0000'}}) == ERR_NO_PATH) {
                            creep.move(RIGHT);
                        }
                    }


                }
                if(Game.getObjectById(creep.memory.attackTarget) == undefined) {
                    creep.say('PACIFIED')
                }

            }
        }


    }
};

module.exports = longDistanceSecurity;
