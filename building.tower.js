
var towerRole = {

    /** @param {Creep} creep **/
    run: function(tower) {
            var targetAttack = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS/*, {filter: function(object) {return object.getActiveBodyparts(ATTACK)>0}}*/);
                
        /*
        var targetsRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.hits < 25000});
        if(targetsRepair != null && tower.energy > 750 && targetAttack == null) {
            tower.repair(targetsRepair);
        }*/
        
        if(targetAttack != null) {
            tower.attack(targetAttack);
        }
        
    }   
};


module.exports = towerRole;