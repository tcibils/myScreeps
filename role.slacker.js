/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role,slacker');
 * mod.thing == 'a thing'; // true
 */
 
 var roleSlacker = {
     run: function(creep) {
         var activateLog = false;
        // If we have no link attached
        if(Game.getObjectById(creep.memory.linkAttached) == null) {
            if(creep.room.memory.receiverLinks != undefined) {
                // We take all spreaders of the foom
                var spreaders = creep.room.find(FIND_MY_CREEPS,{filter: {memory: {role: 'spreader'}}});
                // We iterate on the receiver links of the room
                for(let i = 0; i<creep.room.memory.receiverLinks.length; i++) {
                    var receiverCounter = 0;
                    // And on the spreaders listed, while we didn't found any spreader attached
                    for(let j = 0; j<spreaders.length && receiverCounter < 2; j++) {
                        // If one of the spreaders has this receiver link attached, then this receiver is alreadry taken. Comparing stored ID, its OK
                        if(spreaders[j].memory.linkAttached == creep.room.memory.receiverLinks[i]) {
                            receiverCounter++;
                        }
                    }
                    // If it's not taken, then we attachit. It might be overwritten by another non-taken link.
                    if(receiverCounter < 2) {
                        creep.memory.linkAttached = creep.room.memory.receiverLinks[i];
                    }
                }
            }
            if(Game.getObjectById(creep.memory.linkAttached) != null) {
                if(activateLog) {
                    console.log('Room ' + creep.room.name + ', for creep ' + creep.name + ', we attached the following link : ' + creep.memory.linkAttached)
                }
            }
            if(Game.getObjectById(creep.memory.linkAttached) == null) {
                if(activateLog) {
                    console.log('Room ' + creep.room.name + ', for creep ' + creep.name + ', we were not able to find a link to attach : '+ creep.memory.linkAttached);
                }
            }
        }
        
        
        // If we do not have a storage attached
        if(Game.getObjectById(creep.memory.storageAttached) == null) {
            // We need to have a link attached to work
            if(Game.getObjectById(creep.memory.linkAttached) != null) {
                // If we have one, we take the closest storage
                creep.memory.storageAttached = Game.getObjectById(creep.memory.linkAttached).pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_STORAGE}}).id;
                
                if(creep.memory.storageAttached != null) {
                    if(activateLog) {
                        console.log('RoomFor creep ' + creep.name + ', we attached the following storage : ' + creep.memory.storageAttached)
                    }
                }
                if(creep.memory.storageAttached == null) {
                    if(activateLog) {
                        console.log('For creep ' + creep.name + ', we were not able to find a storage to attach : '+ creep.memory.storageAttached);
                    }
                }
            }
        }
         
         
        if(creep.memory.pickingUp == undefined) {
            creep.memory.pickingUp = false;
        }
        
        if(creep.ticksToLive < 5) {
            creep.memory.pickingUp = false;
            if(creep.carry[RESOURCE_ENERGY] == 0) {
                creep.say('Hara Kiri');
                creep.suicide();
            }
        }
        
        
        if(Game.getObjectById(creep.memory.linkAttached) != undefined && Game.getObjectById(creep.memory.storageAttached)  != undefined) {
            if(creep.memory.pickingUp) {
                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                    if(creep.withdraw(Game.getObjectById(creep.memory.linkAttached), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.linkAttached));
                    }
                }
            
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity || Game.getObjectById(creep.memory.linkAttached).energy == 0) {
                    creep.memory.pickingUp = false;
                }
            
            }
         
         
            if(!creep.memory.pickingUp) {
                if(creep.carry[RESOURCE_ENERGY] > 0) {
                        if(creep.transfer(Game.getObjectById(creep.memory.storageAttached), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.storageAttached));
                    }                
                }
            
                if(creep.carry[RESOURCE_ENERGY] == 0) {
                    creep.memory.pickingUp = true;
                }            
            
            }
        }
             
         
         
    }
 
 };

module.exports = roleSlacker;