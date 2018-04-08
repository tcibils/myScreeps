

var roleSpreaderPower = {
    run: function(creep) {
		if(creep.memory.gathering == undefined) {
			creep.memory.gathering = false;
		}
		
		if(creep.ticksToLive < 130) {
			creep.memory.gathering = false;
			if(_.sum(creep.carry) == 0) {
				creep.suicide();
			}
		}
		
		if(creep.memory.gathering) {
			if(_.sum(creep.carry) < creep.carryCapacity) {
				if(creep.withdraw(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
				}
			}
			
			if(_.sum(creep.carry) == creep.carryCapacity) {
				creep.memory.gathering = false;
			}
		}
		
		if(!creep.memory.gathering) {
			if(_.sum(creep.carry) > 0) {
				
				if(creep.transfer(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]));
				}
				if(Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energy < 100) {
					console.log('ere')
					if(creep.transfer(Game.getObjectById(creep.room.memory.storages[0]), RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
						creep.moveTo(Game.getObjectById(creep.room.memory.storages[0]));
					}
				}
			}
			if(_.sum(creep.carry) == 0) {
				if(creep.ticksToLive >= 130 && Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energy == Game.getObjectById(creep.room.memory.powerSpawningPoints[0]).energyCapacity){
					creep.memory.gathering = true;
				}
			}
		}
		
    }
};

module.exports = roleSpreaderPower;
