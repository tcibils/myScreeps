var rolePowerHealer = {
    run: function(creep) {

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
		
		// This will be set to true by the healing buddy, and never by the attacker himself.
		if(creep.memory.attackBuddyAttached == undefined) {
			creep.memory.attackBuddyAttached = false;
		}
		
		if(creep.memory.powerTargetDestroyed == undefined) {
			creep.memory.powerTargetDestroyed = false;
		}
		
		// If we are not near the power source
		if(!creep.memory.nearPowerSource) {
			// We go to it.
			creep.moveTo(targetPowerSourcePos);
		}
		
		// If we are near the source but do not have an attack buddy attached
		if(creep.memory.nearPowerSource && !creep.memory.attackBuddyAttached) {
			// We search for one available
			let potentialTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(creep) {return 
				creep.memory.role == 'longDistanceAttackerPower' &&
				creep.memory.healBuddyAttached === 'false' &&
				creep.memory.nearPowerSource === 'true'
				}});
			// If found, we set memories
			if(potentialTarget != undefined) {
				creep.memory.attackBudyId = potentialTarget.id;
				creep.memory.attackBuddyAttached = true;
				potentialTarget.memory.healBuddyAttached = true;
				creep.say('Got buddy!')
			}
			else{
				creep.say('Buddy???')
			}
		}
		
		// If we have an attack buddy attached, we spam heal it to death.
		if(creep.memory.attackBuddyAttached) {
			if(creep.heal(Game.getObjectById(creep.memory.attackBudyId)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.attackBudyId));
			}
			
			if(Game.getObjectById(creep.memory.needOrigin) == undefined) {
				creep.memory.powerTargetDestroyed = true;
				creep.say('Trgt supr')
			}
		}
    }
};

module.exports = rolePowerHealer;
