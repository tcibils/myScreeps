/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */
 
var scout = {
    run: function(creep) {
        // console.log('Room ' + creep.room.name + ', origin : ' + creep.memory.homeRoom)
        if(creep.memory.currentRoom == undefined) {
            creep.memory.currentRoom = creep.room.name;
        }
        if(creep.memory.currentRoom != creep.room.name || creep.memory.targetRoomDirection == undefined) {
            let possibilities = [];
            
            if(creep.room.find(FIND_EXIT_TOP).length > 0) {
                possibilities.push(FIND_EXIT_TOP);
            }
            if(creep.room.find(FIND_EXIT_RIGHT).length > 0) {
                possibilities.push(FIND_EXIT_RIGHT);
            }
            if(creep.room.find(FIND_EXIT_BOTTOM).length > 0) {
                possibilities.push(FIND_EXIT_BOTTOM);
            }
            if(creep.room.find(FIND_EXIT_LEFT).length > 0) {
                possibilities.push(FIND_EXIT_LEFT);
            }
            
            // console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', possibilities : ' + possibilities)
            
            let randomResult = Math.floor(Math.random() * possibilities.length);
            creep.memory.targetRoomDirection = possibilities[randomResult];
            creep.memory.currentRoom = creep.room.name;
        }
        
        
        
        // MOVING CREEP
        
        if(creep.room.controller != undefined) {
            if(creep.room.controller.sign.username != "Blaugaard") {
                if(creep.signController(creep.room.controller, "Join #overlords alliance, find us on Slack! Also, fuck Quorum's auto-signing room bot.") == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
            else {
                creep.moveTo(creep.pos.findClosestByRange(creep.memory.targetRoomDirection)); 
            }
        }
        else {
            creep.moveTo(creep.pos.findClosestByRange(creep.memory.targetRoomDirection));
        }
    }
}

module.exports = scout;