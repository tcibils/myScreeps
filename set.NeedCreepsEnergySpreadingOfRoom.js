var setNeedCreepsEnergySpreadingOfRoom = {
    run: function(treatedRoom) {
		let naturallyDeadTime = 100;
		 // LINK-RELATED

        if(treatedRoom.memory.links.length > 0) {
            // Looping on receivers links for SLACKER
            for(let currentLinkIndex = 0; currentLinkIndex < treatedRoom.memory.receiverLinks.length; currentLinkIndex++) {

                treatedRoom.memory.labels.push('Slacker for link ' + treatedRoom.memory.receiverLinks[currentLinkIndex])
                treatedRoom.memory.role.push('slacker')
                treatedRoom.memory.unity.push('Number of creeps')
                treatedRoom.memory.targetRoom.push('undefined')
                treatedRoom.memory.needOrigin.push(treatedRoom.memory.receiverLinks[currentLinkIndex]);
                treatedRoom.memory.needOriginPos.push(Game.getObjectById(treatedRoom.memory.receiverLinks[currentLinkIndex]).pos);
                treatedRoom.memory.criticalNeed.push(false);

                // SLAKER needed : 1 for each receiver, if we have a sender somewhere
                if(treatedRoom.memory.senderLinks != undefined) {
                    if(treatedRoom.memory.senderLinks.length == 0 || treatedRoom.controller.level < 5) {
                        treatedRoom.memory.need.push(0);
                    }
                }

                if(treatedRoom.memory.senderLinks.length > 0 && treatedRoom.controller.level >= 5) {
                    treatedRoom.memory.need.push(1);
                }

                // SLAKER attached : the slackers of the room, having the receiver link attached, and not being too close to death
                var slackersOfLink = _.filter(Game.creeps, (creep) => (creep.memory.role == 'slacker' && creep.memory.homeRoom == treatedRoom.name && creep.memory.linkAttached == treatedRoom.memory.receiverLinks[currentLinkIndex]));


                var counterOfSlackerForReceiverLink = 0;
                for(let i = 0; i<slackersOfLink.length; i++) {
                    if(slackersOfLink[i].ticksToLive > naturallyDeadTime || slackersOfLink[i].memory.creepSpawning) {
                        counterOfSlackerForReceiverLink++;
                    }
                }

                treatedRoom.memory.attached.push(counterOfSlackerForReceiverLink);
            }
        }

        if(treatedRoom.memory.storages.length > 0) {
            // Looping on deposits for SPREADERS
            for(let currentStorageIndex = 0; currentStorageIndex < treatedRoom.memory.storages.length; currentStorageIndex++) {

                treatedRoom.memory.labels.push('Spreader for storage ' + treatedRoom.memory.storages[currentStorageIndex])
                treatedRoom.memory.role.push('spreaderEfficient')
                treatedRoom.memory.unity.push('Number of creeps')
                treatedRoom.memory.targetRoom.push('undefined')
                treatedRoom.memory.needOrigin.push(treatedRoom.memory.storages[currentStorageIndex]);
                treatedRoom.memory.needOriginPos.push(Game.getObjectById(treatedRoom.memory.storages[currentStorageIndex]).pos);


                // Need a spreader efficient as long as we have a storage

                if(Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_ENERGY] > STORAGE_CAPACITY * 0.90) {
                    treatedRoom.memory.need.push(3);
                }
                else if(treatedRoom.controller.level >= 8) {
                    treatedRoom.memory.need.push(2);
                }
				else {
					treatedRoom.memory.need.push(1);
				}
                // Counting attached creeps
                var spreadersEfficientsOfStorage = _.filter(Game.creeps, (creep) => (creep.memory.role == 'spreaderEfficient' && creep.memory.homeRoom == treatedRoom.name && creep.memory.storageAttached == treatedRoom.memory.storages[currentStorageIndex]));


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

                treatedRoom.memory.attached.push(counterOfAliveSpreadersOfStorage);

                if(counterOfSpreadersOfStorage == 0) {
                    treatedRoom.memory.criticalNeed.push(true);
                }
                else {
                    treatedRoom.memory.criticalNeed.push(false);
                }

            }
        }
    }
}

module.exports = setNeedCreepsEnergySpreadingOfRoom;
