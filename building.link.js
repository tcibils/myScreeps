
var linkRole = {

    run: function(link) {
        let linkFunction = null;
        var activateLog = false;
        
        if(linkFunction == null) {
            if(link.room.memory.senderLinks != undefined) {
                for(let i = 0; i<link.room.memory.senderLinks.length; i++) {
                    if(link.room.memory.senderLinks[i] == link.id) {
                        linkFunction = 'sender';
                    }
                }
            }
        }
        
        if(linkFunction == null) {
            if(link.room.memory.receiverLinks != undefined) {
                for(let i = 0; i<link.room.memory.receiverLinks.length; i++) {
                    if(link.room.memory.receiverLinks[i] == link.id) {
                        linkFunction = 'receiver';
                    }
                }
            }
        }
        
        // If we are a sender
        if(linkFunction == 'sender') {
            // If the cooldown is 0, we try to send what we have
            if(link.cooldown == 0) {
                var bestTarget = null;
                // var bestTargetDistance = 1000;
                var bestDelta = -10000;
                
                // Looking for the best reveiver link target
                if(link.room.memory.receiverLinks != undefined) {
                    if(link.room.memory.receiverLinks.length > 0) {
                        for(let i = 0; i<link.room.memory.receiverLinks.length; i++) {
                            // Looking first of all forthe closest one
                            if(Game.getObjectById(link.room.memory.receiverLinks[i]) != null) {
                                let deltaReceiver = Game.getObjectById(link.room.memory.receiverLinks[i]).energyCapacity - Game.getObjectById(link.room.memory.receiverLinks[i]).energy;
                                let wouldBeSend = Math.min(deltaReceiver,link.energy);
                                if(wouldBeSend > bestDelta && wouldBeSend > 10) {
                                    // Our goal will be to take the closest one which can get all of the energy
                                    bestTarget = link.room.memory.receiverLinks[i];
                                    bestDelta = wouldBeSend;
                                    // bestTargetDistance = link.pos.getRangeTo(Game.getObjectById(link.room.memory.receiverLinks[i]));
                                    // console.log('best target ' + bestTarget + ', distance ' + link.pos.getRangeTo(Game.getObjectById(link.room.memory.receiverLinks[i])) + ', delta : ' + delta)
                            
                                    
                                }
                            }
                        }
                    }
                }
                
                // And if we have a target
                if(bestTarget != null) {
                    // If the cooldown is up
                    // console.log('cooldown : ' + link.cooldown)
                    if(link.cooldown == 0) {
                        // We transfer !
                        if(activateLog) {
                            console.log('Room ' + link.room.name + ', link ' + link.id + ', transfering to best target : ' + bestTarget + ', delta : ' + bestDelta)
                        }
                        link.transferEnergy(Game.getObjectById(bestTarget), bestDelta);
                    }
                }
            }
        }
        
    }
};

module.exports = linkRole;