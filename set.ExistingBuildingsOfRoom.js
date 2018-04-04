var setExistingBuildingsOfRoom = {
    run: function(treatedRoom) {
        // BUILDINGS

        var spawningPointsOfRoom = treatedRoom.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_SPAWN}} );
        if(spawningPointsOfRoom.length > 0) {
            for(let currentSpawningPointIndex= 0; currentSpawningPointIndex<spawningPointsOfRoom.length; currentSpawningPointIndex++) {
                treatedRoom.memory.spawningPoints.push(spawningPointsOfRoom[currentSpawningPointIndex].id);
                treatedRoom.memory.spawningPointsPos.push(spawningPointsOfRoom[currentSpawningPointIndex].pos);
            }
        }

        var linksOfRoom = treatedRoom.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_LINK}} );
        if(linksOfRoom.length > 0) {
            for(let currentLinkIndex= 0; currentLinkIndex<linksOfRoom.length; currentLinkIndex++) {
                treatedRoom.memory.links.push(linksOfRoom[currentLinkIndex].id);
            }
        }

        var storageOfRoom = treatedRoom.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_STORAGE}});
        if(storageOfRoom.length > 0) {
            for(let currentStorageIndex= 0; currentStorageIndex<storageOfRoom.length; currentStorageIndex++) {
                treatedRoom.memory.storages.push(storageOfRoom[currentStorageIndex].id);
            }
        }

        // Sources will never move in the room
        if(treatedRoom.memory.sources == undefined || treatedRoom.memory.sourcesPos == undefined) {
            treatedRoom.memory.sources = [];
            treatedRoom.memory.sourcesPos = [];

            var sourcesOfRoom = treatedRoom.find(FIND_SOURCES);
            if(sourcesOfRoom.length > 0) {
                for(let currentSourceIndex= 0; currentSourceIndex<sourcesOfRoom.length; currentSourceIndex++) {
                    treatedRoom.memory.sources.push(sourcesOfRoom[currentSourceIndex].id);
                    treatedRoom.memory.sourcesPos.push(sourcesOfRoom[currentSourceIndex].pos);
                }
            }
        }


        // Then we parse the links to check they are all categorized
        if(treatedRoom.memory.senderLinks != null && treatedRoom.memory.receiverLinks != null){
            for(let k=0; k<linksOfRoom.length; k++) {
                let linkCategorized = false;
                if(treatedRoom.memory.senderLinks != undefined){
                    for(let h= 0; h<treatedRoom.memory.senderLinks.length; h++) {
                        if(linksOfRoom[k].id == treatedRoom.memory.senderLinks[h]) {
                            linkCategorized = true;
                        }
                    }
                }
                if(treatedRoom.memory.receiverLinks != undefined ) {
                    for(let h=0; h<treatedRoom.memory.receiverLinks.length; h++) {
                        if(linksOfRoom[k].id == treatedRoom.memory.receiverLinks[h]) {
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

                        treatedRoom.memory.receiverLinks.push(linksOfRoom[k].id);

                    }
                    else {
                        treatedRoom.memory.senderLinks.push(linksOfRoom[k].id);
                    }
                }

            }
        }


        var towersOfRoom = treatedRoom.find(FIND_MY_STRUCTURES, {filter: function(object) {return object.structureType == STRUCTURE_TOWER}});
        if(towersOfRoom.length > 0) {
            for(let currentTowerIndex= 0; currentTowerIndex<towersOfRoom.length; currentTowerIndex++) {
                treatedRoom.memory.towers.push(towersOfRoom[currentTowerIndex].id);
            }
        }
		
    }
}

module.exports = setExistingBuildingsOfRoom;
