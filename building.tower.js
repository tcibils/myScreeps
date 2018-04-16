
var towerRole = {

    /** @param {Creep} creep **/
    run: function(tower) {
		
		// Towers will no repair under this level of energy
		let limitMinimumFilling = tower.energyCapacity/3;
		// Roads will get repaired if they reach hitsMax/(this variable) HP
		let acceptableLifeRatioRoad = 3;
		// Containers will get repaired if they reach hitsMax/(this variable) HP
		let acceptableLifeRatioCont = 1.1;
		
		
		
		// If there's no enemy at all in the room
		if(tower.room.memory.threatLevel == 0) {
			
			// First, do we need a new target to repair
			let weNeedNewRepairTarget = false;
			// If the one we have is undefined
			if(Game.getObjectById(tower.room.repairTarget) == undefined) {
				// Then yes
				weNeedNewRepairTarget = true;
			}
			// If it's defined
			if(Game.getObjectById(tower.room.repairTarget) != undefined) {
				// But is full HP
				if(Game.getObjectById(tower.room.repairTarget).hits == Game.getObjectById(tower.room.repairTarget).hitsMax) {
					// Then yes as well
					weNeedNewRepairTarget = true;
				}
			}
			
			// Now if we need a new target to repair
			if(weNeedNewRepairTarget) {
				// Road needing repairs
				var roadTargetsRepair = tower.room.find(FIND_STRUCTURES, {filter: function(structure) {return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax/acceptableLifeRatioRoad)}});
				// Containers needing repairs
				var contTargetsRepair = tower.room.find(FIND_STRUCTURES, {filter: function(structure) {return (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax/acceptableLifeRatioCont)}});
				
				// We first target containers
				if(contTargetsRepair.length > 0) {
					tower.room.repairTarget = contTargetsRepair[0].id;
				}
				// If all containers are OK, we check roads
				if(contTargetsRepair.length == 0 && roadTargetsRepair.length > 0) {
					tower.room.repairTarget = roadTargetsRepair[0].id;
				}
				// If both are OK, we reset repair target
				if(contTargetsRepair.length == 0 && roadTargetsRepair.length == 0) {
					tower.room.repairTarget = 0;
				}
			}
			
			// Now, if we have a valid target to repair
			if(Game.getObjectById(tower.room.repairTarget) != undefined) {
				// If the tower has enough energy
				if(tower.energy > limitMinimumFilling) {
					tower.repair(Game.getObjectById(tower.room.repairTarget));
				}
			}				
		}
		
		// If there's a threat
		if(tower.room.memory.threatLevel > 0) {
			// We find the closest enemy creep
			let finalTarget = 0;
			
			// It's not a good idea here to attack healing creeps first. 
			// He could just drop a self-healing creep far from towers to drain them, while an attack creep destroys town.
			// Better focus fire on closest one ? Or try to keep focus to destroy one, to avoid his creeps moving back and forth ?
			var targetAttack = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			
			if (targetAttack != null) {finalTarget = targetAttack;}
			
			// And fire
			if(finalTarget != null) {
				tower.attack(finalTarget);
			}
		}        
    }   
};


module.exports = towerRole;