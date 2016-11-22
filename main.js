var helper = require('helper');

var roleMulti = require('role.multi');
var roleRepair = require('role.repair');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var newCostMatrix = require('newCostMatrix');
var roleClaimer = require('role.claimer');
    var vars = require('vars');

var tower = require('tower');

module.exports.loop = function() {
    //console.log('tick')

    //var maxMulti = 0;
    //var maxRepair = 6;
    //var maxHarvester = 6;
    //var maxUpgrader = 4;
    //var maxScout = 0;
    //var maxClaimer = 1;
    var debug = vars.debug;

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep from memory:', name);
        }
    }

    // if (debug) {
    //     console.log("Debug: " + debug + " : " + "maxMulti: " + maxMulti + " : " + "maxRepair: " + maxRepair + " : " + "maxHarvester:" + maxHarvester + " : " + "maxUpgrader:" + maxUpgrader);
    // };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Loop rooms
    for (var rm in Game.rooms) {
        var curRoom = Game.rooms[rm]

        var spawn = curRoom.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })

        //console.log("Current Room: '" + curRoom + "' | " + "Spawn: '" + spawn + "' | " + "Energy: '" + curRoom.energyCapacityAvailable + "'");



        //newCostMatrix.run(spawn);

        var multi = _.filter(Game.creeps, (creep) => creep.memory.role == 'multi' && curRoom.name == creep.room.name);
        var repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair' && curRoom.name == creep.room.name);
        var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && curRoom.name == creep.room.name);
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && curRoom.name == creep.room.name);
        var scout = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout');
        var claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && curRoom.name == creep.room.name);
        if (spawn[0] != null) {
            if (multi.length<helper.maxCreep(curRoom,'multi') || repair.length<helper.maxCreep(curRoom,'repair') || harvester.length<helper.maxCreep(curRoom,'harvester') || upgrader.length<helper.maxCreep(curRoom,'upgrader') || claimer.length<helper.maxCreep(curRoom,'claimer')) {
                //var target = curRoom.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTROLLER); } });
                
                LogOut = rm + '-- Multi:' + multi.length + '/' + helper.maxCreep(curRoom,'multi') + ', Harvester:' + harvester.length + '/' + helper.maxCreep(curRoom,'harvester') + ', Repair:' + repair.length + '/' + helper.maxCreep(curRoom,'repair') + ', Upgrader:' + upgrader.length + '/' + helper.maxCreep(curRoom,'upgrader') + ', Claimer:' + claimer.length + '/' + helper.maxCreep(curRoom,'claimer') +', Total Creeps:' + _.filter(Game.creeps, (creep) => curRoom.name == creep.room.name).length;
                
                console.log(LogOut);
            }
            if(multi.length < helper.maxCreep(curRoom,'multi')) {
                var newName = spawn[0].createCreep(helper.calcBody(curRoom,'role.multi'), undefined, {role: 'multi'});
                if (_.isString(newName)) { console.log('Spawning new multi: ' + newName); }
            } else if(harvester.length < helper.maxCreep(curRoom,'harvester')) {
                var newName = spawn[0].createCreep(helper.calcBody(curRoom,'role.harvester'), undefined, {role: 'harvester'});
                if (_.isString(newName)) { console.log('Spawning new harvester: ' + newName); }
            } else if(repair.length < helper.maxCreep(curRoom,'repair')) {
                var newName = spawn[0].createCreep(helper.calcBody(curRoom,'role.repair'), undefined, {role: 'repair'});
                if (_.isString(newName)) {console.log('Spawning new repair: ' + newName); }
            } else if(upgrader.length < helper.maxCreep(curRoom,'upgrader')) {
                var newName = spawn[0].createCreep(helper.calcBody(curRoom,'role.upgrader'), undefined, {role: 'upgrader'});
                if (_.isString(newName)) { console.log('Spawning new upgrader: ' + newName); }
            } else if(claimer.length < helper.maxCreep(curRoom,'claimer')) {
                var newName = spawn[0].createCreep([CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'claimer'});
                if (_.isString(newName)) { console.log('Spawning new claimer: ' + newName); }
            }


            //if all creeps died, spawn the worst possible one to get things going again
            if (_.filter(Game.creeps) == null) {
                var newName = spawn[0].createCreep([MOVE, WORK, CARRY], undefined, { role: 'multi' });
                if (_.isString(newName)) { console.log('Spawning new multi: ' + newName); }
            }
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
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
    
    
}