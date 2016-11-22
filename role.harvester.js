/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.multi');
 * mod.thing == 'a thing'; // true
 */

var roleMulti = {

    /** @param {Creep} creep **/
    run: function(creep) {
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

            //check for dropped energy
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, { filter: (d) => { return (d.resourceType == RESOURCE_ENERGY) } });
            if (dropenergy) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy)
                }
            } else {
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
            }
        } else {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Harvesting complete.  Reinit and distribute to task
            creep.memory.working = true;
            creep.memory.harSource = -1;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Search for structure with less then max energy
            //fill tower first only if <= 200 energy
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER)
                        && (structure.energy + 800 < structure.energyCapacity);
                }
            });
            if (!target) {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION
                            || structure.structureType == STRUCTURE_SPAWN
                            || structure.structureType == STRUCTURE_CONTAINER
                            || structure.structureType == STRUCTURE_TOWER)
                            && (structure.energy < structure.energyCapacity);
                    }
                });
            }
            console.log("Harvester target: " + target)

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