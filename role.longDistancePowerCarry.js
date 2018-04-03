var rolePowerCarry = {
    run: function(creep) {
		
		if(creep.memory.nearPowerSource == undefined) {
			creep.memory.nearPowerSource = false;
		}
		
		if(creep.memory.foundPowerToPickup == undefined) {
			creep.memory.foundPowerToPickup = false;
		}
		
		if(creep.memory.gathering == undefined) {
			if(_.sum(creep.carry) < creep.carryCapacity) {
				creep.memory.gathering = true;
			}
			else {
				creep.memory.gathering = false;
			}
		}
		
		// ISSUE HERE : we need to store the pos of the need origin in main.
		
		if(!creep.memory.nearPowerSource && creep.memory.gathering) {
			let targetPowerSourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
			creep.moveTo(targetPowerSourcePos);
			if(creep.pos.getRangeTo(targetPowerSourcePos) < 4) {
				creep.memory.nearPowerSource = true;
			}
		}
		
		if(creep.memory.nearPowerSource && !creep.memory.foundPowerToPickup && creep.memory.gathering) {
			potentialTarget = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: function(resource) {return 
				resource.resourceType == RESOURCE_POWER}});
			if(potentialTarget != undefined) {
				creep.memory.foundPowerToPickup = true;
				creep.memory.powerToPickup = potentialTarget.id;
				creep.memory.powerToPickupPos = potentialTarget.pos;
			}
			if(potentialTarget == undefined) {
				creep.say('zZzZ');
			}
		}
		
		if(creep.memory.nearPowerSource && creep.memory.foundPowerToPickup && creep.memory.gathering) {
			if(creep.pickup(Game.getObjectById(creep.memory.powerToPickup)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.powerToPickup));
			}
			
			// If the creep is full OR if there is nothing more to carry, we set the gathering to false to get back to base
			if(_.sum(creep.carry) == creep.carryCapacity || Game.getObjectById(creep.memory.powerToPickup) == undefined) {
				creep.memory.gathering = false;
			}
		}
		
		if(!creep.memory.gathering) {
			// Should return the power to the "right place" - TBD !
		}


    }
};

module.exports = rolePowerCarry;
