var rolePowerCarry = {
    run: function(creep) {
		
		// Defining "nearness" or target
		if(creep.memory.nearPowerSource == undefined) {
			creep.memory.nearPowerSource = false;
		}
		let targetPowerSourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
		
		if(creep.pos.getRangeTo(targetPowerSourcePos) < 4) {
			creep.memory.nearPowerSource = true;
		}
		else {
			creep.memory.nearPowerSource = false;
		}
		
		if(creep.memory.foundPowerToPickup == undefined) {
			creep.memory.foundPowerToPickup = false;
		}
		
		// Defining the gathering memory variable
		if(creep.memory.gathering == undefined) {
			if(_.sum(creep.carry) < creep.carryCapacity) {
				creep.memory.gathering = true;
			}
			else {
				creep.memory.gathering = false;
			}
		}
		
		// If we're far from source and gathering
		if(!creep.memory.nearPowerSource && creep.memory.gathering) {
			// We move towards it
			creep.moveTo(targetPowerSourcePos);
		}
		
		// If we are near source, and did not find power drop to pickup, and are gathering
		if(creep.memory.nearPowerSource && !creep.memory.foundPowerToPickup && creep.memory.gathering) {
			// We wait for the power drop
			potentialTarget = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: function(resource) {return (
				resource.resourceType == RESOURCE_POWER)}});
				
			// If found, we pick it up
			if(potentialTarget != undefined) {
				creep.memory.foundPowerToPickup = true;
				creep.memory.powerToPickup = potentialTarget.id;
				creep.memory.powerToPickupPos = potentialTarget.pos;
			}
			// Else, we sleep
			if(potentialTarget == undefined) {
				creep.say('zZzZ');
			}
		}
		
		// Now if we are near power source, have found power to pick up and are gathering
		if(creep.memory.nearPowerSource && creep.memory.foundPowerToPickup && creep.memory.gathering) {
			// We pick it up !
			if(creep.pickup(Game.getObjectById(creep.memory.powerToPickup)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.powerToPickup));
			}
			
			// If the creep is full OR if there is nothing more to carry, we set the gathering to false to get back to base
			if(_.sum(creep.carry) == creep.carryCapacity || Game.getObjectById(creep.memory.powerToPickup) == undefined) {
				creep.memory.gathering = false;
			}
		}
		
		// And if we're not gathering - which should mean that we just dropped power in storage
		if(!creep.memory.gathering) {
			// We look for storage in our home room
			if(Game.rooms[creep.memory.homeRoom].memory.storages.length > 0) {
				// And try to transfer the power to it
				if(creep.transfer(Game.getObjectById(Game.rooms[creep.memory.homeRoom].memory.storages[0]),RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
					// By moving towards it
					creep.moveTo(Game.getObjectById(Game.rooms[creep.memory.homeRoom].memory.storages[0]));
				}
			}
			
			// No storage in home room -> big issue
			else {
				creep.say('ISSUE');
				console.log('Room ' + creep.room.name + ', creep ' + creep.name + ', no target storage for power deposit.');
			}
			
			// If creep empty, gathering set to true again.
			if(creep.carry(RESOURCE_POWER) == 0) {
				creep.memory.gathering = true;
			}
		}
    }
};

module.exports = rolePowerCarry;
