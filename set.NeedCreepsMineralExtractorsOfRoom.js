var setNeedCreepsMineralExtractorsOfRoom = {
    run: function(treatedRoom) {
		// MINERAL RELATED

        treatedRoom.memory.labels.push('Extractors')
        treatedRoom.memory.role.push('extractor')
        treatedRoom.memory.unity.push('Number of creeps')
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined')
        treatedRoom.memory.needOriginPos.push('undefined')
        treatedRoom.memory.criticalNeed.push(false);


        // TO BE IMPROVED : take into account the mineral amount available
        if(treatedRoom.terminal != undefined) {
            treatedRoom.memory.need.push(1);
        }
        else {
            treatedRoom.memory.need.push(0);
        }

        treatedRoom.memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'extractor' && creep.memory.homeRoom == treatedRoom.name)).length);

		
    }
}

module.exports = setNeedCreepsMineralExtractorsOfRoom;
