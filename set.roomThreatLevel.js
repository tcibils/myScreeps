var setRoomThreatLevel = {
    run: function(treatedRoom) {
		// Parameters
		let alwaysDisplayRoomThreatLevel = false;
		let displayAttackedRoomThreatLevel = false;
		
		// Initializing memory
		if(treatedRoom.memory.threatLevel == undefined) {treatedRoom.memory.threatLevel = 0;}
		
		// Variables used definition
		let numberOfTowers = treatedRoom.memory.towers.length;
		let ennemyCreeps = treatedRoom.find(FIND_HOSTILE_CREEPS);
		let ennemyInvaderCreeps = treatedRoom.find(FIND_HOSTILE_CREEPS, {filter: function(ennemyCreep) {return (ennemyCreep.owner.username == "Invader")}});
		let ennemyCreepsWithHeal = treatedRoom.find(FIND_HOSTILE_CREEPS, {filter: function(ennemyCreep) {return (ennemyCreep.getActiveBodyparts(HEAL) > 0)}});
		
		
		
		// Computations
		// This will be the total max healpower of ennemies
		let totalEnnemyHealPower = 0;
		// We count ennemies with heal body parts
		if(ennemyCreepsWithHeal.length > 0) {
			// For each such ennemy
			for(let ennemyCreepIndex = 0; ennemyCreepIndex < ennemyCreepsWithHeal.length; ennemyCreepIndex++) {
				// We iterate over its body
				for(let ennemyCreepBodyIndex = 0; ennemyCreepBodyIndex < ennemyCreepsWithHeal[ennemyCreepIndex].body.length; ennemyCreepBodyIndex++) {
					// If we found a heal body part
					if(ennemyCreepsWithHeal[ennemyCreepIndex].body[ennemyCreepBodyIndex].type == HEAL) {
						// If there is no boost
						if(ennemyCreepsWithHeal[ennemyCreepIndex].body[ennemyCreepBodyIndex].boost == undefined) {
							// We add its healpower to our counter
							totalEnnemyHealPower += HEAL_POWER;
						}
						// If there is a boost
						else {
							// Then we factor in the boost factor, and add the it to our counter.
							totalEnnemyHealPower += (HEAL_POWER * BOOSTS[HEAL][ennemyCreepsWithHeal[ennemyCreepIndex].body[ennemyCreepBodyIndex].boost][HEAL]);
						}
					}
				}
			}
		}
		
		// This will be a conservative estimate of the firing power we have - worst case distance.
		let totalFirePower = 0;
		if(numberOfTowers > 0) {
			totalFirePower = numberOfTowers * TOWER_POWER_ATTACK * (1 - TOWER_FALLOFF);
		}
		
		// To be improved : boolean invaders yes/no
		
		// And now the threat level definition
		// No ennemies => no danger.
		if(ennemyCreeps.length == 0) {
			treatedRoom.memory.threatLevel = 0;
		}
		// If there's an ennemy, but no heal, level 1, just shoot it down.
		if(ennemyCreeps.length > 0 && totalEnnemyHealPower == 0) {
			treatedRoom.memory.threatLevel = 1;
		}
		// If there's ennemies with healpower, we're in trouble.
		if(totalEnnemyHealPower > 0) {
			treatedRoom.memory.threatLevel = 2;
		}
		// If the total heal power of ennemies is above our firepower, but it's invaders, it's an issue but not so much
		if(totalEnnemyHealPower > totalFirePower && ennemyInvaderCreeps.length > 0) {
			treatedRoom.memory.threatLevel = 3;
		}
		// If the total heal power of ennemies is above our firepower, and it's not invaders, that's a big issue
		if(totalEnnemyHealPower > totalFirePower && ennemyInvaderCreeps.length == 0) {
			treatedRoom.memory.threatLevel = 4;
		}
		
		if(alwaysDisplayRoomThreatLevel) {
			console.log('Room ' + treatedRoom.name + ', threat level : ' + treatedRoom.memory.threatLevel);
		}
		if(displayAttackedRoomThreatLevel) {
			if(treatedRoom.memory.threatLevel > 0) {
				console.log('Room ' + treatedRoom.name + ', threat level : ' + treatedRoom.memory.threatLevel);
			}
		}
		
    }
}

module.exports = setRoomThreatLevel;
