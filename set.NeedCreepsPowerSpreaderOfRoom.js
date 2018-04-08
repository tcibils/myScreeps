var setNeedCreepsPowerSpreaderOfRoom = {
    run: function(treatedRoom) {
		
		treatedRoom.memory.labels.push('Power Spreader');
		
		if(Game.getObjectById(treatedRoom.memory.storages[0]) != undefined) {
			if(Game.getObjectById(treatedRoom.memory.storages[0]).store[RESOURCE_POWER] > 0) {
				treatedRoom.memory.need.push(1);
			}
			else {
				treatedRoom.memory.need.push(0);
			}
		}
		else {
			treatedRoom.memory.need.push(0);
		}
		
        var spreadersPowerExisting = _.filter(Game.creeps, (creep) => (creep.memory.role == 'spreaderPower' && creep.memory.homeRoom == treatedRoom.name));
        treatedRoom.memory.attached.push(spreadersPowerExisting.length);
		
        treatedRoom.memory.role.push('spreaderPower');
        treatedRoom.memory.unity.push('number of creeps');
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined');
        treatedRoom.memory.needOriginPos.push('undefined');
        treatedRoom.memory.criticalNeed.push(false);


    }
}

module.exports = setNeedCreepsPowerSpreaderOfRoom;
