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
		
		// ISSUE HERE : we need to store the pos of the need origin in main.
		
		if(!creep.memory.nearPowerSource && !creep.memory.powerTargetDestroyed) {
			creep.moveTo(targetPowerSourcePos);
		}
		
		if(creep.memory.nearPowerSource && creep.memory.healBuddyAttached && !creep.memory.powerTargetDestroyed) {
			// We should now be in the same room as power source, so we have necessary visibility for Game.getObjectById.
			if(creep.attack(Game.getObjectById(creep.memory.needOrigin)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.needOrigin));
			}
			
			if(Game.getObjectById(creep.memory.needOrigin) == undefined) {
				creep.memory.powerTargetDestroyed = true;
				creep.say('Trgt supr')
			}
		}
		
		if(creep.memory.powerTargetDestroyed) {
			let targetPowerSourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
			if(creep.pos.getRangeTo(targetPowerSourcePos) < 4) {
				let direction = Math.ceil(Math.random * 8);
				creep.move(direction);
				creep.say('Mving aw')
			}
			else {
				creep.say('Dying')
			}
		}
    }
};

module.exports = rolePowerAttacker;
