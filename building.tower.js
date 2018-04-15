
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
			
			// First the ones with heal body parts, then all of them
			// Issue here - If creep has destroyed body parts, it will not fire at him. Which is wrong, as it could be healed by a buddy and return to healing.
			var firstTargetAttack = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: function(object) {return object.getActiveBodyparts(HEAL)>0}});
			var secondTargetAttack = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			
			// If there's a healing one, we take it as a target
			if		(firstTargetAttack != null)  {finalTarget = firstTargetAttack;}
			else if (secondTargetAttack != null) {finalTarget = secondTargetAttack;}
			
			// And fire
			if(finalTarget != null) {
				tower.attack(finalTarget);
			}
		}        
    }   
};


module.exports = towerRole;