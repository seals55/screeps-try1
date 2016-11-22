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
        //MOVE TO TARGET ROOM
        if (creep.room != moveToRoom) {
            var route = Game.map.findRoute(creep.room, moveToRoom);
            if (route.length > 0) {
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
        }
        //RESERVE CONTROLLER IN TARGET ROOM (NOT WORKING, CREEP IS SWITCHING BETWEEN TARGET ROM AND THE ONE BEFORE THAT)
        else {
            if (creep.room.controller) {
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = roleScout;



