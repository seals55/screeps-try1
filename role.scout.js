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
        var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTROLLER)}});
        
        if (sources[0]) {
            //move off page
            //move DIR
            creep.move(EAST)
        } else {
            if (creep.claimController) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }

        // if(creep.carry.energy == 0) {
        //     var sources = creep.room.find(FIND_SOURCES);
        //     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(sources[0]);
        //     }
        // }
        // else {
        //     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(creep.room.controller);
        //     }
        // }
    }
};

module.exports = roleScout;

