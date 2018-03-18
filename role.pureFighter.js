
// Goes to flag 3, then goes to flag 4, then destroys everything ther

var rolePureFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.defending) {
            if(creep.room.name != Game.flags.Flag1.pos.roomName) {
                creep.moveTo(Game.flags.Flag1.pos);
            }
            
            if(creep.room.name == Game.flags.Flag1.pos.roomName) {
                if(Game.getObjectById(creep.memory.target) == null) {
                    var ennemies = creep.room.find(FIND_HOSTILE_CREEPS);
                    if(ennemies.length > 0) {
                        var targetIndice = Math.floor(Math.random() * ennemies.length);
                        creep.memory.target = ennemies[targetIndice].id;
                    }
                    if(Game.getObjectById(creep.memory.target) == null){
                        creep.moveTo(Game.flags.Flag1.pos);
                    }
                }
                if(Game.getObjectById(creep.memory.target) != null){
                    if(creep.attack(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ff0000'}});
                        creep.say(' 🗡️ Go home ! 🛡️ ', true);
                    }
                }
            }
        }

        if(creep.memory.attacking && !creep.memory.defending) {
            
            // console.log('creep ' + creep.name + ', creep room name : ' + creep.room.name + ', flag 3 in room : ' + Game.flags.Flag3.pos.roomName + ', and arriving to first flag : ' + creep.memory.arrivedToFirstFlag);
            
            if(creep.room.name != Game.flags.Flag3.pos.roomName && !creep.memory.arrivedToFlag3) {
                creep.moveTo(Game.flags.Flag3.pos);
            }
            
            if(creep.room.name == Game.flags.Flag3.pos.roomName && !creep.memory.arrivedToFlag3) {
                creep.memory.arrivedToFlag3 = true;
                creep.memory.arrivedToFlag4 = false;
            }
            
            // -------------------- //
            if(creep.room.name != Game.flags.Flag4.pos.roomName && !creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.moveTo(Game.flags.Flag4.pos);
            }
            if(creep.room.name == Game.flags.Flag4.pos.roomName && !creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.memory.arrivedToFlag4 = true;
                creep.memory.arrivedToFlag5 = false;
            }
            /*
            // -------------------- //            
            if(creep.room.name != Game.flags.Flag5.pos.roomName && !creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.moveTo(Game.flags.Flag5.pos);
            }
            if(creep.room.name == Game.flags.Flag5.pos.roomName && !creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.memory.arrivedToFlag5 = true;
                creep.memory.arrivedToFlag6 = false;
            }
            
            if(creep.room.name != Game.flags.Flag6.pos.roomName && !creep.memory.arrivedToFlag6 && creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.moveTo(Game.flags.Flag6.pos);
            }
            if(creep.room.name == Game.flags.Flag6.pos.roomName && !creep.memory.arrivedToFlag7 && !creep.memory.arrivedToFlag6 && creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.memory.arrivedToFlag6 = true;
                creep.memory.arrivedToFlag7 = false;
            }
            
            if(creep.room.name != Game.flags.Flag7.pos.roomName && !creep.memory.arrivedToFlag7 && creep.memory.arrivedToFlag6 && creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.moveTo(Game.flags.Flag7.pos);
            }
            if(creep.room.name == Game.flags.Flag7.pos.roomName && !creep.memory.arrivedToFlag7 && creep.memory.arrivedToFlag6 && creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.memory.arrivedToFlag7 = true;
                creep.memory.arrivedToFlag8 = false;
            }
            
                        
            if(creep.room.name != Game.flags.Flag8.pos.roomName && !creep.memory.arrivedToFlag8 && creep.memory.room7Cleaned && creep.memory.arrivedToFlag7 && creep.memory.arrivedToFlag6 && creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
              creep.moveTo(Game.flags.Flag8.pos);
            }
            if(creep.room.name == Game.flags.Flag8.pos.roomName && !creep.memory.arrivedToFlag8 && creep.memory.room7Cleaned && creep.memory.arrivedToFlag7 && creep.memory.arrivedToFlag6 && creep.memory.arrivedToFlag5 && creep.memory.arrivedToFlag4 && creep.memory.arrivedToFlag3) {
                creep.memory.arrivedToFlag8 = true;
            }
            */
            
            // flag to arrive to change
            if(creep.room.name == Game.flags.Flag4.pos.roomName && creep.memory.arrivedToFlag4) {

                // attacking closest creep
                if(Game.getObjectById(creep.memory.target) == null) {
                    if(creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS) != null) {
                        creep.memory.target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS).id;
                    }
                    
                }
                if(Game.getObjectById(creep.memory.target) == null) {
                    if(creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES) != null)
                    creep.memory.target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES).id;
                }
                if(Game.getObjectById(creep.memory.target) != null) {
                    if(creep.attack(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ff0000'}});
                        creep.say(' ⚔️ BANZAI', true);
                    }
                }
                /*
                if(creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
                    creep.memory.room7Cleaned = true;
                }
                */
                
                /* Randomizing targets
                if(Game.getObjectById(creep.memory.target) == null) {
                    var ennemies = creep.room.find(FIND_HOSTILE_CREEPS);
                    var ennemyBuildings = creep.room.find(FIND_HOSTILE_STRUCTURES);
                    if(ennemies.length > 0) {
                        var targetIndice = Math.floor(Math.random() * ennemies.length);
                        creep.memory.target = ennemies[targetIndice].id;
                    }
                    else if(ennemyBuildings.length > 0) {
                        var targetIndice = Math.floor(Math.random() * ennemyBuildings.length);
                        creep.memory.target = ennemies[targetIndice].id;
                    }
                    if(Game.getObjectById(creep.memory.target) == null){
                        creep.moveTo(Game.flags.Flag2.pos);
                    }
                }
                if(Game.getObjectById(creep.memory.target) != null){
                    if(creep.attack(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ff0000'}});
                        creep.say('⚔️ BANZAI ⚔️', true);
                    }
                }
                */
                
            
            }
            
            /*
            if(creep.room.name == Game.flags.Flag8.pos.roomName && creep.memory.arrivedToFlag8 && creep.memory.room7Cleaned) {
                
                // attacking closest creep
                if(Game.getObjectById(creep.memory.target) == null) {
                    creep.memory.target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS).id;
                }            
                if(Game.getObjectById(creep.memory.target) != null) {
                    if(creep.attack(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ff0000'}});
                        creep.say('⚔️ BANZAI ⚔️', true);
                    }
                }

            }
            */
            
        }
        
    }
};


module.exports = rolePureFighter;