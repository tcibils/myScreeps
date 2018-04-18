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
		let minimumFillingOfRepairingTower = TOWER_CAPACITY/3;
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
			// We iterate over the room towers
			for(let towerIndex = 0; towerIndex < creep.room.memory.towers.length; towerIndex++) {
				let towerEnergy = Game.getObjectById(creep.room.memory.towers[towerIndex]).energy; 
				// If we found one with less energy than we had so far
				if(towerEnergy < finalTowerEnergy && towerEnergy < minimumFillingOfAttackingTower) {
					// Then it's gonna be the one
					finalTowerEnergy = Game.getObjectById(creep.room.memory.towers[towerIndex]).energy;
					finalTower = creep.room.memory.towers[towerIndex];
				}
			}
			mainTarget = finalTower;
		}
        if(mainTarget != null) {
            if(activateLog) {
                console.log('Room ' +creep.room.name + ', creep ' + creep.name + ', we take non null main target, ' + mainTarget)
            }
            creep.memory.depositTarget = mainTarget.id;
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