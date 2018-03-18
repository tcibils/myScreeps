
var depositTargetUnderlying = require('get.depositTargetUnderlying');

var depositTarget = {
     run: function(creep) {
        // Control variables leting us set the maximum in each type of storage before moving on to the extensions and spawn
        let maximumFillingOfContainer = 1750;
        let maximumFillingOfStorage = 37500; 
        let maximumFillingOfTerminal = 20000;
        // keeping this high should ensure us that when spawning an upgrader creep, we will have enough to feed him for a loong time.
        // MUST BE ALIGNED WITH THE SAME CONSTANT IN DESPOSITTARGETUNDERLYING
        

        
         
        if(Game.getObjectById(creep.memory.depositTarget) == undefined) {
            depositTargetUnderlying.run(creep);
        }
        
        if(Game.getObjectById(creep.memory.depositTarget) != undefined) {
            let currentDepositTarget = Game.getObjectById(creep.memory.depositTarget)
            let currentDepositTargetType = Game.getObjectById(creep.memory.depositTarget).structureType;
            let fractionOfCapacity = 2;
            let energyAvailableTooLow = false;
            
            if(creep.room.energyAvailable < (creep.room.energyCapacityAvailable / fractionOfCapacity)) {
                energyAvailableTooLow = true;
            }
            
            
            
            if(currentDepositTargetType == STRUCTURE_CONTAINER) {
                if(currentDepositTarget.store[RESOURCE_ENERGY] > maximumFillingOfContainer || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            if(currentDepositTargetType == STRUCTURE_STORAGE) {
                if(currentDepositTarget.store[RESOURCE_ENERGY] > maximumFillingOfStorage || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            
            if(currentDepositTargetType == STRUCTURE_TERMINAL) {
                if(currentDepositTarget.store[RESOURCE_ENERGY] > maximumFillingOfTerminal || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            if(currentDepositTargetType == STRUCTURE_NUKER ||currentDepositTargetType == STRUCTURE_POWER_SPAWN) {
                if(currentDepositTarget.energy == currentDepositTarget.energyCapacity || energyAvailableTooLow) {
                    depositTargetUnderlying.run(creep);
                }
            }
            
            
            if(currentDepositTargetType == STRUCTURE_SPAWN || currentDepositTargetType == STRUCTURE_EXTENSION || currentDepositTargetType == STRUCTURE_TOWER) {
                if(currentDepositTarget.energy > 0) {
                    depositTargetUnderlying.run(creep);
                }
            }
        }
    }
};

module.exports = depositTarget;