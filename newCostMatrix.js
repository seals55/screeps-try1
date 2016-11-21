/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('newCostMatrix');
 * mod.thing == 'a thing'; // true
 */

var newCostMatrix = {

    run: function (spawn) {
            
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Set roads to cost 1 to prefer road pathfinding        
        var targets = spawn.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_ROAD); } });
        let costs = new PathFinder.CostMatrix;
        
        for (i = 0; i < targets.length; i++) {
            var curPos = targets[i].pos
            costs.set(curPos.x,curPos.y,1)
        }
    }
};

module.exports = newCostMatrix;
