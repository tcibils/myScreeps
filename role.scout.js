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

        // We only try to update the room memory if we just arrived in it
        // This will avoid that the creep tries to update the room memory the whole time it's in it, and do it just once
        if(creep.memory.currentRoom != creep.room.name) {
            // Storing sources of the room : ID, position and maxEnergy
            if(creep.room.memory.sources == undefined || creep.room.memory.sourcesPos == undefined || creep.room.memory.sourcesMax == undefined) {
                creep.room.memory.sources = [];
                creep.room.memory.sourcesPos = [];
                creep.room.memory.sourcesMax = [];

                var sourcesOfRoom = creep.room.find(FIND_SOURCES);
                if(sourcesOfRoom.length > 0) {
                    for(let currentSourceIndex= 0; currentSourceIndex<sourcesOfRoom.length; currentSourceIndex++) {
                        creep.room.memory.sources.push(sourcesOfRoom[currentSourceIndex].id);
                        creep.room.memory.sourcesMax.push(sourcesOfRoom[currentSourceIndex].energyCapacity);
                        creep.room.memory.sourcesPos.push(sourcesOfRoom[currentSourceIndex].pos);
                    }
                }
            }

            // Storing the owner of the room, if undefined or out of date
			
			// If there is a controller
			if(creep.room.controller != undefined) {
				// If the variable is already stored in memory
				if(creep.room.memory.roomOwner != undefined) {
					// If the owner is not the same anymore
					if(creep.room.memory.roomOwner != creep.room.controller.owner) {
						// We change the data in memory
						creep.room.memory.roomOwner = creep.room.controller.owner;
					}
				}
				// If the variable is not yet defined
				else {
					// We define it
					creep.room.memory.roomOwner = creep.room.controller.owner;
				}
				
				// Same for reservation
				// If the variable is defined
				if(creep.room.memory.roomOwnerReservation != undefined) {
					if(creep.room.controller.reservation != undefined) {
						// If it's not the same player having reserved it anymore
						if(creep.room.memory.roomOwnerReservation != creep.room.controller.reservation.username) {
							// We update the info
							creep.room.memory.roomOwnerReservation = creep.room.controller.reservation.username;
						}					
					}
					else {
						creep.room.memory.roomOwnerReservation = undefined;
					}
				}
				// If the variable is not yet defined
				else {
					// We initialize it
					if(creep.room.controller.reservation != undefined) {
						creep.room.memory.roomOwnerReservation = creep.room.controller.reservation.username;
					}
				}
				
			}
			// If there is no controller, we keep all at undefined
			else {
				creep.room.memory.roomOwner = undefined;
				creep.room.memory.roomOwnerReservation = undefined;
				// TRICKY THAT ! If there is no controller, then we don't have an interest in LDHarvesting the room.
				// This rules out the corridor rooms, which have neither controller nor source
				// It also rules out central rools, which have multiple powerful sources, but no controller, and as sources are defended we currently don't know how to manage it
				// So it conviniently rules out certain rooms with a biaised but useful and simple indicator
				creep.room.memory.noEnergyInterest = true;
			}

            // No "if" on power memory as we want to update it anyway

            creep.room.memory.powerSources = [];
            creep.room.memory.powerSourcesPos = [];
            creep.room.memory.powerSourcesMax = [];
            creep.room.memory.powerSourcesHits = [];
            creep.room.memory.powerSourcesHitsMax = [];
            creep.room.memory.powerSourcesTime = [];
            creep.room.memory.powerSourcesDiscoveryTime = [];
            creep.room.memory.powerSourceFreeSpots = [];
			

            var powerSourcesOfRoom = creep.room.find(FIND_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_POWER_BANK}});

            if(powerSourcesOfRoom.length > 0) {
                for(let currentPowerSourceIndex = 0; currentPowerSourceIndex < powerSourcesOfRoom.length; currentPowerSourceIndex++) {
                    creep.room.memory.powerSources.push(powerSourcesOfRoom[currentPowerSourceIndex].id);
                    creep.room.memory.powerSourcesPos.push(powerSourcesOfRoom[currentPowerSourceIndex].pos);
                    creep.room.memory.powerSourcesMax.push(powerSourcesOfRoom[currentPowerSourceIndex].power);
                    creep.room.memory.powerSourcesHits.push(powerSourcesOfRoom[currentPowerSourceIndex].hits);
                    creep.room.memory.powerSourcesHitsMax.push(powerSourcesOfRoom[currentPowerSourceIndex].hitsMax);
                    creep.room.memory.powerSourcesTime.push(powerSourcesOfRoom[currentPowerSourceIndex].ticksToDecay);
                    creep.room.memory.powerSourcesDiscoveryTime.push(Game.time);
					
					var counter = 0;
					for(var a = -1; a<=1; a++) {
						for(var b = -1; b<=1; b++) {
							let terrainToBeAssessed = Game.map.getTerrainAt(powerSourcesOfRoom[currentPowerSourceIndex].pos.x + a, powerSourcesOfRoom[currentPowerSourceIndex].pos.y + b, creep.room.name);
							if (terrainToBeAssessed == 'plain' || terrainToBeAssessed == 'swamp') {
								counter ++;
							}
						}
					}
                    creep.room.memory.powerSourceFreeSpots.push(counter);
                }
            }

        }

		
		if(creep.memory.targetRoom == creep.room.name || creep.memory.targetRoom == undefined) {
			creep.memory.targetRoom = "undefined";
		}

        // If we just arrived in a new room, or don't know where to go
        if(creep.memory.currentRoom != creep.room.name || creep.memory.targetRoomDirection == undefined || creep.memory.targetRoom != "undefined") {
			if(creep.memory.targetRoom === "undefined") {
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
				creep.memory.targetLocalExit = creep.pos.findClosestByRange(creep.memory.targetRoomDirection);

			}
			else {
				var localExit = creep.room.findExitTo(creep.memory.targetRoom);
				// And we move towards our target !
				creep.memory.targetRoomDirection = localExit;
				creep.memory.targetLocalExit = creep.pos.findClosestByRange(creep.memory.targetRoomDirection);
				creep.say('Yes, sir!');
			}
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
            // TO BE IMPROVED; CPU EXPENSIVE TO FIND EACH TURN THE EXIT
            else {
                creep.moveTo(creep.memory.targetLocalExit);
            }
        }
        // Same if there's no controller, we move towards the exit.
        else {
            creep.moveTo(creep.memory.targetLocalExit);
        }




    }
};

module.exports = scout;
