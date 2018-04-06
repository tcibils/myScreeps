

var roleSpreaderPower = {
    run: function(creep) {
		if(creep.memory.gathering == undefined) {
			creep.memory.gathering = false;
		}
		
		if(creep.ticksToLive < 130) {
			creep.memory.gathering = false;
			if(creep.carry[RESOURCE_POWER] == 0) {
				creep.suicide();
			}
		}
		
		if(creep.memory.gathering) {
			if(creep.carry[RESOURCE_POWER] < creep.carryCapacity) {
				if(creep.withdraw(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
				}
			}
			
			if(creep.carry[RESOURCE_POWER] == creep.carryCapacity) {
				creep.memory.gathering = false;
			}
		}
		
		if(!creep.memory.gathering) {
			console.log('OK here')
			if(creep.carry[RESOURCE_POWER] > 0) {
				if(creep.transfer(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]));
				}
			}
			console.log('carrying' + creep.carry[RESOURCE_POWER])
			if(creep.carry[RESOURCE_POWER] == 0) {
				
				creep.memory.gathering = true;
			}
		}
		
    }
};

module.exports = roleSpreaderPower;
