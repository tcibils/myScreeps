var setNeedCreepsAdHocHarvestersOfRoom = {
    run: function(treatedRoom) {
		let naturallyDeadTime = 100;
        // CATASTROPHE

        treatedRoom.memory.labels.push('AdHoc Harvesters')
        treatedRoom.memory.role.push('harvester')
        treatedRoom.memory.unity.push('Number of creeps')
        treatedRoom.memory.targetRoom.push('undefined')
        treatedRoom.memory.needOrigin.push('undefined')
        treatedRoom.memory.needOriginPos.push('undefined')
        treatedRoom.memory.criticalNeed.push(false);
		

        var harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' && creep.memory.homeRoom == treatedRoom.name));
        treatedRoom.memory.attached.push(harvesters.length);

        let counterTotalWorkNeeded = 0;
        let counterTotalWorkAttached = 0;
        let counterTotalCarryNeeded = 0;
        let counterTotalCarryAttached = 0;
        let counterTotalSpreadNeeded = 0;
        let counterTotalSpreadAttached = 0;

        for(let a = 0; a < treatedRoom.memory.labels.length; a++) {

            if(treatedRoom.memory.role[a] == 'fatHarvester') {
                counterTotalWorkNeeded += treatedRoom.memory.need[a];
                counterTotalWorkAttached += treatedRoom.memory.attached[a];
            }

            if(treatedRoom.memory.role[a] == 'fastMover') {
                counterTotalCarryNeeded += treatedRoom.memory.need[a];
                counterTotalCarryAttached += treatedRoom.memory.attached[a];
            }

            if(treatedRoom.memory.role[a] == 'spreader') {
                counterTotalSpreadNeeded += treatedRoom.memory.need[a];
                counterTotalSpreadAttached += treatedRoom.memory.attached[a];
            }

        }
		
		let workSufficient = true;
		if(counterTotalWorkAttached == 0 && counterTotalWorkNeeded > 0 ) {
			workSufficient = false;
		}
		
		let carrySufficient = true;
		if(counterTotalCarryAttached == 0 && counterTotalCarryNeeded > 0) {
			carrySufficient = false;
		}
		
		// With 150 energy we can spread a spreader if critical.
		let spreadSufficient = true;
		if(counterTotalSpreadNeeded > counterTotalSpreadAttached && room.energyAvailable < 150) {
			spreadSufficient = false;
		}

        // console.log('spreaders A ' + treatedRoom.memory.storageSpreaderAttached[0])
        if(!workSufficient || !carrySufficient || !spreadSufficient) {
            treatedRoom.memory.need.push(2);
        }
        else {
            treatedRoom.memory.need.push(0);
        }
    }
}

module.exports = setNeedCreepsAdHocHarvestersOfRoom;
