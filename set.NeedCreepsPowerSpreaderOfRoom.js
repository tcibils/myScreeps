var setNeedCreepsPowerSpreaderOfRoom = {
    run: function(treatedRoom) {
		
		myRooms[currentRoomIndex].memory.labels.push('Power Spreader');
		
		if(Game.getObjectById(myRooms[currentRoomIndex].memory.storages[0]) != undefined) {
			if(Game.getObjectById(myRooms[currentRoomIndex].memory.storages[0]).store[RESOURCE_POWER] > 0) {
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
		
        myRooms[currentRoomIndex].memory.role.push('spreaderPower');
        myRooms[currentRoomIndex].memory.unity.push('number of creeps');
        myRooms[currentRoomIndex].memory.targetRoom.push('undefined')
        myRooms[currentRoomIndex].memory.needOrigin.push('undefined');
        myRooms[currentRoomIndex].memory.needOriginPos.push('undefined');
        myRooms[currentRoomIndex].memory.criticalNeed.push(false);


    }
}

module.exports = setNeedCreepsPowerSpreaderOfRoom;
