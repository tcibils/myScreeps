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
		
		// ISSUE HERE : we need to store the pos of the need origin in main.
		
		if(!creep.memory.nearPowerSource && !creep.memory.powerTargetDestroyed) {
			creep.moveTo(targetPowerSourcePos);
		}
		
		if(creep.memory.nearPowerSource && !creep.memory.attackBuddyAttached && !creep.memory.powerTargetDestroyed) {
			let potentialTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(creep) {return 
				creep.memory.role == longDistanceAttackerPower,
				creep.memory.healBuddyAttached == false,
				creep.memory.nearPowerSource == true
				}});
			if(potentialTarget != undefined) {
				creep.memory.attackBudyId = potentialTarget.id;
				creep.memory.attackBuddyAttached = true;
				potentialTarget.memory.healBuddyAttached = true;
				creep.say('Got buddy!')
			}
		}
		
		if(creep.memory.nearPowerSource && creep.memory.attackBuddyAttached && !creep.memory.powerTargetDestroyed) {
			if(creep.heal(Game.getObjectById(creep.memory.attackBudyId)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.attackBudyId));
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
			else{
				creep.say('Dying')
			}
		}

    }
};

module.exports = rolePowerHealer;
