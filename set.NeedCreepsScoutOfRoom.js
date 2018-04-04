var setNeedCreepsScoutOfRoom = {
    run: function(treatedRoom) {
		let naturallyDeadTime = 100;
		 // SCOUT

        treatedRoom.memory.labels.push('scout');
        treatedRoom.memory.role.push('scout');
        treatedRoom.memory.unity.push('Number of creeps');
        treatedRoom.memory.targetRoom.push('undefined');
        treatedRoom.memory.needOrigin.push('undefined');
        treatedRoom.memory.needOriginPos.push('undefined');
        treatedRoom.memory.criticalNeed.push(false);
        treatedRoom.memory.need.push(1);
        treatedRoom.memory.attached.push(_.filter(Game.creeps, (creep) => (creep.memory.role == 'scout' && creep.memory.homeRoom == treatedRoom.name)).length);


    }
}

module.exports = setNeedCreepsScoutOfRoom;
