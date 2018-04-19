/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('get.depositTargetUnderlying');
 * mod.thing == 'a thing'; // true
 */
 
 // This function defines the deposit target of the creep.
 // The logic of knowing wheter this is needed is done in another file.
 
 var depositTargetUnderlying = {
     run: function(creep) {
        
		// debugging log.
        var activateLog = false;
        
        // Control variables leting us set the maximum in each type of storage before moving on to the extensions and spawn
        // MUST BE ALIGNED WITH THE SAME CONSTANT IN DEPOSITTARGET
        let maximumFillingOfContainer = 1750;
        let maximumFillingOfStorageOne = 37500;  // keeping this high should ensure us that when spawning an upgrader creep, we will have enough to feed him for a loong time.
        let maximumFillingOfStorageTwo = 650000;
        let maximumFillingOfTerminal = 20000;
		
		// Control variable to fill towers in priority if eneded
		let minimumFillingOfRepairingTower = TOWER_CAPACITY/1.5;	//  MUST BE ALIGNED WITH TOWER SCRIPT
		let minimumFillingOfAttackingTower = TOWER_CAPACITY/1.05;
		
        
		
		// Current priority order :
		// 1.  In case of theat, towers with energy under variable "attacking"
		// 2.  Extension and spaws not filled
		// 2.5 Towers with energy under variable "repairing"
		// 3.  Containers under storage limit
		// 4.  Storage under maximumFillingOfStorageOne limit (40k minimum for an upgrader)
		// 5.  Terminal under maximumFillingOfTerminal limit (energy for selling minerals)
		// 6.  Power spawn not yet filled
		// 7.  Storage under maximumFillingOfStorageTwo - will be its maximum filling
		// 8.  Terminal not filled. Once filled, will dump energy on market, so this will never be completed.
		
		// Global logic is to find priority, if null, move to next one, etc.
		
		
		var mainTarget = null;
		
		// If there is a threat
		if(creep.room.memory.threatLevel > 0) {
			// We look for the lowest-energy tower
			let finalTower = 0;
			let finalTowerEnergy = 10000;
			let roomTowers = creep.room.memory.towers;
			// We iterate over the room towers
			for(let towerIndex = 0; towerIndex < roomTowers.length; towerIndex++) {
				let towerEnergy = Game.getObjectById(roomTowers[towerIndex]).energy; 
				// We'll look for a better-than-we-have-so-far toarget
				let towerIsBetter = false;
				
				// We look for creeps that are already attached to the tower parsed, and delivering energy to it
				let creepsAlreadyAttached = _.filter(Game.creeps, (testedCreep) => (
					!testedCreep.memory.gathering &&
					testedCreep.memory.depositTarget == roomTowers[towerIndex]
					));
				// If there is none, we consider the tower as a potential deposit, and do the following
				if(creepsAlreadyAttached.length == 0) {
					// If we found one with the same energy than we had so far
					if(Game.getObjectById(finalTower) != undefined) {
						if(towerEnergy == finalTowerEnergy) {
							// But our new tower is closer
							if(creep.pos.getRangeTo(Game.getObjectById(roomTowers[towerIndex])) < creep.pos.getRangeTo(Game.getObjectById(finalTower))) {
								// Then we found a better target
								towerIsBetter = true;
							}
						}
					}
					// And we found another with less energy, then it is simply better - that is the priority.
					if(towerEnergy <= finalTowerEnergy && towerEnergy <= minimumFillingOfAttackingTower) {
						towerIsBetter = true;
					}
				}
				
				// So if we found a better target
				// Meaning here :
				// - There is no other creep delivering energy there so far, we do not consider those already having a creep in our computations
				// For all such towers :
				// - It is the lowest energy bearing target
				// - In case there's two lowest energy bearing target, we take the closest one
				if(towerIsBetter) {
					// Then it's gonna be the one
					finalTowerEnergy = Game.getObjectById(roomTowers[towerIndex]).energy;
					finalTower = roomTowers[towerIndex];
				}
				
			}
			// It's already an ID !
			mainTarget = finalTower;
		}
        if(mainTarget != null) {
            if(activateLog) {
                console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null main target, ' + mainTarget)
            }
            creep.memory.depositTarget = mainTarget;
        }
        
        
        else {
            var secondaryTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            if(secondaryTarget != null) {
                if(activateLog) {
                    console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null secondary target, ' + secondaryTarget)
                }
                creep.memory.depositTarget = secondaryTarget.id;            
            }
            
            else {
				var secondaryDotFiveTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_TOWER)   && structure.energy < minimumFillingOfRepairingTower;
					}
				});
				if(secondaryDotFiveTarget != null) {
					if(activateLog) {
						console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null secondary dot five target, ' + secondaryDotFiveTarget)
					}
					creep.memory.depositTarget = secondaryDotFiveTarget.id;            
				}
				else {
					var tertiaryTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_CONTAINER)   && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && structure.store[RESOURCE_ENERGY] < maximumFillingOfContainer;
						}
					});
					
					if(tertiaryTarget != null) {
						if(activateLog) {
							console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null tertiary target, ' + tertiaryTarget)
						}
						creep.memory.depositTarget = tertiaryTarget.id;                    
					}
					
					else {
						var quatriTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
							filter: (structure) => {
								return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && structure.store[RESOURCE_ENERGY] < maximumFillingOfStorageOne;
								}
						});
						
						if(quatriTarget != null) {
							if(activateLog) {
								console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null quatri target, ' + quatriTarget)
							}
							creep.memory.depositTarget = quatriTarget.id;                      
						}
						
						else {
							var quintoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
								filter: (structure) => {
									return (structure.structureType == STRUCTURE_TERMINAL) && structure.store[RESOURCE_ENERGY] < maximumFillingOfTerminal;
									}
							});
							
							if(quintoTarget != null) {
								if(activateLog) {
									console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null quinto target, ' + quintoTarget)
								}
								creep.memory.depositTarget = quintoTarget.id;    
							}
							else {
								var quintoDotFiveTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
								filter: (structure) => {
									return (structure.structureType == STRUCTURE_POWER_SPAWN) && structure.energy < structure.energyCapacity;
									}
								});
								
								if(quintoDotFiveTarget != null) {
									if(activateLog) {
										console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null quinto dot five target, ' + quintoDotFiveTarget)
									}
									creep.memory.depositTarget = quintoDotFiveTarget.id;   
									
								}
							
								else {
									var sextoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
									filter: (structure) => {
										return (structure.structureType == STRUCTURE_NUKER)   && structure.energy < structure.energyCapacity;
										}
									});
									if(sextoTarget != null ) {
										if(activateLog) {
											console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null sexto target, ' + sextoTarget)
										}
										creep.memory.depositTarget = sextoTarget.id;        
									}
									else {
										var septoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
										filter: (structure) => {
											return (structure.structureType == STRUCTURE_STORAGE)   && structure.store[RESOURCE_ENERGY] < maximumFillingOfStorageTwo;
											}
										});
									
										if(septoTarget != null) {
											if(activateLog) {
												console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null septo target, ' + septoTarget)
											}
											creep.memory.depositTarget = septoTarget.id;    
										}
										else {
											var octoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
											filter: (structure) => {
												return (structure.structureType == STRUCTURE_TERMINAL)   && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
												}
											});
											if(octoTarget != null) {
												if(activateLog) {
													console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null octo target, ' + octoTarget)
												}
												creep.memory.depositTarget = octoTarget.id;    
											}
											
											
										
										}
										
									}
								}
							}
						}
					}
				}
            }
        }
     }
 };

module.exports = depositTargetUnderlying;