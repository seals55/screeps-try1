/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */
var vars = require('vars');

// module.exports = {
//     // a function to run the logic for this role
//     run: function(creep) {
//         // if creep is bringing energy to a structure but has no energy left
//         if (creep.memory.working == true && creep.carry.energy == 0) {
//             // switch state
//             creep.memory.working = false;
//         }
//         // if creep is harvesting energy but is full
//         else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
//             // switch state
//             creep.memory.working = true;
//             creep.say("H:I'm Full");

//         }

//         // if creep is supposed to transfer energy to a structure
//         if (creep.memory.working == true) {
//             var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
//                 // the second argument for findClosestByPath is an object which takes
//                 // a property called filter which can be a function
//                 // we use the arrow operator to define it
//                 filter: (s) => (s.structureType == STRUCTURE_TOWER)
//                              // || s.structureType == STRUCTURE_EXTENSION
//                              //|| s.structureType == STRUCTURE_SPAWN)
//                              && ((s.energy + 800) < s.energyCapacity)
//             });
//             if (!structure) {
//                 var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
//                 // the second argument for findClosestByPath is an object which takes
//                 // a property called filter which can be a function
//                 // we use the arrow operator to define it
//                 filter: (s) => (s.structureType == STRUCTURE_SPAWN
//                               // || s.structureType == STRUCTURE_TOWER
//                               || s.structureType == STRUCTURE_EXTENSION)
//                              && s.energy < s.energyCapacity
//                 });
//             }

//             // if we found one
//             if (structure) {
//                 // try to transfer energy, if it is not in range
//                 if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//                     // move towards it
//                     creep.moveTo(structure);
//                 }
//             }
//         }
//         // if creep is supposed to harvest energy from source
//         else {
//             // find closest source
//             var source = creep.pos.findClosestByPath(FIND_SOURCES);
//             // try to harvest energy, if the source is not in range
//             if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
//                 // move towards the source
//                 creep.moveTo(source);
//             }
//         }
//     }
// };


var roleMulti = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (creep.carry.energy < creep.carryCapacity && creep.memory.working == false) {
            //init vars
            var sources = creep.room.find(FIND_SOURCES);
            var creepCount = new Array()

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Has harvesting source been determined? Check
            if (creep.memory.harSource = -1) {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                //add up creepCount for each source
                for (i = 0; i < sources.length; i++) {
                    if (!creepCount[i]) {
                        creepCount[i] = 0;
                    }
                }
                for (i = 0; i < sources.length; i++) {
                    for (var cName in Game.creeps) {
                        var cre = Game.creeps[cName];
                        if (cre.memory.harSource != -1) {
                            creepCount[cre.memory.harSource] += 1;
                            //console.log('CreepCount for Source ' + i + ': ' + creepCount[cre.memory.harSource])
                        }
                    }
                }

                //console.log('CreepCount[0]: ' + creepCount[0] + ' CreepCount[1]: ' + creepCount[1])
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                //Determine best source to send creep to
                var lowestCreepSource = 0;
                for (i = 0; i < sources.length; i++) {
                    if (sources[i].energy > 0) {
                        if (creepCount[i] <= creepCount[lowestCreepSource]) {
                            lowestCreepSource = i;
                        }
                    }
                }
                //console.log('LowestCreepSource: ' +lowestCreepSource)
                creep.memory.harSource = lowestCreepSource;

                var sourceFound = false;
                for (i = 0; i < sources.length; i++) {
                    if (sources[i].energy > 0) {
                        sourceFound = true;
                        break;
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Send creep to source
            if (sourceFound == true) {
                if (creep.harvest(sources[creep.memory.harSource]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.harSource]);
                    //creep.say('move to ' + creep.memory.harSource)
                }
            } else {
                //No source energy avail, attempt to work
                creep.memory.working = true;
                creep.memory.harSource = -1;
            }

        } else {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Harvesting complete.  Reinit and distribute to task
            creep.memory.working = true;
            creep.memory.harSource = -1;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Search for structure with less then max energy
            //////pos.findClosestByPath //creep.room.find
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER) &&
                        (structure.energy < structure.energyCapacity);
                }
            });

            //structure.store[RESOURCE_ENERGY] < structure.storeCapacity
            if (target == null) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity; } });
            }
            if (target != null) {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                //Structures found, deposit energy
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                //move to an extension
                var targetTwo = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION);
                    }
                });
                if (targetTwo != null) {
                    creep.moveTo(targetTwo);
                }

            }
        }
    }
};

module.exports = roleMulti;