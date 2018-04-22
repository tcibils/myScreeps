var setNeedCreepsBuildingsOfRoom = {
    run: function(treatedRoom) {
		let naturallyDeadTime = 100;
		 
		 // BUILDING-RELATED

		 
		// BUILDERS
        treatedRoom.memory.labels.push('Builders')
        treatedRoom.memory.role.push('builder')
        treatedRoom.memory.unity.push('Number of creeps')
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined')
        treatedRoom.memory.needOriginPos.push('undefined')
        treatedRoom.memory.criticalNeed.push(false);

        var realConstructionSites = treatedRoom.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL});
        var totalConstructionNeeded = 0;
        for(let a = 0; a <realConstructionSites.length; a++) {
            totalConstructionNeeded += (realConstructionSites[a].progressTotal - realConstructionSites[a].progress);
        }

        // Builders needed

        if(totalConstructionNeeded == 0) {
            treatedRoom.memory.need.push(0);
        }
        else if(totalConstructionNeeded > 0 && totalConstructionNeeded <= 1000) {
            treatedRoom.memory.need.push(1);
        }
        else if(totalConstructionNeeded > 1000 && totalConstructionNeeded <= 15000) {
            treatedRoom.memory.need.push(2);
        }
        else if(totalConstructionNeeded > 15000 && totalConstructionNeeded <= 30000) {
            treatedRoom.memory.need.push(3);
        }
        else if(totalConstructionNeeded > 30000) {
            treatedRoom.memory.need.push(4);
        }

        // Builders attached

        treatedRoom.memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'builder' && creep.memory.homeRoom == treatedRoom.name)).length);

		
		
		// WALL BUILDERS
		
		treatedRoom.memory.labels.push('Wall Builders')
        treatedRoom.memory.role.push('wallBuilder')
        treatedRoom.memory.unity.push('Number of creeps')
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined')
        treatedRoom.memory.needOriginPos.push('undefined')
        treatedRoom.memory.criticalNeed.push(false);

        // Wall builders needed only if room is level 4 - lets not stop the development before.
		if(treatedRoom.controller.level > 4) {
            if(treatedRoom.memory.storages.length > 0) {
                if(Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] > STORAGE_CAPACITY * 0.95) {
                    treatedRoom.memory.need.push(3);
                }
                else {
                    treatedRoom.memory.need.push(1);
                }
            }
            else {
                treatedRoom.memory.need.push(1);
            }
			
		}
		else {
			treatedRoom.memory.need.push(0);
		}
        // Wall builders attached
        treatedRoom.memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'wallBuilder' && creep.memory.homeRoom == treatedRoom.name)).length);

    }
}

module.exports = setNeedCreepsBuildingsOfRoom;
