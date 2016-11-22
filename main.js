
var vars = require('vars');
var helper = require('helper');

var roleMulti = require('role.multi');
var roleRepair = require('role.repair');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var newCostMatrix = require('newCostMatrix');

var tower = require('tower');

module.exports.loop = function() {
    //console.log('tick')

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    console.log(vars.debug)

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Loop rooms
    for (var rm in Game.rooms) {
        var curRoom = Game.rooms[rm]
        var spawn = curRoom.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })
        //newCostMatrix.run(spawn);
        var multi = _.filter(Game.creeps, (creep) => creep.memory.role == 'multi');
        var repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
        var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

        if (multi.length < vars.maxMulti || repair.length < vars.maxRepair || harvester.length < vars.maxHarvester || upgrader.length < vars.maxUpgrader) {
            if (vars.debug) { console.log('Multi:' + multi.length + '/' + vars.maxMulti + ', Harvester:' + harvester.length + '/' + vars.maxHarvester + ', Repair:' + repair.length + '/' + vars.maxRepair + ', Upgrader:' + upgrader.length + '/' + vars.maxUpgrader + ', Total Creeps:' + _.filter(Game.creeps).length); };
         }

        if (multi.length < vars.maxMulti) {
            var newName = spawn[0].createCreep(helper.calcBody(curRoom, 'role.multi'), undefined, { role: 'multi' });
            if (_.isString(newName)) { console.log('Spawning new multi: ' + newName); }
        } else if (harvester.length < vars.maxHarvester) {
            var newName = spawn[0].createCreep(helper.calcBody(curRoom, 'role.harvester'), undefined, { role: 'harvester' });
            if (_.isString(newName)) { console.log('Spawning new harvester: ' + newName); }
        } else if (repair.length < vars.maxRepair) {
            var newName = spawn[0].createCreep(helper.calcBody(curRoom, 'role.repair'), undefined, { role: 'repair' });
            if (_.isString(newName)) { console.log('Spawning new repair: ' + newName); }
        } else if (upgrader.length < vars.maxUpgrader) {
            var newName = spawn[0].createCreep(helper.calcBody(curRoom, 'role.upgrader'), undefined, { role: 'upgrader' });
            if (_.isString(newName)) { console.log('Spawning new upgrader: ' + newName); }
        }

        //if all creeps died, spawn the worst possible one to get things going again
        if (_.filter(Game.creeps) == null) {
            var newName = spawn[0].createCreep([MOVE, WORK, CARRY], undefined, { role: 'multi' });
            if (_.isString(newName)) { console.log('Spawning new multi: ' + newName); }
        }

        var towers = curRoom.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        if (towers != undefined) {
            for (i = 0; i < towers.length; i++) {
                tower.run(towers[i]);
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Loop Creeps    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'multi') {
            roleMulti.run(creep);
        } else if (creep.memory.role == 'repair') {
            roleRepair.run(creep);
        } else if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }


}