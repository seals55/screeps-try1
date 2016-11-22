/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */

var roleScout = {
    /** @param {Creep} creep **/
    run: function (creep) {
        moveToRoom = "W7N3"
        let a = new RoomPosition(25,25,moveToRoom);
        //MOVE TO TARGET ROOM
        if (creep.room != moveToRoom) {

            
            // var route = Game.map.findRoute(creep.room, moveToRoom);
            // if (route.length > 0) {
            //     var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.say("Exiting Room")
                // creep.moveTo(exit);
                creep.moveTo(a);

            // }
        } else {
            if (creep.room.controller) {
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                    creep.say("Claiming Room")
                }
            }
        }
    }
};

module.exports = roleScout;



