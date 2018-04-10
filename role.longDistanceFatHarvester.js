var underAttackCreepMemory = require('info.underAttackCreepMemory');

var longDistanceFatHarvester = {
    run: function(creep) {

        underAttackCreepMemory.run(creep);
		
		let targetEnergySourcePos = new RoomPosition(creep.memory.needOriginPos.x, creep.memory.needOriginPos.y, creep.memory.needOriginPos.roomName);
		
		if(creep.memory.nearEnergySource == undefined) {
			creep.memory.nearEnergySource = false;
		}
		if(creep.pos.getRangeTo(targetEnergySourcePos) < 4 && !creep.memory.nearEnergySource) {
			creep.memory.nearEnergySource = true;
		}
		
		if(creep.memory.building == undefined) {creep.memory.building = false;}
		if(creep.memory.repairing == undefined) {creep.memory.repairing = false;}
		if(creep.memory.attachedContainer == undefined) {creep.memory.attachedContainer = null;}
		if(creep.memory.attachedConstructionContainer == undefined) {creep.memory.attachedConstructionContainer = null;}
		
		// If we are not near our energy source, in any rom
		if(!creep.memory.nearEnergySource) {
			// We move towards it
			creep.moveTo(targetEnergySourcePos, {visualizePathStyle: {stroke: '#ffbc11'}});
		}
		
		// If we are near the energy source
		if(creep.memory.nearEnergySource) {
			// First case, basic and most common, we have a container.
			if(Game.getObjectById(creep.memory.attachedContainer) != undefined) {
				// If we are not exactly above the container
				if(creep.pos != Game.getObjectById(creep.memory.attachedContainer).pos) {
					// We move on the container. Important to make the energy drop in it.
					creep.moveTo(Game.getObjectById(creep.memory.attachedContainer));
				}
				// If we are exactly above the container
				if(creep.pos == Game.getObjectById(creep.memory.attachedContainer).pos) {
					// If we are not repairing
					if(!creep.memory.repairing) {
						// If we are at capacity
						if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
							// If our container is below maxHP
							if(Game.getObjectById(creep.memory.attachedContainer).hits < Game.getObjectById(creep.memory.attachedContainer).hitsMax) {
								// Then we repair it
								creep.memory.repairing = true;
								creep.say('repairing')
							}
						}
						// Anyway, we wanna harvest the source. No conditions on the creep capacity, it'll go in the container if creep is full
						creep.harvest(Game.getObjectById(creep.memory.needOrigin));
					}
					// If we are repairing
					if(creep.memory.repairing) {
						// While we have some energy, we repair
						if(creep.carry[RESOURCE_ENERGY] > 0) {
							creep.repair(Game.getObjectById(creep.memory.attachedContainer));
						}
						// If we're empty or if the container is full HP, we stop repairing
						if(creep.carry[RESOURCE_ENERGY] == 0 || Game.getObjectById(creep.memory.attachedContainer).hits == Game.getObjectById(creep.memory.attachedContainer).hitsMax) {
							creep.memory.repairing = false;
							creep.say('harvesting')
						}
					}
				}
			}
			
			// Second case, we do not have a container attached, and no construction site, we need to create the construction site.
			else if(Game.getObjectById(creep.memory.attachedContainer) == undefined && Game.getObjectById(creep.memory.attachedConstructionContainer) == undefined) {
				// We try to find a container near the source
				let potentialContainers = targetEnergySourcePos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}});
				// If there is one
				if(potentialContainers.length > 0) {
					// Then we attach it
					creep.memory.attachedContainer = potentialContainers[0].id; // We attach the container
					creep.memory.attachedConstructionContainer = undefined; // No need to construct anything
                    creep.memory.building = false; // And we are not building.
					creep.say('created')
				}
				// If there is none
				if(potentialContainers.length == 0) {
					// We go near the source
					if(creep.pos.getRangeTo(targetEnergySourcePos) > 1) {
						creep.moveTo(targetEnergySourcePos);
					}
					// And create a construction site just near the source
					else {
						creep.pos.createConstructionSite(STRUCTURE_CONTAINER);	// Creation construction site
						creep.memory.attachedConstructionContainer = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES)[0].id; // Find it
						creep.memory.attachedContainer = undefined; // We have no container
						creep.memory.building = true; // And we need to build it
						creep.say('Cont atta')
					}
				}
			}
			
			
			// Third case, we have a construction site, but no container, and we need to build it
			else if(Game.getObjectById(creep.memory.attachedContainer) == undefined && Game.getObjectById(creep.memory.attachedConstructionContainer) != undefined) {
				// If we are building
				if(creep.memory.building) {
					// While we have some energy, we build
					if(creep.carry[RESOURCE_ENERGY] > 0) {
						creep.build(Game.getObjectById(creep.memory.attachedConstructionContainer));
					}
					// And if we're empty, or if the construction site disapeared, we stop
					if(creep.carry[RESOURCE_ENERGY] == 0 || Game.getObjectById(creep.memory.attachedConstructionContainer) == undefined) {
						creep.memory.building = false;
						creep.say('harvestB')
					}
				}
				
				// If we are not building
				if(!creep.memory.building) {
					// If we are under capacity
					if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
						// We harvest from the energy source
						creep.harvest(Game.getObjectById(creep.memory.needOrigin));
					}
					// If we are at capacity
					if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
						// We build the container
						creep.memory.building = true;
						creep.say('building')
					}
				}
				
				// If there is a constructer build around our energy source
				let potentialContainers = targetEnergySourcePos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}});
				if(potentialContainers.length > 0) {
					// We attach it, and we'll go to third case.
					creep.memory.attachedContainer = potentialContainers[0].id;
					creep.memory.attachedConstructionContainer = undefined;
					creep.say('Cont atta2')
				}
			}
		}
    }
};

module.exports = longDistanceFatHarvester;
