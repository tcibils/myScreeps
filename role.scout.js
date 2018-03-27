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
        // Current room is the room we currently are.
        // We store this in the memory, so that we can check when we changed room

        // If undefined, then we set it as the current room
        if(creep.memory.currentRoom == undefined) {
            creep.memory.currentRoom = creep.room.name;
        }

        // If we just arrived in a new room, or don't know where to go
        if(creep.memory.currentRoom != creep.room.name || creep.memory.targetRoomDirection == undefined) {
            // We define the possibilities, checking which exit exist
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

            // And we take one at random, store it in the memory, and make the room we're in the current room.
            let randomResult = Math.floor(Math.random() * possibilities.length);
            creep.memory.targetRoomDirection = possibilities[randomResult];
            creep.memory.currentRoom = creep.room.name;
        }



        // And now, moving the creep :
        // If there is a controller
        if(creep.room.controller != undefined) {
            // That neither me or Ringo signed (diplomacy...)
            if(creep.room.controller.sign.username != "Blaugaard" && creep.room.controller.sign.username != "Ringo86") {
                // Then we sign it =)
                if(creep.signController(creep.room.controller, "Join #overlords alliance, find us on Slack! Also, fuck Quorum's auto-signing room bot.") == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
            // If it is already signed, we move towards the exit.
            else {
                creep.moveTo(creep.pos.findClosestByRange(creep.memory.targetRoomDirection));
            }
        }
        // Same if there's no controller, we move towards the exit.
        else {
            creep.moveTo(creep.pos.findClosestByRange(creep.memory.targetRoomDirection));
        }


        // HERE WILL BE THE MEMORY PUSHING FOR ROOMS



    }
}

module.exports = scout;
