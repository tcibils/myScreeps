// Returns the number of spreaders needed for a given link
// It is 1 if there is no spreader, or if the spreader(s) attached only has 150 ticks to live, and if the are some senders links
// It is 0 or negtive number if there is a spreader attached having more than 150 ticks to live and a sender link at least

var spreaderNeededOfLink = {
    run: function(link) {
        var totalLinkNeeded = 1;
        var counter = 0;
        
        var spreadersOrSlackers = link.room.find(FIND_MY_CREEPS,{filter: {memory: {role: 'spreader'}} || {role: 'slacker'}});
        
        // If our link is a receiver, we do not need any creep
        if(link.room.memory.senderLinks != undefined) {
            for(let i = 0; i < link.room.memory.senderLinks.length; i++) {
                if(link.room.memory.senderLinks[i] == link.id) {
                    // console.log('Link ' + link.id +' is a sender link, thus no spreader needed')
                    return 0;
                }
            }
        }
        
        for(let i = 0; i<spreadersOrSlackers.length; i++) {
            if(spreadersOrSlackers[i].memory.linkAttached == link.id && spreadersOrSlackers[i].ticksToLive > 150) {
                counter++;
            }
            if(spreadersOrSlackers[i].memory.linkAttached == null && spreadersOrSlackers[i].ticksToLive > 1000) {
                counter++;
            }
        }
        
        if(link.room.memory.senderLinks != undefined) {
            if(link.room.memory.senderLinks.length == 0 || link.room.controller.level < 5) {
                // console.log('Room ' + link.room.name + ', link ' + link.id + ', no senders link (' + link.room.memory.senderLinks.length + ') or room control too low (' + link.room.controller.level +'), thus no spreader needed')
                return 0;
            }
            
            else if(link.room.memory.senderLinks.length > 0 && link.room.controller.level >= 5) {
                var result = totalLinkNeeded-counter;
                // console.log('Room ' +link.room.name + ', link ' + link.id + ', total needed : ' + totalLinkNeeded + ', counter : ' + counter + ', thus total spreaders needed : ' + result + ' (there is a sender to provde energy to this receiver and the room control is >= 5)')
                return result;                
            }
        }
        

        
    }
};

module.exports = spreaderNeededOfLink;