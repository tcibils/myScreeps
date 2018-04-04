var setNeedCreepsEnergyHarvestingOfRoom = {
    run: function(treatedRoom) {
		// Looping on sources
        if(treatedRoom.memory.sources.length > 0) {
            for(let currentSourceIndex = 0; currentSourceIndex < .memory.sources.length; currentSourceIndex++) {
                // Store source id

                // WORK

                treatedRoom.memory.labels.push('Work source ' + treatedRoom.memory.sources[currentSourceIndex] )
                treatedRoom.memory.role.push('fatHarvester')
                treatedRoom.memory.unity.push('Work body parts')
                treatedRoom.memory.targetRoom.push('undefined')
                treatedRoom.memory.needOrigin.push(treatedRoom.memory.sources[currentSourceIndex]);
                treatedRoom.memory.needOriginPos.push(treatedRoom.memory.sources[currentSourceIndex].pos);
                treatedRoom.memory.criticalNeed.push(false);

                // Work parts needed is stocked (time it takes to get refilled, divided by 2 because each work body part takes 2 per turn)
                let workPartsNeeded = (Math.ceil(Game.getObjectById(treatedRoom.memory.sources[currentSourceIndex]).energyCapacity / 300) / 2);
                treatedRoom.memory.need.push(workPartsNeeded);

                // Work parts attached is computed and stocked
                var fatHarvestersOfSource = _.filter(Game.creeps, (creep) => (creep.memory.role == 'fatHarvester' && creep.memory.homeRoom == treatedRoom.name && creep.memory.needOrigin == treatedRoom.memory.sources[currentSourceIndex]));


                var counterOfCurrentWorkBodyParts = 0;
                for(var i = 0; i<fatHarvestersOfSource.length; i++) {
                    if(fatHarvestersOfSource[i].ticksToLive >= naturallyDeadTime || fatHarvestersOfSource[i].memory.creepSpawning) {
                        counterOfCurrentWorkBodyParts += fatHarvestersOfSource[i].getActiveBodyparts(WORK);
                    }
                }
                // Work parts currently attached
                treatedRoom.memory.attached.push(counterOfCurrentWorkBodyParts);



                // CARRY

                treatedRoom.memory.labels.push('Carry source ' + treatedRoom.memory.sources[currentSourceIndex] )
                treatedRoom.memory.role.push('fastMover')
                treatedRoom.memory.unity.push('Carry body parts')
                treatedRoom.memory.targetRoom.push('undefined')
                treatedRoom.memory.needOrigin.push(treatedRoom.memory.sources[currentSourceIndex]);
                treatedRoom.memory.needOriginPos.push(treatedRoom.memory.sources[currentSourceIndex].pos);
                treatedRoom.memory.criticalNeed.push(false);

                // If there is no fat harvester, then we do not need to carry energy
                if(counterOfCurrentWorkBodyParts == 0) {
                    treatedRoom.memory.need.push(0);
                }
                // If there is one, then we need to carry the energy
                else if(counterOfCurrentWorkBodyParts > 0) {

                    // First we check if we have a receiver link
                    let receiverLinkExists = false;
                    if(treatedRoom.controller.level >= 5) {
                        if(treatedRoom.memory.receiverLinks != undefined) {
                            if(treatedRoom.memory.receiverLinks.length > 0) {
                                receiverLinkExists = true;
                            }
                        }
                    }

                    // If there is a link close to the source and a receiver link, then carry parts are not needed for this source.
                    if(senderLinkCloseToSource.run(Game.getObjectById(treatedRoom.memory.sources[currentSourceIndex])) && receiverLinkExists) {
                        treatedRoom.memory.need.push(0);
                    }

                    // If there's one of them missing, then we still need to spawn fast creeps
                    if(!senderLinkCloseToSource.run(Game.getObjectById(treatedRoom.memory.sources[currentSourceIndex])) || !receiverLinkExists) {
                        if(treatedRoom.memory.spawningPoints.length > 0) {
                            // On détermine de combien de transporteurs on va avoir besoin
                            var distanceSourceSpawn = treatedRoom.findPath(Game.getObjectById(treatedRoom.memory.sources[currentSourceIndex]).pos,Game.getObjectById(treatedRoom.memory.spawningPoints[0]).pos, {ignoreCreeps:true}).length;
                        }
                        // 1 body part "work" mine 2 énergie/tick, +1 for legit reasons, +1 for rounding - c'est très estimatif
                        var totalCarryPartsNeeded = Math.floor(((distanceSourceSpawn * 2.5) * (Math.floor(Game.getObjectById(treatedRoom.memory.sources[currentSourceIndex]).energyCapacity / 300))) / 50) + 1 + 4;

                        treatedRoom.memory.need.push(totalCarryPartsNeeded);
                    }

                }


                var fastMoversOfSource = _.filter(Game.creeps, (creep) => (creep.memory.role == 'fastMover' && creep.memory.homeRoom == treatedRoom.name && creep.memory.needOrigin == treatedRoom.memory.sources[currentSourceIndex]));

                let counterOfCurrentCarryBodyParts = 0;
                if(fastMoversOfSource.length > 0) {
                    for(let fastMoverIndex = 0; fastMoverIndex < fastMoversOfSource.length; fastMoverIndex++) {
                        if(fastMoversOfSource[fastMoverIndex].ticksToLive > naturallyDeadTime || fastMoversOfSource[fastMoverIndex].memory.creepSpawning) {
                            counterOfCurrentCarryBodyParts += fastMoversOfSource[fastMoverIndex].getActiveBodyparts(CARRY);
                        }

                    }
                }
                treatedRoom.memory.attached.push(counterOfCurrentCarryBodyParts);

            }
        }
		
    }
}

module.exports = setNeedCreepsEnergyHarvestingOfRoom;
