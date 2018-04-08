
/*
Concept :
1. Goes to target room
2. Fills up with containers from there, taking the fullest container (minus the carry capacity of creeps already attached to it)
3. Once filled, get backs to home room
4. Deposits energy in storage

Loop
*/


var underAttackCreepMemory = require('info.underAttackCreepMemory');

// Improvement idea 1 : set deposit target based on room memory, go there directly
// Improvement idea 2 : move toward needOriginPos stored in memory directly

var longDistanceFastMover = {
    run: function(creep) {
        
        underAttackCreepMemory.run(creep);
        
        if(creep.memory.gathering == undefined) {
            creep.memory.gathering = false;
        }
        
        if(creep.ticksToLive < 80) {
            creep.memory.gathering = false;
            if(creep.carry[RESOURCE_ENERGY] == 0) {
                creep.say('Hara-Kiri')
                creep.suicide();
            }
        }
		
		// This "first job done" is an had-hoc fix to find the optimal link or deposit for the creep.
		// It is false when it spawns, and once it has pickup its first load, it goes back to its home room
		if(creep.memory.firstJobDone == undefined) {
			creep.memory.firstJobDone = false;
		}
		if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
				creep.memory.firstJobDone = true;
		}
		
		// And when it gets back to its home room, he finds the closest link or deposit, which will become forever its deposit target
		// Thus we needed the firstJobDone to search for this target not when the creep spawned, but when it gets back home for first time.
		// FindClosestByPath only works within one room, so we cannot use it from target source to home room.
        if(Game.getObjectById(creep.memory.depositTarget) == null && creep.memory.homeRoom == creep.room.name && creep.memory.firstJobDone) {
            // We convert the sender links ids to real object
			let arrayOfPotentialDeposits = [];
			
            for(let senderLinkIndex = 0; senderLinkIndex < Memory.rooms[creep.memory.homeRoom].senderLinksPos.length; senderLinkIndex++) {
				arrayOfPotentialDeposits.push(Game.getObjectById(Memory.rooms[creep.memory.homeRoom].senderLinks[senderLinkIndex]));
            }

			// We also add the deposit
            if(Memory.rooms[creep.memory.homeRoom].storages.length > 0) {
                if(Game.getObjectById(Memory.rooms[creep.memory.homeRoom].storages[0]) != undefined) {
					arrayOfPotentialDeposits.push(Game.getObjectById(Memory.rooms[creep.memory.homeRoom].storages[0]));
                }
            }
			
			// And we take the closest of the objects.
            var potentialTarget = creep.pos.findClosestByPath(arrayOfPotentialDeposits);
			
			// If it exists
            if(potentialTarget != null) {
				// We set it as final target.
				creep.memory.depositTarget = potentialTarget.id;
            }
        }

		
        // If creep is not gathering, meaning he's going back home with energy
        if(creep.memory.gathering == false) {
            // If he's home
            if(creep.room.name == creep.memory.homeRoom) {
                // If he has some energy
                if(creep.carry[RESOURCE_ENERGY] > 0) {
                    // If he knows where to deposit
                    if(Game.getObjectById(creep.memory.depositTarget) != null) {
                        // Then he tries to transfer and go there.
                        if(creep.transfer(Game.getObjectById(creep.memory.depositTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.depositTarget).pos, {visualizePathStyle: {stroke: '#08ff00'}});
                        }
                    }
                }
                
                // If the creep is empty, he goes gathering !
                if(creep.carry[RESOURCE_ENERGY] == 0 && creep.ticksToLive > 150) {
                    creep.memory.gathering = true;
                }
            }
            
            // If the creep is not in his home, he gets back
            if(creep.room.name != creep.memory.homeRoom) {
				// If we have a deposit (meaning we already took time to define it)
                if(creep.memory.depositTarget != undefined) {
					// Then we move towards it. Works cross-rooms.
                    creep.moveTo(Game.getObjectById(creep.memory.depositTarget), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 10});
                }
				// If we don't have a deposit (first time it comes back)
				else {
					// Then we simply target "center of home room", and we'll get more precise later
					let tempTarget = new RoomPosition(25,25,creep.memory.homeRoom);
					creep.moveTo(tempTarget, {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 10});
				}
            }
        }
        
        // TO BE IMPROVED : if creep life just long enough to get back to base, then get back to base. don't wait to be full.
        
        // If the creep is gathering
        if(creep.memory.gathering == true) {
            // If he is in its target room
            if(creep.room.name == creep.memory.targetRoom) {
                // And is full, then we stop gathering.
                if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
					creep.memory.firstJobDone = true;
                    creep.memory.gathering = false;
                }
                
                // If we're under capacity
                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                    
                    // If we have no target or if it's empty, we do a compliacted rocade to find one.
					// The goal of this rocade it to take a container that doesn't already have LDFM creeps attached.
					// I'm not so sure it works well. It dates from before I set the needOrigin for creeps, when they only had target room
					// Thus they had to find a target by themselves in the target room. Probably going to needOrigin might be sufficient here.

                    // TO BE IMPROVED : each containuer, quantity minus creeps already attached to it
                    if(Game.getObjectById(creep.memory.containerTarget) == null || Game.getObjectById(creep.memory.containerTarget).store[RESOURCE_ENERGY] == 0) {
						
                        var maximumContained = 0;
                        var finalTarget = null;
                        var roomContainers = creep.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0)}
                            });
                        

                        if(roomContainers.length > 0) {
                            for(let i = 0; i < roomContainers.length; i++) {
                                var otherCreepsAttached = _.filter(Game.creeps, (otherCreep) => otherCreep.memory.role == 'longDistanceFastMover' && creep.room.name == otherCreep.room.name && otherCreep.memory.containerTarget == roomContainers[i].id);    
                                var result = 0;
                                for(let j = 0; j < otherCreepsAttached.length; j++) {
                                    result += (otherCreepsAttached[j].carryCapacity - otherCreepsAttached[j].carry[RESOURCE_ENERGY]);
                                }
                                
                                if(roomContainers[i].store[RESOURCE_ENERGY] > (maximumContained - result)) {
                                    maximumContained = roomContainers[i].store[RESOURCE_ENERGY];
                                    finalTarget = roomContainers[i];
                                }
                            }
                        }
                        
                        if(finalTarget != null) {
                            creep.memory.droppedEnergy = null;
                            creep.memory.containerTarget = finalTarget.id;
                        }
                        if(finalTarget == null) {
                            var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                            if(droppedEnergy != null ) {
                                creep.memory.containerTarget = null;
                                creep.memory.droppedEnergy = droppedEnergy.id;
                            }
                        }
                        
                    }
                    
                    // now we target our container to picup energy
                    if(Game.getObjectById(creep.memory.containerTarget) != null) {
                        if(creep.withdraw(Game.getObjectById(creep.memory.containerTarget), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            if(creep.moveTo(Game.getObjectById(creep.memory.containerTarget), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 5, maxRooms: 1})== ERR_NO_PATH) {
                                creep.move(RIGHT);
                            }
                        }
                    }
                    // Or dropped energy if container is full
                    else if(Game.getObjectById(creep.memory.droppedEnergy) != null) {
                        if(creep.pickup(Game.getObjectById(creep.memory.droppedEnergy)) == ERR_NOT_IN_RANGE) {
                            if(creep.moveTo(Game.getObjectById(creep.memory.droppedEnergy), {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 5, maxRooms: 1}) == ERR_NO_PATH) {
                                creep.move(RIGHT);
                            }
                        }
                    }
                }
            }
            
            // And if we're not in our target room, we move towards it.
            if(creep.room.name != creep.memory.targetRoom) {
                // Using the need origin position.
				if(creep.memory.needOriginPos == undefined ) {
					console.log('creep ' + creep.name + ' in room ' + creep.room.name + ' pos ' creep.pos + ' has no need origin pos')
				}
        		let targetEnergySourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
                creep.moveTo(targetEnergySourcePos, {visualizePathStyle: {stroke: '#08ff00'}, reusePath: 10});                
            }
            
        }
    }
};


module.exports = longDistanceFastMover;