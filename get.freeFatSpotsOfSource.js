// Returns number of free spots around the source, minus the number of FAT creeps already attached to it
// To be used to determine if fatHarvester should be attached to source

var placesOfSource = require('get.placesOfSource');


var freeFatSpotsOfSource = {
    
    run: function(toBeAssessed) {
        var myCreeps = toBeAssessed.room.find(FIND_MY_CREEPS);
	    var counter = 0;
	    for(var i = 0; i<myCreeps.length; i++) {
	        if(myCreeps[i].memory.attachedSource == toBeAssessed.id && myCreeps[i].memory.role == 'fatHarvester') {
	            counter++;
	        }
	    }
	    var toBeReturned = placesOfSource.run(toBeAssessed) - counter;
	    return toBeReturned;
    }
};


module.exports = freeFatSpotsOfSource;