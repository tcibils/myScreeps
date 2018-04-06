var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFatHarvester = require('role.fatharvester');
var roleFastMover = require('role.fastmover');
var placesOfSource = require('get.placesOfSource');
var freeSpotsOfSource = require('get.freeSpotsOfSource');
var ennemyAroundSource = require('get.ennemyAroundSource');
var rolePureFighter = require('role.pureFighter');
var freeFatSpotsOfSource = require('get.freeFatSpotsOfSource');
var functionLink = require('building.link');
var functionTower = require('building.tower');
var functionTerminal = require('building.terminal');
var spreaderNeededOfLink = require('get.spreaderNeededOfLink');
var roleLongDistanceFatHarvester = require('role.longDistanceFatHarvester');
var roleLongDistanceFastMover = require('role.longDistanceFastMover');
var roleLongDistanceSecurity = require('role.longDistanceSecurity');
var roleLongDistanceBuilder = require('role.longDistanceBuilder');
var roleRoomClaimer = require('role.roomClaimer');
var roleRepairer = require('role.repairer');
var roleSlacker = require('role.slacker');
var roleScout = require('role.scout');
var roleSpreaderEfficient = require('role.spreaderEfficient');
var roleExtractor = require('role.extractor');
var roleLongDistanceReserver = require('role.longDistanceReserver');
var rolelongDistancePowerAttacker = require('role.longDistancePowerAttacker');
var rolelongDistancePowerCarry = require('role.longDistancePowerCarry');
var rolelongDistancePowerHealer = require('role.longDistancePowerHealer');
var roleSpreaderPower = require('role.spreaderPower');

var senderLinkCloseToSource = require('info.senderLinkCloseToSource');
var processLDEnergyInfo = require('process.LDEnergyInfo');
var processLDPowerInfo = require('process.LDPowerInfo');

var setLDHEnergyNeedOfRoom = require('set.LDHEnergyNeedOfRoom');
var setLDHPowerNeedOfRoom = require('set.LDHPowerNeedOfRoom')
var setNeedCreepsEnergyHarvestingOfRoom = require('set.NeedCreepsEnergyHarvestingOfRoom')
var setNeedCreepsEnergySpreadingOfRoom = require('set.NeedCreepsEnergySpreadingOfRoom')
var setNeedCreepsBuildingsOfRoom = require('set.NeedCreepsBuildingsOfRoom')
var setNeedCreepsMineralExtractorsOfRoom = require('set.NeedCreepsMineralExtractorsOfRoom')
var setNeedCreepsUpgradersOfRoom = require('set.NeedCreepsUpgradersOfRoom')
var setNeedCreepsScoutOfRoom = require('set.NeedCreepsScoutOfRoom')
var setNeedCreepsAdHocHarvestersOfRoom = require('set.NeedCreepsAdHocHarvestersOfRoom')
var setExistingBuildingsOfRoom = require('set.ExistingBuildingsOfRoom')
/*
C:\Users\Thomas\AppData\Local\Screeps\scripts\screeps.com\autoEmpire1
Game.spawns['Spawn11'].spawnCreep([CLAIM,MOVE], 'Claimer' + Game.time,  {memory: {role: 'roomClaimer', targetRoom: 'W37N47', originRoom: 'W42N48'}});

*/

module.exports.loop = function () {

    console.log('------------')
    console.log('Starting - time ' + Game.time)


    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------- PARAMETERS DASHBOARD ------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------


    // Information display in console variables
    var showLongDistanceDashboard = false;
    var showRoomSpawn = false;
    var showScoutsPositions = true;
	
    var showRoomDashboardBuildings = false;
    var showRoomDashboardBuildingsToDisplay = 'W43N51';
    var showRoomDashboardCreeps = false;
    var showRoomDashboardCreepToDisplay = 'W43N51';

    // Room to pillage. To be emptied manually when finished.
    var longDistancePillageRooms = [];
    // Warriors not needed for storage looting. For terminals ?
    var longDistancePillageRoomsWarriorNeeded = [];
    // Cannot compute automatically carry needed, due to visibility. Please input manually here.
    var longDistancePillageRoomsCarryNeeded = [];

    // Input table for building rooms. Can be used for claiming new room or re-building a destroyed room
    var longDistanceBuildRooms = ['W37N47'];
    // Pas s'emmerder avec l'automatique, c'est Ã  changer anyway
    var longDistanceBuildRoomsHomeRooms = ['W42N48'];
    // Number of builders to use.
    var longDistanceBuildRoomsBuilders = [0];

    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------

    // Cleaning up memeory
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
	
	if(showScoutsPositions) {
		let scouts = _.filter(Game.creeps, (creep) =>
			creep.memory.role == 'scout'
		);
		console.log('Scout Listing Dashboard');
		for(let scoutIndex = 0; scoutIndex < scouts.length; scoutIndex++) {
			console.log('Scout ' + scouts[scoutIndex].name + ', position ' + scouts[scoutIndex].pos + ', target room : ' + scouts[scoutIndex].memory.targetRoom + ', target room direction : ' + scouts[scoutIndex].memory.targetRoomDirection + ', time to live ' + scouts[scoutIndex].ticksToLive + ', home room : ' + scouts[scoutIndex].memory.homeRoom);
		}
	}

    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------- ROOM MANAGEMENT ------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------


    // Array with my rooms, and with rooms names
    var myRooms = _.filter(Game.rooms, (currentRoom) => currentRoom.controller != undefined && currentRoom.controller.my);
    var myRoomsNames = [];

    for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
        myRoomsNames.push(myRooms[currentRoomIndex].name);
    }


    for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
		
		
		// For each index, the ID the said buildings in the room, and their position for some of them
        myRooms[currentRoomIndex].memory.spawningPoints = [];
        myRooms[currentRoomIndex].memory.spawningPointsPos = [];
		
        myRooms[currentRoomIndex].memory.powerSpawningPoints = [];

        myRooms[currentRoomIndex].memory.links = [];
        myRooms[currentRoomIndex].memory.storages = [];
        myRooms[currentRoomIndex].memory.towers = [];
		
		if(Game.time % 500 == 0) {
            myRooms[currentRoomIndex].memory.receiverLinks = null;
            myRooms[currentRoomIndex].memory.senderLinks = null;
        }
        // We first define the two arays
        if(myRooms[currentRoomIndex].memory.senderLinks == null) {
            myRooms[currentRoomIndex].memory.senderLinks = [];
        }
        if(myRooms[currentRoomIndex].memory.receiverLinks == null) {
            myRooms[currentRoomIndex].memory.receiverLinks = [];
        }
		
		
		// Sets the existing buildings in the room memory, filling the above tables
		setExistingBuildingsOfRoom.run(myRooms[currentRoomIndex]);

		
        // SpawningPrioritied

        myRooms[currentRoomIndex].memory.priorities = [];
        myRooms[currentRoomIndex].memory.priorities.push('harvester');
        myRooms[currentRoomIndex].memory.priorities.push('spreaderEfficient');
        myRooms[currentRoomIndex].memory.priorities.push('slacker');
        myRooms[currentRoomIndex].memory.priorities.push('fastMover');
        myRooms[currentRoomIndex].memory.priorities.push('fatHarvester');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceSecurity');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceCarryPower');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceHealerPower');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceAttackerPower');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceFatHarvester');
        myRooms[currentRoomIndex].memory.priorities.push('roomReserver');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceFastMover');
        myRooms[currentRoomIndex].memory.priorities.push('builder');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceBuilder');
        myRooms[currentRoomIndex].memory.priorities.push('repairer');
        myRooms[currentRoomIndex].memory.priorities.push('extractor');
        myRooms[currentRoomIndex].memory.priorities.push('upgrader');
        myRooms[currentRoomIndex].memory.priorities.push('scout');
		


        // CREEPS Data table

        myRooms[currentRoomIndex].memory.labels = [];
        myRooms[currentRoomIndex].memory.need = [];
        myRooms[currentRoomIndex].memory.attached = [];
        myRooms[currentRoomIndex].memory.role = [];
        myRooms[currentRoomIndex].memory.unity = [];
        myRooms[currentRoomIndex].memory.targetRoom = [];
        myRooms[currentRoomIndex].memory.needOrigin = [];
        myRooms[currentRoomIndex].memory.needOriginPos = [];
        myRooms[currentRoomIndex].memory.criticalNeed = [];
		
        
		// Sets the needs and fills the data structure above for different types of creeps
		setNeedCreepsEnergyHarvestingOfRoom.run(myRooms[currentRoomIndex]);
		setNeedCreepsEnergySpreadingOfRoom.run(myRooms[currentRoomIndex]);
		setNeedCreepsBuildingsOfRoom.run(myRooms[currentRoomIndex]);
		setNeedCreepsMineralExtractorsOfRoom.run(myRooms[currentRoomIndex]);
		setNeedCreepsUpgradersOfRoom.run(myRooms[currentRoomIndex]);
		setNeedCreepsScoutOfRoom.run(myRooms[currentRoomIndex]);
		setNeedCreepsAdHocHarvestersOfRoom.run(myRooms[currentRoomIndex]);
		
		

        myRooms[currentRoomIndex].memory.labels.push('Power Spreader');
		
		if(Game.getObjectById(myRooms[currentRoomIndex].memory.storageOfRoom[0] != undefined)) {
			if(Game.getObjectById(myRooms[currentRoomIndex].memory.storageOfRoom[0]).store[RESOURCE_POWER] > 0) {
				myRooms[currentRoomIndex].memory.need.push(1);
			}
			else {
				myRooms[currentRoomIndex].memory.need.push(0);
			}
		}
		else {
			myRooms[currentRoomIndex].memory.need.push(0);
		}
		
        var spreadersPowerExisting = _.filter(Game.creeps, (creep) => (creep.memory.role == 'spreaderPower' && creep.memory.homeRoom == myRooms[currentRoomIndex].name));
        myRooms[currentRoomIndex].memory.attached.push(spreadersPowerExisting.length);
		
        myRooms[currentRoomIndex].memory.attached.push();
        myRooms[currentRoomIndex].memory.role.push('spreaderPower');
        myRooms[currentRoomIndex].memory.unity.push('number of creeps');
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined');
        myRooms[currentRoomIndex].memory.needOriginPos.push('undefined');
        myRooms[currentRoomIndex].memory.criticalNeed(false);

		// Using scout info to define the LD Harvesting needs
		setLDHEnergyNeedOfRoom.run(myRooms[currentRoomIndex]);
		setLDHPowerNeedOfRoom.run(myRooms[currentRoomIndex]);


        // SECURITY

        // For each index, a boolean stating if the room is under attack
        myRooms[currentRoomIndex].memory.underAttack = false;

        var ennemies = myRooms[currentRoomIndex].find(FIND_HOSTILE_CREEPS);
        var counterEnnemy = 0;
        if(ennemies.length > 0) {
            for(let a = 0; a < ennemies.length; a++) {
                counterEnnemy += ennemies[a].getActiveBodyparts(ATTACK)
            }
        }
        if(myRooms[currentRoomIndex].memory.towers.length == 0 && counterEnnemy > 4) {
            myRooms[currentRoomIndex].memory.underAttack = true;
        }
        else if(myRooms[currentRoomIndex].memory.towers.length > 0 && counterEnnemy > 6) {
            myRooms[currentRoomIndex].memory.underAttack = true;
        }
        else {
            myRooms[currentRoomIndex].memory.underAttack = false;
        }
		
	}



    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------- LONG DISTANCE ---------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------

    var longDistancePillageRoomsHomeRooms = [];
    var longDistancePillageRoomsWarriorAttached = [];
    var longDistancePillageRoomsCarryAttached = [];

    // For each room,
    for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
        // Long distance builders table filling
        for(let currentLongDistanceBuildRoomIndex = 0; currentLongDistanceBuildRoomIndex < longDistanceBuildRooms.length; currentLongDistanceBuildRoomIndex++) {
            if(myRoomsNames[currentRoomIndex] == longDistanceBuildRoomsHomeRooms[currentLongDistanceBuildRoomIndex]) {
                myRooms[currentRoomIndex].memory.labels.push('Builder target room ' + longDistanceBuildRooms[currentLongDistanceBuildRoomIndex]);
                myRooms[currentRoomIndex].memory.need.push(longDistanceBuildRoomsBuilders[currentLongDistanceBuildRoomIndex]);

                var longDistanceBuildersAdhoc = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceBuilder' && creep.memory.targetRoom == longDistanceBuildRooms[currentLongDistanceBuildRoomIndex]);
                myRooms[currentRoomIndex].memory.attached.push(longDistanceBuildersAdhoc.length);

                myRooms[currentRoomIndex].memory.role.push('longDistanceBuilder');
                myRooms[currentRoomIndex].memory.unity.push('Number of creeps');
                myRooms[currentRoomIndex].memory.targetRoom.push(longDistanceBuildRooms[currentLongDistanceBuildRoomIndex]);
                myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
                myRooms[currentRoomIndex].memory.needOriginPos.push('undefined')
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);
            }
        }
    }



    //-------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------- DISPLAYS OF INFORMATION ----------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------


    if(showLongDistanceDashboard) {
		// To be rebuilt
    }

    if(showRoomDashboardBuildings) {
        for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
            if(myRoomsNames[currentRoomIndex] == showRoomDashboardBuildingsToDisplay) {
                console.log('ROOM ' + myRoomsNames[currentRoomIndex] + ' BUILDING MANAGEMENT DASHBOARD')
                console.log('Under attack : ' + myRooms[currentRoomIndex].memory.underAttack)
                console.log('Towers       : ' + myRooms[currentRoomIndex].memory.towers)
                console.log('Spawning     : ' + myRooms[currentRoomIndex].memory.spawningPoints)
                console.log('Sources      : ' + myRooms[currentRoomIndex].memory.sources)
                console.log('Send. Links  : ' + myRooms[currentRoomIndex].memory.senderLinks)
                console.log('Reciev. Links: ' + myRooms[currentRoomIndex].memory.receiverLinks)
                console.log('Storages     : ' + myRooms[currentRoomIndex].memory.storages)
            }
        }
    }
	
	if(showRoomDashboardCreeps) {
        for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
            if(myRoomsNames[currentRoomIndex] == showRoomDashboardCreepToDisplay) {
                console.log('ROOM ' + myRoomsNames[currentRoomIndex] + ' CREEPS MANAGEMENT DASHBOARD')
                for(let generalCounter = 0; generalCounter < myRooms[currentRoomIndex].memory.labels.length; generalCounter++) {
                    console.log(myRooms[currentRoomIndex].memory.attached[generalCounter] + '/'+ myRooms[currentRoomIndex].memory.need[generalCounter] + ' ' + myRooms[currentRoomIndex].memory.role[generalCounter] +  ', target room ' + myRooms[currentRoomIndex].memory.targetRoom[generalCounter] + ', origin : ' + myRooms[currentRoomIndex].memory.needOrigin[generalCounter]) /* + ', label : ' + myRooms[currentRoomIndex].memory.labels[generalCounter])*/
                    // console.log('Unity : ' + myRooms[currentRoomIndex].memory.unity[generalCounter])
                }
            }
        }
    }


    //-------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------- LOOP ON ROOMS STARTS HERE --------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------

    for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
        if(myRooms[currentRoomIndex] != undefined) {

        // ----------- Security : if we have many enemies in the room, we activate safe mode

        if(myRooms[currentRoomIndex].memory.underAttack) {
            myRooms[currentRoomIndex].controller.activateSafeMode();
            Game.notify('Room : ' + myRooms[currentRoomIndex].name + ', trying to activate safe mode. Ennemies in room.')
        }

       // Then we start with the spawning queue

        if(myRooms[currentRoomIndex].memory.spawningPoints.length > 0) {
            // This first variable checks if we took a decision to spawn a creep this turn already.
            // The goal here is to avoid to have two spawns wanting to spawn the same creep, but not enough energy for both creeps
            let priorityFoundForTurn = false;
            let spawnFoundForTurn = false;
            // This second variable is to be used to store the spawning results, in order to be able to use a potential 2nd spawn
            let spawningResult = 1;

                // We check the priorities
                for(let priorityIndex = 0; priorityIndex < myRooms[currentRoomIndex].memory.priorities.length && !priorityFoundForTurn; priorityIndex++) {
                    // And for each prioritiy, we will check the needs
                    for(let needIndex = 0; needIndex < myRooms[currentRoomIndex].memory.need.length; needIndex++) {
                        // If the priority matches the role need (ie we found our entry in the room memory tables)
                        if(myRooms[currentRoomIndex].memory.priorities[priorityIndex] == myRooms[currentRoomIndex].memory.role[needIndex]) {
                            // If the need is greater than the attached, we spawn a creep
                            if(myRooms[currentRoomIndex].memory.need[needIndex] > myRooms[currentRoomIndex].memory.attached[needIndex]) {
                                priorityFoundForTurn = true;
                                // For each spawn
                                for(let spawnIndex = 0; spawnIndex < myRooms[currentRoomIndex].memory.spawningPoints.length && !spawnFoundForTurn; spawnIndex++) {


                                let capacityToBeUsed = 0;

                                if(myRooms[currentRoomIndex].memory.criticalNeed[needIndex]) {
                                    capacityToBeUsed = myRooms[currentRoomIndex].energyAvailable;
                                }
                                else {
                                    capacityToBeUsed = myRooms[currentRoomIndex].energyCapacityAvailable;
                                }

                                let creepBody = [];

                                // OK for spawning prototype
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'harvester') {
                                    creepBody.push(WORK);
                                    creepBody.push(CARRY);
                                    creepBody.push(MOVE);
                                }

                                // KO - NEED SOURCEATTACHED

                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'fastMover') {
                                    for(let j = 0; j < myRooms[currentRoomIndex].memory.need[needIndex] && j < Math.floor(capacityToBeUsed / 100) && j < 10; j++) {
                                        creepBody.push(CARRY);
                                        creepBody.push(MOVE);
                                    }
                                }

                                // OK for spawning prototype
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'slacker') {
                                    // !!! energyCapacity et pas energyCapacityAvailable : normal, si j'en ai pas, je meurs !
                                    for(let j=0; j< Math.floor((capacityToBeUsed - 50) /50) && j<8; j++) {
                                        creepBody.push(CARRY);
                                    }
                                    creepBody.push(MOVE);
                                }

                                // OK for spawning prototype
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'spreaderEfficient') {
                                    // !!! energyCapacity et pas energyCapacityAvailable : normal, si j'en ai pas, je meurs !
                                    for(let j=0; j< Math.floor((capacityToBeUsed) /150) && j<8; j++) {
                                        creepBody.push(CARRY);
                                        creepBody.push(CARRY);
                                        creepBody.push(MOVE);
                                    }
                                }

                                // Ok for spawning prototype
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'fatHarvester') {
                                    for(let j = 0; j < 5 && j < Math.floor((capacityToBeUsed - 100) / 100); j++) {
                                        creepBody.push(WORK);
                                    }
                                    creepBody.push(CARRY);
                                    creepBody.push(MOVE);
                                }
								
                                // OK for spawning prototype - role only
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'builder') {
                                    for(let j = 0; j< Math.floor((capacityToBeUsed) / 200) && j < 5; j++) {
                                        creepBody.push(WORK);
                                        creepBody.push(CARRY);
                                        creepBody.push(MOVE);
                                    }
                                }

                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'scout') {
                                    creepBody.push(MOVE);
                                }

                                // OK for spawning prototype - role only
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'repairer') {
                                    for(let j = 0; j< Math.floor((capacityToBeUsed) / 250) && j < 4; j++) {
                                        creepBody.push(WORK);
                                       creepBody.push(CARRY);
                                        creepBody.push(MOVE);
                                       creepBody.push(MOVE);
                                    }
                                }

                                // OK for spawning prototype - role only
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'extractor') {
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                    creepBody.push(CARRY);
                                    creepBody.push(CARRY);
                                    creepBody.push(CARRY);
                                    creepBody.push(MOVE);
                                    creepBody.push(MOVE);
                                    creepBody.push(MOVE);
                                }

                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceBuilder') {
									// Useless to do bigger than 5 work part creeps, as we're capped by the sources in target room
                                    for(let j = 0; j< Math.floor((capacityToBeUsed) / 200) && j < 5; j++) {
										creepBody.push(WORK);
										creepBody.push(CARRY);
										creepBody.push(MOVE);
									}
								}
				
                                // OK for spawning prototype - target room only
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceFatHarvester') {
									let maxNumberBodyParts = 5;
                                    for(let j = 0; j < maxNumberBodyParts; j++) {
										creepBody.push(MOVE);
									}
                                    creepBody.push(CARRY);		
                                    for(let j = 0; j < maxNumberBodyParts; j++) {
										creepBody.push(WORK);
									}																	
                                }
								
								if(myRooms[currentRoomIndex].memory.role[needIndex] == 'roomReserver') {
									for(let j = 0; j< Math.floor((capacityToBeUsed) / 650) && j < 7; j++) {
										creepBody.push(CLAIM);
										creepBody.push(MOVE);
									}
								}
								
                                // OK for spawning prototype - target room and home room
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceFastMover') {
                                    for(let j = 0; j<8; j++) {
                                        creepBody.push(MOVE);
                                        creepBody.push(CARRY);
                                    }
                                }

                                // OK for spawning prototype - target room only
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceSecurity') {
                                    let bodySize = 3;
                                    for(let i = 0; i<bodySize; i++) {
                                        creepBody.push(TOUGH);
                                        creepBody.push(TOUGH);
                                        creepBody.push(MOVE);
                                        creepBody.push(MOVE);
                                    }
                                    for(let i = 0; i<bodySize; i++) {
                                        creepBody.push(MOVE);
                                        creepBody.push(ATTACK);
                                    }
                                }
								
								if(myRooms[currentRoomIndex].memory.role[needIndex] == 'spreaderPower') {
									creepBody.push(MOVE);
									creepBody.push(MOVE);
									creepBody.push(CARRY);
									creepBody.push(CARRY);
								}
								
								// --------------- POWER CREEPS BODYS - According to excel computations
								if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceAttackerPower') {
                                    for(let j = 0; j < 20; j++) {
                                        creepBody.push(MOVE);
                                    }
                                    for(let j = 0; j < 20; j++) {
                                        creepBody.push(ATTACK);
                                    }
                                }
								
								if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceHealerPower') {
                                    for(let j = 0; j < 25; j++) {
                                        creepBody.push(MOVE);
                                    }
                                    for(let j = 0; j < 25; j++) {
                                        creepBody.push(HEAL);
                                    }
                                }
								
								if(myRooms[currentRoomIndex].memory.role[needIndex] == 'longDistanceCarryPower') {
                                    for(let j = 0; j < 20; j++) {
                                        creepBody.push(MOVE);
                                    }
                                    for(let j = 0; j < 20; j++) {
                                        creepBody.push(CARRY);
                                    }
                                }

								

                                // Ok for spawning prototype
                                if(myRooms[currentRoomIndex].memory.role[needIndex] == 'upgrader') {
                                    if(myRooms[currentRoomIndex].controller.level == 8) {
										for(let i=0; i<15; i++) {
											creepBody.push(WORK);
                                        }
										creepBody.push(CARRY);
                                        creepBody.push(MOVE);
                                        creepBody.push(MOVE);
                                    }
                                    else {
                                        if(myRooms[currentRoomIndex].controller.level <= 3) {
                                            upgraderCarryMoveParts = 1;
                                        }
                                        if(myRooms[currentRoomIndex].controller.level < 5 && myRooms[currentRoomIndex].controller.level > 3) {
                                            upgraderCarryMoveParts = 3;
                                        }
                                        if(myRooms[currentRoomIndex].controller.level >= 5) {
                                            upgraderCarryMoveParts = 5;
                                        }

                                        for(let j = 0; j< Math.floor((capacityToBeUsed - (upgraderCarryMoveParts * 100)) / 100) && j < (50-(upgraderCarryMoveParts*2)); j++) {
                                            creepBody.push(WORK);
                                        }
                                        for(let j = 0; j<upgraderCarryMoveParts; j++) {
                                            creepBody.push(CARRY);
                                            creepBody.push(MOVE);
                                        }
                                    }
                                }
								
								
                                spawningResult = (Game.getObjectById(myRooms[currentRoomIndex].memory.spawningPoints[spawnIndex]).spawnCreep(
                                    creepBody,
                                    myRooms[currentRoomIndex].memory.role[needIndex] + Game.time,
                                        {memory: {
                                            role: myRooms[currentRoomIndex].memory.role[needIndex],
                                            targetRoom : myRooms[currentRoomIndex].memory.targetRoom[needIndex],
                                            homeRoom: myRooms[currentRoomIndex].name,
                                            needOrigin: myRooms[currentRoomIndex].memory.needOrigin[needIndex],
                                            needOriginPos: myRooms[currentRoomIndex].memory.needOriginPos[needIndex],
                                            creepSpawning: true}
                                }));

                                if(spawningResult == 0) {
                                    spawnFoundForTurn = true;
                                }


                                // We make a console log for tracking
                                if(showRoomSpawn) {
                                    console.log('Room ' + myRooms[currentRoomIndex].name + ', spawn ' + Game.getObjectById(myRooms[currentRoomIndex].memory.spawningPoints[spawnIndex]).name + ', spawning ' + myRooms[currentRoomIndex].memory.role[needIndex] + ', result : ' + spawningResult + '. Need ' + myRooms[currentRoomIndex].memory.need[needIndex] + ', attached ' + myRooms[currentRoomIndex].memory.attached[needIndex] + ', target room : ' + myRooms[currentRoomIndex].memory.targetRoom[needIndex] + ', priority ' + priorityIndex + '. Critical : ' + myRooms[currentRoomIndex].memory.criticalNeed[needIndex] + '.')
                                }
                            }
                        }
                    }
                }
                /*
                if(showRoomSpawn) {
                    console.log('Room ' + myRooms[currentRoomIndex].name + ', spawn ' + Game.getObjectById(myRooms[currentRoomIndex].memory.spawningPoints[spawnIndex]).name + ', no creep spawning.')
                }
                */
            }


        }

        if(myRooms[currentRoomIndex].memory.towers.length > 0) {
            for(let i = 0; i< myRooms[currentRoomIndex].memory.towers.length; i++) {
                functionTower.run(Game.getObjectById(myRooms[currentRoomIndex].memory.towers[i]));
            }
        }
        if(myRooms[currentRoomIndex].memory.links.length > 0) {
            for(let i = 0; i< myRooms[currentRoomIndex].memory.links.length; i++) {
                functionLink.run(Game.getObjectById(myRooms[currentRoomIndex].memory.links[i]));
            }
        }
        if(myRooms[currentRoomIndex].terminal) {
            functionTerminal.run(myRooms[currentRoomIndex].terminal);
        }
		
		// Power spawn : if enough ressources, we process power.
		if(myRooms[currentRoomIndex].memory.powerSpawningPoints.length > 0) {
			for(let powerSpawnIndex = 0; powerSpawnIndex < myRooms[currentRoomIndex].memory.powerSpawningPoints.length; powerSpawnIndex++) {
				if(Game.getObjectById(myRooms[currentRoomIndex].memory.powerSpawningPoints[powerSpawnIndex]).energy > 50 && Game.getObjectById(myRooms[currentRoomIndex].memory.powerSpawningPoints[powerSpawnIndex]).power > 1) {
					Game.getObjectById(myRooms[currentRoomIndex].memory.powerSpawningPoints[powerSpawnIndex]).processPower();
				}
			}
		}

        }
    }

    // console.log('Step 12 : ' + Game.cpu.getUsed() + ', before setting ALL roles')

    // On attribue les rôles en fonction de la memory
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.creepSpawning == undefined) {
            creep.memory.creepSpawning = false;
        }

        if(creep.memory.creepSpawning) {
            if(creep.say("Spawned!") != ERR_BUSY) {
                creep.memory.creepSpawning = false;
            }
        }

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            //console.log('Step 13 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + 'after setting harvester, before upgrader')
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            //console.log('Step 14 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting upgrader, before builder')
        }
        if(creep.memory.role == 'fastMover') {
            roleFastMover.run(creep);
//            console.log('Step 15 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting builder, before fastmover')
        }
        if(creep.memory.role == 'fatHarvester') {
            roleFatHarvester.run(creep);
//            console.log('Step 16 : ' + Game.cpu.getUsed() +', creep ' + creep.name +  ', after setting fastmover, before fatharvester')
        }
		
		if(creep.memory.role == 'longDistanceAttackerPower'){
			rolelongDistancePowerAttacker.run(creep)
		}
		if(creep.memory.role == 'longDistanceCarryPower'){
			rolelongDistancePowerCarry.run(creep)
		}
		if(creep.memory.role == 'longDistanceHealerPower'){
			rolelongDistancePowerHealer.run(creep)
		}
		
		
        if(creep.memory.role == 'spreaderPower') {
            roleSpreaderPower.run(creep);
        }

        if(creep.memory.role == 'pureFighter') {
            rolePureFighter.run(creep);
//            console.log('Step 17 : ' + Game.cpu.getUsed() +', creep ' + creep.name +  ', after setting fatharvester, before pureFighter')
        }

        if(creep.memory.role == 'longDistanceBuilder') {
            roleLongDistanceBuilder.run(creep);
//      console.log('Step 19 : ' + Game.cpu.getUsed() +', creep ' + creep.name +  ', after setting longDistanceHarvester, before longDistanceBuilder')

        }
        if(creep.memory.role == 'roomClaimer') {
            roleRoomClaimer.run(creep);

        //console.log('Step 20 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting longDistanceBuilder, before roomClaimer')
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);

        //console.log('Step 20 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting longDistanceBuilder, before roomClaimer')
        }
        if(creep.memory.role == 'roomReserver') {
            roleLongDistanceReserver.run(creep);

        //console.log('Step 20 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting longDistanceBuilder, before roomClaimer')
        }
        if(creep.memory.role == 'spreader') {
            roleSpreader.run(creep);

        //console.log('Step 20 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting longDistanceBuilder, before roomClaimer')
        }
        if(creep.memory.role == 'extractor') {
            roleExtractor.run(creep);

        //console.log('Step 20 : ' + Game.cpu.getUsed() + ', creep ' + creep.name + ', after setting longDistanceBuilder, before roomClaimer')
        }
        if(creep.memory.role == 'longDistanceFatHarvester') {
            roleLongDistanceFatHarvester.run(creep);
        }
        if(creep.memory.role == 'longDistanceFastMover') {
            roleLongDistanceFastMover.run(creep);
        }
        if(creep.memory.role == 'longDistanceSecurity') {
            roleLongDistanceSecurity.run(creep);
        }
        if(creep.memory.role == 'slacker'){
            roleSlacker.run(creep);
        }
        if(creep.memory.role == 'spreaderEfficient') {
            roleSpreaderEfficient.run(creep);
        }
        if(creep.memory.role == 'scout') {
            roleScout.run(creep);
        }
		


    }
	processLDPowerInfo.run();
    processLDEnergyInfo.run();
    // console.log('Step 21 : ' + Game.cpu.getUsed() + ', after setting ALL roles')
}
