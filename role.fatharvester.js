var roleFatHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

		let targetEnergySourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
		
		// Defining closeness to source
		if(creep.memory.nearEnergySource == undefined) {creep.memory.nearEnergySource = false;}
		if(creep.pos.getRangeTo(targetEnergySourcePos) < 4) {
			creep.memory.nearEnergySource = true;
		}
		else {
			creep.memory.nearEnergySource = false;
		}
		
		
		// If there is no link close
		if(Game.getObjectById(creep.memory.attachedLink) == undefined) {
			// (Saving up on CPU)
			if(Game.time % 150 == 0) {
				// We try to find a link in a distance of 2 to the source
				let potentialLink = targetEnergySourcePos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK)}});
				// If there's one, we attach it
				if(potentialLink.length > 0) {
					creep.memory.attachedLink = potentialLink[0].id;
				}
			}
		}
		
		// If the creep is not near the energy source
		if(!creep.memory.nearEnergySource){
			// We move towards it
			creep.moveTo(targetEnergySourcePos, {visualizePathStyle: {stroke: '#ffbc11'}});
		}
        
		// If the creep is near the energy source
		if(creep.memory.nearEnergySource){
			// If we do not have an attached link
			if(Game.getObjectById(creep.memory.attachedLink) == undefined) {
				// We simply chain-harvest, no conditions.
				if(creep.harvest(Game.getObjectById(creep.memory.needOrigin)) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.memory.needOrigin));
				}
			}
			// If we have an attached link
			if(Game.getObjectById(creep.memory.attachedLink) != undefined) {
				// If we're under capacity
				if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
					// We harvest
					if(creep.harvest(Game.getObjectById(creep.memory.needOrigin)) == ERR_NOT_IN_RANGE) {
						creep.moveTo(Game.getObjectById(creep.memory.needOrigin));
					}
				}
				// If we're at capacity
				if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
					// We transfer
					if(creep.transfer(Game.getObjectById(creep.memory.attachedLink), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(Game.getObjectById(creep.memory.attachedLink));
					}
				}
			}
		}
	}
};

module.exports = roleFatHarvester;