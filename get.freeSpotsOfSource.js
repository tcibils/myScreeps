// Returns number of free spots around the source, minus the number of creeps already attached to it
// Almost obsolete - see get.freeFatSpotsOfSource...

var placesOfSource = require('get.placesOfSource');


var freeSpotsOfSource = {
    
    run: function(toBeAssessed) {
        var myCreeps = toBeAssessed.room.find(FIND_MY_CREEPS);
	    var counter = 0;
	    for(var i = 0; i<myCreeps.length; i++) {
	        if(myCreeps[i].memory.attachedSource == toBeAssessed.id) {
	            counter++;
	        }
	    }
	    var toBeReturned = placesOfSource.run(toBeAssessed) - counter;
//	    console.log('Source: ' + toBeAssessed.id + ', room available: ' + placesOfSource.run(toBeAssessed) + ', creep counter: ' + counter + ', thus returned: ' + toBeReturned);
	    return toBeReturned;
    }
};


module.exports = freeSpotsOfSource;