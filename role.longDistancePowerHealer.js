var rolePowerHealer = {
    run: function(creep) {

		if(creep.memory.nearPowerSource == undefined) {
			creep.memory.nearPowerSource = false;
		}
		
		// This will be set to true by the healing buddy, and never by the attacker himself.
		if(creep.memory.attackBuddyAttached == undefined) {
			creep.memory.attackBuddyAttached = false;
		}
		
		// ISSUE HERE : we need to store the pos of the need origin in main.
		
		if(!creep.memory.nearPowerSource) {
			let targetPowerSourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
			creep.moveTo(targetPowerSourcePos);
			if(creep.pos.getRangeTo(targetPowerSourcePos) < 4) {
				creep.memory.nearPowerSource = true;
			}
		}
		
		if(creep.memory.nearPowerSource && !creep.memory.attackBuddyAttached) {
			let potentialTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(creep) {return 
				creep.memory.role == longDistanceAttackerPower,
				creep.memory.healBuddyAttached == false,
				creep.memory.nearPowerSource == true
				}});
			if(potentialTarget != undefined) {
				creep.memory.attackBudyId = potentialTarget.id;
				creep.memory.attackBuddyAttached = true;
				potentialTarget.memory.healBuddyAttached = true;
			}
		}
		
		if(creep.memory.nearPowerSource && creep.memory.attackBuddyAttached) {
			if(creep.heal(Game.getObjectById(creep.memory.attackBudyId)) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.getObjectById(creep.memory.attackBudyId));
			}
		}


    }
};

module.exports = rolePowerHealer;
