/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('info.senderLinkCloseToSource');
 * mod.thing == 'a thing'; // true
 */

var senderLinkCloseToSource = {

    /** @param {Creep} creep **/
    run: function(source) {
        if(source.room.memory.senderLinks != undefined){
            for(let i = 0; i<source.room.memory.senderLinks.length;i++) {
                
                // We check the area of the source to look for a sender link
                for(let k=-3;k<4;k++) {
                    for(let h = -3; h<4; h++) {
                        let foundInSpace = source.room.lookForAt(LOOK_STRUCTURES, source.pos.x + k, source.pos.y + h);
                        if(foundInSpace.length > 0) {
//                        console.log('Room ' + source.room.name + ', source ' + source.id + ', k = ' + k +', h = ' + h + ', found : ' + foundInSpace)
                            for(let j = 0; j<foundInSpace.length; j++) {
                                if(foundInSpace[j].id == source.room.memory.senderLinks[i]) {
                                
                                    // console.log('source ' + source.id + ', found the link close ' + foundInSpace[0].id)
                                    return true;
                                }
                            }
                        }
                        
                        
                    }
                }
                
            }
        }
        return false;

    }
};

module.exports = senderLinkCloseToSource;