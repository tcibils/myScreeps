var rolePowerAttacker = {
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
		if(creep.memory.healBuddyAttached == undefined) {
			creep.memory.healBuddyAttached = false;
		}
		
		if(creep.memory.powerTargetDestroyed == undefined) {
			creep.memory.powerTargetDestroyed = false;
		}
		
		// If we are not near the source and target still existing
		if(!creep.memory.nearPowerSource && !creep.memory.powerTargetDestroyed) {
			// We move towards it.
			creep.moveTo(targetPowerSourcePos);
		}
		
		// If we are near the power source, have a heal buddy, and target not destroyed
		if(creep.memory.nearPowerSource && creep.memory.healBuddyAttached && !creep.memory.powerTargetDestroyed) {
			// We should now be in the same room as power source, so we have necessary visibility for Game.getObjectById.
			// We attack.
			if(creep.attack(Game.getObjectById(creep.memory.needOrigin)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.needOrigin));
			}
			
			// We also update the hits in our memory, in order to be able to take a decision on carrying creeps.
			for(let powerSourceIndex = 0; powerSourceIndex < creep.room.memory.powerSources.length; powerSourceIndex++) {
				if(creep.room.memory.powerSources[powerSourceIndex] == creep.memory.needOrigin) {
					if(Game.getObjectById(creep.memory.needOrigin) != undefined) {
						creep.room.memory.powerSourcesHits[powerSourceIndex] = Game.getObjectById(creep.memory.needOrigin).hits;
					}
				}
			}
			
			if(Game.getObjectById(creep.memory.needOrigin) == undefined) {
				creep.memory.powerTargetDestroyed = true;
				creep.say('Trgt supr')
			}
		}
		
		// If we destroy the target
		if(creep.memory.powerTargetDestroyed) {
			// If we are near the source
			if(creep.memory.nearPowerSource) {
				// We randomly move away from it.
				let direction = Math.ceil(Math.random() * 8);
				creep.move(direction);
				creep.say('Mving ' + direction)
			}
			else {
				creep.say('Off')
			}
		}
    }
};

module.exports = rolePowerAttacker;
