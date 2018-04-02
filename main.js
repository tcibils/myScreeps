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
var senderLinkCloseToSource = require('info.senderLinkCloseToSource');
var processLDEnergyInfo = require('process.LDEnergyInfo');

/*
C:\Users\Thomas\AppData\Local\Screeps\scripts\screeps.com\autoEmpire1
Game.spawns['Spawn11'].spawnCreep([CLAIM,MOVE], 'Claimer' + Game.time,  {memory: {role: 'roomClaimer', targetRoom: 'W37N47', originRoom: 'W42N48'}});

*/

module.exports.loop = function () {

    console.log('------------')
    console.log('Starting - time ' + Game.time)
    console.log('-----------')


    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------- PARAMETERS DASHBOARD ------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------


    // Information display in console variables
    var showLongDistanceDashboard = false;
    var showRoomSpawn = true;
    var showRoomDashboard = true;
    var showRoomDashboardToDisplay = 'W46N51';
    var naturallyDeadTime = 100;


    // INPUT TABLES for long distance harvesting. Just add the room in the first table, and the number of sources in the second.
    // Long distance target rooms
    var longDistanceTargetRooms = ['W42N51','W44N51','W41N52','W44N52','W43N52','W43N49','W42N49','W43N48','W41N49','W41N48','W42N46','W42N44','W41N45','W43N45','W42N47','W45N51','W46N52','W47N52'];
    // Number of source to harvest in each room
    var longDistanceTargetRoomsSources = [1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,2,1,1];
    // Carrys needed for each room
    var longDistanceTargetRoomsCarryNeeded = [1,2,2,1,2,1,2,3,1,1,3,1,1,1,1,4,2,2];
    // If the harvesters should be able to defend themselves
    var longDistanceTargetRoomsAgressive = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    // Home rooms spawning creeps. If "null", then automatically computed.
    var longDistanceTargetRoomsHomeRooms = ['null','null','null','null','null','null','null','null','W42N48','null','null','null','null','null','null','null','null','null'];

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
    var longDistanceBuildRoomsBuilders = [3];

    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------




    // Cleaning up memeory
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
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
        // BUILDINGS
        // For each index, the ID the said buildings in the room, and their position for some of them
        myRooms[currentRoomIndex].memory.spawningPoints = [];
        myRooms[currentRoomIndex].memory.spawningPointsPos = [];

        myRooms[currentRoomIndex].memory.links = [];
        myRooms[currentRoomIndex].memory.storages = [];
        myRooms[currentRoomIndex].memory.towers = [];

        var spawningPointsOfRoom = myRooms[currentRoomIndex].find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_SPAWN}} );
        if(spawningPointsOfRoom.length > 0) {
            for(let currentSpawningPointIndex= 0; currentSpawningPointIndex<spawningPointsOfRoom.length; currentSpawningPointIndex++) {
                myRooms[currentRoomIndex].memory.spawningPoints.push(spawningPointsOfRoom[currentSpawningPointIndex].id);
                myRooms[currentRoomIndex].memory.spawningPointsPos.push(spawningPointsOfRoom[currentSpawningPointIndex].pos);
            }
        }

        var linksOfRoom = myRooms[currentRoomIndex].find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_LINK}} );
        if(linksOfRoom.length > 0) {
            for(let currentLinkIndex= 0; currentLinkIndex<linksOfRoom.length; currentLinkIndex++) {
                myRooms[currentRoomIndex].memory.links.push(linksOfRoom[currentLinkIndex].id);
            }
        }

        var storageOfRoom = myRooms[currentRoomIndex].find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_STORAGE}});
        if(storageOfRoom.length > 0) {
            for(let currentStorageIndex= 0; currentStorageIndex<storageOfRoom.length; currentStorageIndex++) {
                myRooms[currentRoomIndex].memory.storages.push(storageOfRoom[currentStorageIndex].id);
            }
        }

        // Sources will never move in the room
        if(myRooms[currentRoomIndex].memory.sources == undefined || myRooms[currentRoomIndex].memory.sourcesPos == undefined) {
            myRooms[currentRoomIndex].memory.sources = [];
            myRooms[currentRoomIndex].memory.sourcesPos = [];

            var sourcesOfRoom = myRooms[currentRoomIndex].find(FIND_SOURCES);
            if(sourcesOfRoom.length > 0) {
                for(let currentSourceIndex= 0; currentSourceIndex<sourcesOfRoom.length; currentSourceIndex++) {
                    myRooms[currentRoomIndex].memory.sources.push(sourcesOfRoom[currentSourceIndex].id);
                    myRooms[currentRoomIndex].memory.sourcesPos.push(sourcesOfRoom[currentSourceIndex].pos);
                }
            }
        }


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

        // Then we parse the links to check they are all categorized
        if(myRooms[currentRoomIndex].memory.senderLinks != null && myRooms[currentRoomIndex].memory.receiverLinks != null){
            for(let k=0; k<linksOfRoom.length; k++) {
                let linkCategorized = false;
                if(myRooms[currentRoomIndex].memory.senderLinks != undefined){
                    for(let h= 0; h<myRooms[currentRoomIndex].memory.senderLinks.length; h++) {
                        if(linksOfRoom[k].id == myRooms[currentRoomIndex].memory.senderLinks[h]) {
                            linkCategorized = true;
                        }
                    }
                }
                if(myRooms[currentRoomIndex].memory.receiverLinks != undefined ) {
                    for(let h=0; h<myRooms[currentRoomIndex].memory.receiverLinks.length; h++) {
                        if(linksOfRoom[k].id == myRooms[currentRoomIndex].memory.receiverLinks[h]) {
                            linkCategorized = true;
                        }
                    }
                }

                // And if they are not, then we attach them to either range, using closeness to sources and storages
                if(!linkCategorized) {
//                    if(links[k].pos.getRangeTo(links[k].pos.findClosestByRange(FIND_SOURCES)) <= 3) {
//
//                    }

                    if(linksOfRoom[k].pos.getRangeTo(linksOfRoom[k].pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_STORAGE}})) <= 2) {

                        myRooms[currentRoomIndex].memory.receiverLinks.push(linksOfRoom[k].id);

                    }
                    else {
                        myRooms[currentRoomIndex].memory.senderLinks.push(linksOfRoom[k].id);
                    }
                }

            }
        }


        var towersOfRoom = myRooms[currentRoomIndex].find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_TOWER}});
        if(towersOfRoom.length > 0) {
            for(let currentTowerIndex= 0; currentTowerIndex<towersOfRoom.length; currentTowerIndex++) {
                myRooms[currentRoomIndex].memory.towers.push(towersOfRoom[currentTowerIndex].id);
            }
        }


        // SOURCES


        // SpawningPrioritied

        myRooms[currentRoomIndex].memory.priorities = [];
        myRooms[currentRoomIndex].memory.priorities.push('harvester');
        myRooms[currentRoomIndex].memory.priorities.push('spreaderEfficient');
        myRooms[currentRoomIndex].memory.priorities.push('slacker');
        myRooms[currentRoomIndex].memory.priorities.push('fastMover');
        myRooms[currentRoomIndex].memory.priorities.push('fatHarvester');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceSecurity');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceFatHarvester');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceFastMover');
        myRooms[currentRoomIndex].memory.priorities.push('builder');
        myRooms[currentRoomIndex].memory.priorities.push('longDistanceBuilder');
        myRooms[currentRoomIndex].memory.priorities.push('repairer');
        myRooms[currentRoomIndex].memory.priorities.push('extractor');
        myRooms[currentRoomIndex].memory.priorities.push('upgrader');
        myRooms[currentRoomIndex].memory.priorities.push('scout');


        // CREEPS

        myRooms[currentRoomIndex].memory.labels = [];
        myRooms[currentRoomIndex].memory.need = [];
        myRooms[currentRoomIndex].memory.attached = [];
        myRooms[currentRoomIndex].memory.role = [];
        myRooms[currentRoomIndex].memory.unity = [];
        myRooms[currentRoomIndex].memory.targetRoom = [];
        myRooms[currentRoomIndex].memory.needOrigin = [];
        myRooms[currentRoomIndex].memory.criticalNeed = [];


        // Looping on sources
        if(myRooms[currentRoomIndex].memory.sources.length > 0) {
            for(let currentSourceIndex = 0; currentSourceIndex < myRooms[currentRoomIndex].memory.sources.length; currentSourceIndex++) {
                // Store source id

                // WORK

                myRooms[currentRoomIndex].memory.labels.push('Work source ' + myRooms[currentRoomIndex].memory.sources[currentSourceIndex] )
                myRooms[currentRoomIndex].memory.role.push('fatHarvester')
                myRooms[currentRoomIndex].memory.unity.push('Work body parts')
                myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
                myRooms[currentRoomIndex].memory.needOrigin.push(myRooms[currentRoomIndex].memory.sources[currentSourceIndex]);
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);

                // Work parts needed is stocked (time it takes to get refilled, divided by 2 because each work body part takes 2 per turn)
                let workPartsNeeded = (Math.ceil(Game.getObjectById(myRooms[currentRoomIndex].memory.sources[currentSourceIndex]).energyCapacity / 300) / 2);
                myRooms[currentRoomIndex].memory.need.push(workPartsNeeded);

                // Work parts attached is computed and stocked
                var fatHarvestersOfSource = _.filter(Game.creeps, (creep) => (creep.memory.role == 'fatHarvester' && creep.memory.homeRoom == myRooms[currentRoomIndex].name && creep.memory.needOrigin == myRooms[currentRoomIndex].memory.sources[currentSourceIndex]));


                var counterOfCurrentWorkBodyParts = 0;
                for(var i = 0; i<fatHarvestersOfSource.length; i++) {
                    if(fatHarvestersOfSource[i].ticksToLive >= naturallyDeadTime || fatHarvestersOfSource[i].memory.creepSpawning) {
                        counterOfCurrentWorkBodyParts += fatHarvestersOfSource[i].getActiveBodyparts(WORK);
                    }
                }
                // Work parts currently attached
                myRooms[currentRoomIndex].memory.attached.push(counterOfCurrentWorkBodyParts);



                // CARRY

                myRooms[currentRoomIndex].memory.labels.push('Carry source ' + myRooms[currentRoomIndex].memory.sources[currentSourceIndex] )
                myRooms[currentRoomIndex].memory.role.push('fastMover')
                myRooms[currentRoomIndex].memory.unity.push('Carry body parts')
                myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
                myRooms[currentRoomIndex].memory.needOrigin.push(myRooms[currentRoomIndex].memory.sources[currentSourceIndex]);
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);

                // If there is no fat harvester, then we do not need to carry energy
                if(counterOfCurrentWorkBodyParts == 0) {
                    myRooms[currentRoomIndex].memory.need.push(0);
                }
                // If there is one, then we need to carry the energy
                else if(counterOfCurrentWorkBodyParts > 0) {

                    // First we check if we have a receiver link
                    let receiverLinkExists = false;
                    if(myRooms[currentRoomIndex].controller.level >= 5) {
                        if(myRooms[currentRoomIndex].memory.receiverLinks != undefined) {
                            if(myRooms[currentRoomIndex].memory.receiverLinks.length > 0) {
                                receiverLinkExists = true;
                            }
                        }
                    }

                    // If there is a link close to the source and a receiver link, then carry parts are not needed for this source.
                    if(senderLinkCloseToSource.run(Game.getObjectById(myRooms[currentRoomIndex].memory.sources[currentSourceIndex])) && receiverLinkExists) {
                        myRooms[currentRoomIndex].memory.need.push(0);
                    }

                    // If there's one of them missing, then we still need to spawn fast creeps
                    if(!senderLinkCloseToSource.run(Game.getObjectById(myRooms[currentRoomIndex].memory.sources[currentSourceIndex])) || !receiverLinkExists) {
                        if(myRooms[currentRoomIndex].memory.spawningPoints.length > 0) {
                            // On détermine de combien de transporteurs on va avoir besoin
                            var distanceSourceSpawn = myRooms[currentRoomIndex].findPath(Game.getObjectById(myRooms[currentRoomIndex].memory.sources[currentSourceIndex]).pos,Game.getObjectById(myRooms[currentRoomIndex].memory.spawningPoints[0]).pos, {ignoreCreeps:true}).length;
                        }
                        // 1 body part "work" mine 2 énergie/tick, +1 for legit reasons, +1 for rounding - c'est très estimatif
                        var totalCarryPartsNeeded = Math.floor(((distanceSourceSpawn * 2.5) * (Math.floor(Game.getObjectById(myRooms[currentRoomIndex].memory.sources[currentSourceIndex]).energyCapacity / 300))) / 50) + 1 + 4;

                        myRooms[currentRoomIndex].memory.need.push(totalCarryPartsNeeded);
                    }

                }


                var fastMoversOfSource = _.filter(Game.creeps, (creep) => (creep.memory.role == 'fastMover' && creep.memory.homeRoom == myRooms[currentRoomIndex].name && creep.memory.needOrigin == myRooms[currentRoomIndex].memory.sources[currentSourceIndex]));

                let counterOfCurrentCarryBodyParts = 0;
                if(fastMoversOfSource.length > 0) {
                    for(let fastMoverIndex = 0; fastMoverIndex < fastMoversOfSource.length; fastMoverIndex++) {
                        if(fastMoversOfSource[fastMoverIndex].ticksToLive > naturallyDeadTime || fastMoversOfSource[fastMoverIndex].memory.creepSpawning) {
                            counterOfCurrentCarryBodyParts += fastMoversOfSource[fastMoverIndex].getActiveBodyparts(CARRY);
                        }

                    }
                }
                myRooms[currentRoomIndex].memory.attached.push(counterOfCurrentCarryBodyParts);

            }
        }


        // LINK-RELATED

        if(myRooms[currentRoomIndex].memory.links.length > 0) {
            // Looping on receivers links for SLACKER
            for(let currentLinkIndex = 0; currentLinkIndex < myRooms[currentRoomIndex].memory.receiverLinks.length; currentLinkIndex++) {

                myRooms[currentRoomIndex].memory.labels.push('Slacker for link ' + myRooms[currentRoomIndex].memory.receiverLinks[currentLinkIndex])
                myRooms[currentRoomIndex].memory.role.push('slacker')
                myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
                myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
                myRooms[currentRoomIndex].memory.needOrigin.push(myRooms[currentRoomIndex].memory.receiverLinks[currentLinkIndex]);
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);

                // SLAKER needed : 1 for each receiver, if we have a sender somewhere
                if(myRooms[currentRoomIndex].memory.senderLinks != undefined) {
                    if(myRooms[currentRoomIndex].memory.senderLinks.length == 0 || myRooms[currentRoomIndex].controller.level < 5) {
                        myRooms[currentRoomIndex].memory.need.push(0);
                    }
                }

                if(myRooms[currentRoomIndex].memory.senderLinks.length > 0 && myRooms[currentRoomIndex].controller.level >= 5) {
                    myRooms[currentRoomIndex].memory.need.push(1);
                }

                // SLAKER attached : the slackers of the room, having the receiver link attached, and not being too close to death
                var slackersOfLink = _.filter(Game.creeps, (creep) => (creep.memory.role == 'slacker' && creep.memory.homeRoom == myRooms[currentRoomIndex].name && creep.memory.linkAttached == myRooms[currentRoomIndex].memory.receiverLinks[currentLinkIndex]));


                var counterOfSlackerForReceiverLink = 0;
                for(let i = 0; i<slackersOfLink.length; i++) {
                    if(slackersOfLink[i].ticksToLive > naturallyDeadTime || slackersOfLink[i].memory.creepSpawning) {
                        counterOfSlackerForReceiverLink++;
                    }
                }

                myRooms[currentRoomIndex].memory.attached.push(counterOfSlackerForReceiverLink);
            }
        }

        if(myRooms[currentRoomIndex].memory.storages.length > 0) {
            // Looping on deposits for SPREADERS
            for(let currentStorageIndex = 0; currentStorageIndex < myRooms[currentRoomIndex].memory.storages.length; currentStorageIndex++) {

                myRooms[currentRoomIndex].memory.labels.push('Spreader for storage ' + myRooms[currentRoomIndex].memory.storages[currentStorageIndex])
                myRooms[currentRoomIndex].memory.role.push('spreaderEfficient')
                myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
                myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
                myRooms[currentRoomIndex].memory.needOrigin.push(myRooms[currentRoomIndex].memory.storages[currentStorageIndex]);


                // Need a spreader efficient as long as we have a storage
                if(myRooms[currentRoomIndex].name == 'W43N51') {
                    myRooms[currentRoomIndex].memory.need.push(2);
                }
                else if(myRooms[currentRoomIndex].name == 'W42N48') {
                    myRooms[currentRoomIndex].memory.need.push(3);
                }
                else {
                    myRooms[currentRoomIndex].memory.need.push(1);
                }
                // Counting attached creeps
                var spreadersEfficientsOfStorage = _.filter(Game.creeps, (creep) => (creep.memory.role == 'spreaderEfficient' && creep.memory.homeRoom == myRooms[currentRoomIndex].name && creep.memory.storageAttached == myRooms[currentRoomIndex].memory.storages[currentStorageIndex]));


                var counterOfAliveSpreadersOfStorage = 0;
                var counterOfSpreadersOfStorage = 0;
                if(spreadersEfficientsOfStorage.length > 0) {
                    for(let i = 0; i<spreadersEfficientsOfStorage.length; i++) {
                        if(spreadersEfficientsOfStorage[i].ticksToLive > naturallyDeadTime || spreadersEfficientsOfStorage[i].memory.creepSpawning) {
                            counterOfAliveSpreadersOfStorage++;
                        }
                        counterOfSpreadersOfStorage++;
                    }
                }

                myRooms[currentRoomIndex].memory.attached.push(counterOfAliveSpreadersOfStorage);

                if(counterOfSpreadersOfStorage == 0) {
                    myRooms[currentRoomIndex].memory.criticalNeed.push(true);
                }
                else {
                    myRooms[currentRoomIndex].memory.criticalNeed.push(false);
                }

            }
        }


        // BUILDING-RELATED

        myRooms[currentRoomIndex].memory.labels.push('Builders')
        myRooms[currentRoomIndex].memory.role.push('builder')
        myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);

        myRooms[currentRoomIndex].memory.labels.push('Repairers')
        myRooms[currentRoomIndex].memory.role.push('repairer')
        myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);


        var realConstructionSites = myRooms[currentRoomIndex].find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_ROAD});
        var totalConstructionNeeded = 0;
        for(let a = 0; a <realConstructionSites.length; a++) {
            totalConstructionNeeded += (realConstructionSites[a].progressTotal - realConstructionSites[a].progress);
        }

        // Builders needed

        if(totalConstructionNeeded == 0) {
            myRooms[currentRoomIndex].memory.need.push(0);
        }
        else if(totalConstructionNeeded > 0 && totalConstructionNeeded <= 1000) {
            myRooms[currentRoomIndex].memory.need.push(1);
        }
        else if(totalConstructionNeeded > 1000 && totalConstructionNeeded <= 15000) {
            myRooms[currentRoomIndex].memory.need.push(2);
        }
        else if(totalConstructionNeeded > 15000 && totalConstructionNeeded <= 30000) {
            myRooms[currentRoomIndex].memory.need.push(3);
        }
        else if(totalConstructionNeeded > 30000) {
            myRooms[currentRoomIndex].memory.need.push(4);
        }

        // Builders attached

        myRooms[currentRoomIndex].memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'builder' && creep.memory.homeRoom == myRooms[currentRoomIndex].name)).length);


        // Repairer needed

        myRooms[currentRoomIndex].memory.need.push(1);

        // Repairer attached

        myRooms[currentRoomIndex].memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'repairer' && creep.memory.homeRoom == myRooms[currentRoomIndex].name)).length);


        // MINERAL RELATED

        myRooms[currentRoomIndex].memory.labels.push('Extractors')
        myRooms[currentRoomIndex].memory.role.push('extractor')
        myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);


        // TO BE IMPROVED : take into account the mineral amount available
        if(myRooms[currentRoomIndex].terminal != undefined) {
            myRooms[currentRoomIndex].memory.need.push(1);
        }
        else {
            myRooms[currentRoomIndex].memory.need.push(0);
        }

        myRooms[currentRoomIndex].memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'extractor' && creep.memory.homeRoom == myRooms[currentRoomIndex].name)).length);

        // UPAGREDERS


        myRooms[currentRoomIndex].memory.labels.push('Upgraders')
        myRooms[currentRoomIndex].memory.role.push('upgrader')
        myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);

        // à améliorer : upgrader "lite" ?
        if(myRooms[currentRoomIndex].controller.level == 8) {
            myRooms[currentRoomIndex].memory.need.push(1);
        }

        // This variable is the energy the upgrader creep is supposed to consume during its life
        let baseUnitUpgradersNeed = 40000;

        // Max harvesters in order not to clog the room
        let maxUpgraders = 4;

        if(myRooms[currentRoomIndex].controller.level < 8) {
            // If we have a storage
            if(myRooms[currentRoomIndex].memory.storages.length > 0) {
                // But not enough energy in it
                if(Game.getObjectById(myRooms[currentRoomIndex].memory.storages[0]).store[RESOURCE_ENERGY] < baseUnitUpgradersNeed) {
                    // We do not create upgraders
                    myRooms[currentRoomIndex].memory.need.push(0);
                }

                else if (Game.getObjectById(myRooms[currentRoomIndex].memory.storages[0]).store[RESOURCE_ENERGY] > baseUnitUpgradersNeed * maxUpgraders) {
                    myRooms[currentRoomIndex].memory.need.push(maxUpgraders);
                }

                else {
                    // If we have enough energy, we check how much we could sustain
                    let maximumReached = false;
                    for(let maxFactor = 1; maxFactor < maxUpgraders && !maximumReached; maxFactor++) {
                        if(Game.getObjectById(myRooms[currentRoomIndex].memory.storages[0]).store[RESOURCE_ENERGY] > (baseUnitUpgradersNeed * maxFactor) && Game.getObjectById(myRooms[currentRoomIndex].memory.storages[0]).store[RESOURCE_ENERGY] <= (baseUnitUpgradersNeed * (maxFactor+1))) {
                            myRooms[currentRoomIndex].memory.need.push(maxFactor);
                        }
                    }
                }
            }
            // If we have no storage, we still need upgraders ! The room is just low level.
            else {
                let builderNeededOfRoom = 0;
                let maxSpaceAroundContainer = 4;
                for(let findBuilderIndex = 0; findBuilderIndex < myRooms[currentRoomIndex].memory.need.length; findBuilderIndex++) {
                    if(myRooms[currentRoomIndex].memory.role[findBuilderIndex] == 'builder') {
                        builderNeededOfRoom = myRooms[currentRoomIndex].memory.need[findBuilderIndex];
                    }
                }
                // We need 1 spot free around container for fast movers to acess it
                let result = maxSpaceAroundContainer - 1 - builderNeededOfRoom;
                if(result >= 0) {
                    myRooms[currentRoomIndex].memory.need.push(result);
                }
                else {
                    myRooms[currentRoomIndex].memory.need.push(0);
                }
            }
        }

        myRooms[currentRoomIndex].memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' && creep.memory.homeRoom == myRooms[currentRoomIndex].name)).length);


        // SCOUT

        myRooms[currentRoomIndex].memory.labels.push('scout');
        myRooms[currentRoomIndex].memory.role.push('scout');
        myRooms[currentRoomIndex].memory.unity.push('Number of creeps');
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined');
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined');
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);
        myRooms[currentRoomIndex].memory.need.push(1);
        myRooms[currentRoomIndex].memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'scout' && creep.memory.homeRoom == myRooms[currentRoomIndex].name)).length);


        // CATASTROPHE

        myRooms[currentRoomIndex].memory.labels.push('AdHoc Harvesters')
        myRooms[currentRoomIndex].memory.role.push('harvester')
        myRooms[currentRoomIndex].memory.unity.push('Number of creeps')
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);


        var harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' && creep.memory.homeRoom == myRooms[currentRoomIndex].name));
        myRooms[currentRoomIndex].memory.attached.push(harvesters.length);

        let counterTotalWorkNeeded = 0;
        let counterTotalWorkAttached = 0;
        let counterTotalCarryNeeded = 0;
        let counterTotalCarryAttached = 0;
        let counterTotalSpreadNeeded = 0;
        let counterTotalSpreadAttached = 0;

        for(let a = 0; a < myRooms[currentRoomIndex].memory.labels.length; a++) {

            if(myRooms[currentRoomIndex].memory.role[a] == 'fatHarvester') {
                counterTotalWorkNeeded += myRooms[currentRoomIndex].memory.need[a];
                counterTotalWorkAttached += myRooms[currentRoomIndex].memory.attached[a];
            }

            if(myRooms[currentRoomIndex].memory.role[a] == 'fastMover') {
                counterTotalCarryNeeded += myRooms[currentRoomIndex].memory.need[a];
                counterTotalCarryAttached += myRooms[currentRoomIndex].memory.attached[a];
            }

            if(myRooms[currentRoomIndex].memory.role[a] == 'spreader') {
                counterTotalSpreadNeeded += myRooms[currentRoomIndex].memory.need[a];
                counterTotalSpreadAttached += myRooms[currentRoomIndex].memory.attached[a];
            }

        }


        // console.log('spreaders A ' + myRooms[currentRoomIndex].memory.storageSpreaderAttached[0])
        if(counterTotalWorkAttached < (counterTotalWorkNeeded / 3) || counterTotalCarryAttached < (counterTotalCarryNeeded / 3) || counterTotalSpreadNeeded > counterTotalSpreadAttached) {
            myRooms[currentRoomIndex].memory.need.push(2);
        }
        else {
            myRooms[currentRoomIndex].memory.need.push(0);
        }



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
    // -------------------------------------- LONG DISTANCE HARVESTING ---------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------



    // Automatically filled tables for long distance harvesting.
    var longDistanceTargetRoomsFattysAttached = [];
    var longDistanceTargetRoomsCarryAttached = [];
    var longDistanceTargetRoomsSecurityNeeded = [];
    var longDistanceTargetRoomsSecurityAttached = [];

    var longDistancePillageRoomsHomeRooms = [];
    var longDistancePillageRoomsWarriorAttached = [];
    var longDistancePillageRoomsCarryAttached = [];

    // Long distance table filling
    for(let i = 0; i<longDistanceTargetRooms.length; i++) {
        if(longDistanceTargetRoomsHomeRooms[i] == 'null')
        {
            // Push on the home rooms
            let closestRoomDistance = 1000;
            let closestRoom = null;
            for(let j = 0; j<myRooms.length; j++) {
                let currentDistance = Game.map.findRoute(myRooms[j].name, longDistanceTargetRooms[i]).length;
                if(currentDistance < closestRoomDistance && currentDistance <=3 && myRooms[j].energyCapacityAvailable > 1000 && myRooms[j].find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE)}}).length > 0) {
                    closestRoomDistance = currentDistance;
                    closestRoom = myRooms[j].name;
                }
            }
            longDistanceTargetRoomsHomeRooms[i] = closestRoom;
        }
        // Push on carry needed
        // longDistanceTargetRoomsCarryNeeded.push(2*closestRoomDistance*longDistanceTargetRoomsSources[i] -1);

        // Push on the fattys attached
        longDistanceTargetRoomsFattysAttached.push(_.filter(Game.creeps, (creep) =>
            creep.memory.role == 'longDistanceFatHarvester' &&
            creep.memory.targetRoom == longDistanceTargetRooms[i] &&
            (creep.ticksToLive > 150 || creep.memory.creepSpawning)
        ).length);

        // Push on the carry attached
        longDistanceTargetRoomsCarryAttached.push(_.filter(Game.creeps, (creep) =>
            creep.memory.role == 'longDistanceFastMover' &&
            creep.memory.targetRoom == longDistanceTargetRooms[i] &&
            (creep.ticksToLive > 150 || creep.memory.creepSpawning)
        ).length);

        if(_.filter(Game.creeps, (creep) => creep.memory.underAttackRoom == longDistanceTargetRooms[i] && creep.memory.underAttack == true && creep.getActiveBodyparts(MOVE) > 0).length > 0) {
            longDistanceTargetRoomsSecurityNeeded.push(1);
        }
        else if(_.filter(Game.creeps, (creep) => creep.memory.underAttackRoom == longDistanceTargetRooms[i] && creep.memory.underAttack == true  && creep.getActiveBodyparts(MOVE) > 0).length == 0) {
            longDistanceTargetRoomsSecurityNeeded.push(0);
        }

        longDistanceTargetRoomsSecurityAttached.push(_.filter(Game.creeps, (creep) =>
            creep.memory.role == 'longDistanceSecurity' &&
            creep.memory.targetRoom == longDistanceTargetRooms[i] &&
            (creep.ticksToLive > 50 || creep.memory.creepSpawning)
        ).length);

    }


    // Linking info with room needs

    // For each room,
    for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
        // And for each long distance target room,
        for(let currentLongDistanceRoomIndex = 0; currentLongDistanceRoomIndex < longDistanceTargetRoomsHomeRooms.length; currentLongDistanceRoomIndex++) {
            // If the current room is the same as the home room of the LDTRoom
            if(myRoomsNames[currentRoomIndex] == longDistanceTargetRoomsHomeRooms[currentLongDistanceRoomIndex]) {
                // We first push the need for LDFHarvesters
                myRooms[currentRoomIndex].memory.labels.push('LDFH target room ' + longDistanceTargetRooms[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.need.push(longDistanceTargetRoomsSources[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.attached.push(longDistanceTargetRoomsFattysAttached[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.role.push('longDistanceFatHarvester');
                myRooms[currentRoomIndex].memory.unity.push('Number of creeps');
                myRooms[currentRoomIndex].memory.targetRoom.push(longDistanceTargetRooms[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);

                // Then we push the need for the carrys
                myRooms[currentRoomIndex].memory.labels.push('LDFM target room ' + longDistanceTargetRooms[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.need.push(longDistanceTargetRoomsCarryNeeded[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.attached.push(longDistanceTargetRoomsCarryAttached[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.role.push('longDistanceFastMover');
                myRooms[currentRoomIndex].memory.unity.push('Number of creeps');
                myRooms[currentRoomIndex].memory.targetRoom.push(longDistanceTargetRooms[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);

                // And finaly the security
                myRooms[currentRoomIndex].memory.labels.push('LDS target room ' + longDistanceTargetRooms[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.need.push(longDistanceTargetRoomsSecurityNeeded[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.attached.push(longDistanceTargetRoomsSecurityAttached[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.role.push('longDistanceSecurity');
                myRooms[currentRoomIndex].memory.unity.push('Number of creeps');
                myRooms[currentRoomIndex].memory.targetRoom.push(longDistanceTargetRooms[currentLongDistanceRoomIndex]);
                myRooms[currentRoomIndex].memory.needOrigin.push('undefined')
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);
            }
        }

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
                myRooms[currentRoomIndex].memory.criticalNeed.push(false);

            }
        }

    }



    //-------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------- DISPLAYS OF INFORMATION ----------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------


    if(showLongDistanceDashboard) {
        console.log('Long Distance Harvesting Dashboard :')
        console.log('Room targets : ' + longDistanceTargetRooms)
        console.log('Homes        : ' + longDistanceTargetRoomsHomeRooms)
        console.log('Sources      : ' + longDistanceTargetRoomsSources)
        console.log('Fatty atta   : ' + longDistanceTargetRoomsFattysAttached)
        console.log('Carrys need  : ' + longDistanceTargetRoomsCarryNeeded)
        console.log('Carrys atta  : ' + longDistanceTargetRoomsCarryAttached)
        console.log('Security need: ' + longDistanceTargetRoomsSecurityNeeded)
        console.log('Security atta: ' + longDistanceTargetRoomsSecurityAttached)
    }

    if(showRoomDashboard) {
        for(let currentRoomIndex = 0; currentRoomIndex < myRooms.length; currentRoomIndex++) {
            if(myRoomsNames[currentRoomIndex] == showRoomDashboardToDisplay) {
                console.log('ROOM ' + myRoomsNames[currentRoomIndex] + ' MANAGEMENT DASHBOARD')
                console.log('----- Global -----')
                console.log('Under attack : ' + myRooms[currentRoomIndex].memory.underAttack)
                console.log('Towers       : ' + myRooms[currentRoomIndex].memory.towers)
                console.log('Spawning     : ' + myRooms[currentRoomIndex].memory.spawningPoints)
                console.log('Sources      : ' + myRooms[currentRoomIndex].memory.sources)
                console.log('Send. Links  : ' + myRooms[currentRoomIndex].memory.senderLinks)
                console.log('Reciev. Links: ' + myRooms[currentRoomIndex].memory.receiverLinks)
                console.log('Storages     : ' + myRooms[currentRoomIndex].memory.storages)
                console.log('----- Creeps -----')
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
                                    for(let j=0; j< Math.floor((capacityToBeUsed) /150) && j<5; j++) {
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
                                    creepBody.push(MOVE);
                                    creepBody.push(MOVE);
                                    creepBody.push(MOVE);
                                    creepBody.push(CARRY);
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                    creepBody.push(WORK);
                                }
								
								if(myRooms[currentRoomIndex].memory.role[needIndex] == 'roomReserver') {
									for(let j = 0; j< Math.floor((capacityToBeUsed) / 650) && j < 13; j++) {
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
    processLDEnergyInfo.run();
    // console.log('Step 21 : ' + Game.cpu.getUsed() + ', after setting ALL roles')
}
