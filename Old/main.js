var helper = require('helper');
// import modules
require('prototype.spawn')();
var vars = require('vars');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleTowerfiller = require('role.Towerfiller');
var newCostMatrix = require('newCostMatrix');
var roleStorer = require('role.storer');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            if (vars.debug) { console.log('Clearing non-existing creep memory:', name); }
        }
    }

    for (var i in Game.spawns) {
        var spawn = Game.spawns[i];
        newCostMatrix.run(spawn);
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        // if creep is Towerfiller, call repairer script
        else if (creep.memory.role == 'Towerfiller') {
            roleTowerfiller.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'storer') {
            roleStorer.run(creep);
        }
    }

    for (var name in Game.rooms) {
        // console.log(name);
        var MyRoom = Game.rooms[name];
        //Spawner:
        var spawns = MyRoom.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
        for (var spawn in spawns) {

            var towers = MyRoom.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER });
            var storages = MyRoom.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE });

            if (vars.debug) { console.log("Room: " + MyRoom + " : " + "Number of Towers: " + towers.length + " : " + "Number of Storage: " + storages.length); }
            for (let tower of towers) {
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                } else {
                    // only repair if there are no enemies
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax });
                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }
    }


    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
    var numberOfTowerfillers = _.sum(Game.creeps, (c) => c.memory.role == 'Towerfiller');
    var numberOfStorers = _.sum(Game.creeps, (c) => c.memory.role == 'storer');

    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;

    var name = undefined;

    if (vars.debug) { console.log('MaxEnergy: ' + energy); }

    //console.log('Harvesters: ' + numberOfHarvesters + " : " + 'Upgraders: ' + numberOfUpgraders + " : " + 'Builders: ' + numberOfBuilders + " : " + "Repairers: " + numberOfRepairers + " : " + "Towerfillers: " + numberOfTowerfillers + " : " + "WallRepairers: " + numberOfWallRepairers);
    if (vars.debug) { console.log('Harvesters: ' + numberOfHarvesters + " : " + 'Upgraders: ' + numberOfUpgraders + " : " + 'Builders: ' + numberOfBuilders + " : " + "Repairers: " + numberOfRepairers + " : " + "Towerfillers: " + numberOfTowerfillers + " : " + "Storer: " + numberOfStorers); }

    // if not enough harvesters
    if (numberOfHarvesters < vars.minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createCustomCreep(
                Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
    }
    // if not enough upgraders
    else if (numberOfUpgraders < vars.minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
    }
    // if not enough repairers
    else if (numberOfRepairers < vars.minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
    }
    // if not enough builders
    else if (numberOfBuilders < vars.minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
    }
    // if not enough wallRepairers
    else if ((numberOfWallRepairers < vars.minimumNumberOfWallRepairers) && !(numberOfWallRepairers >= vars.maximumNumberOfTowerfillers)) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
    }
    else if ((numberOfTowerfillers < vars.minimumNumberOfTowerfillers) && !(numberOfTowerfillers >= vars.maximumNumberOfWallRepairers) && (towers.length >= 1)) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Towerfiller');
    }
    else if ((numberOfStorers < vars.minimumNumberOfStorers) && !(numberOfStorers >= vars.maximumNumberOfStorers) && (storages.length >= 1)) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'storer');
    }
    else {
        // else try to spawn a builder
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');

        // else try to spawn a harvester
        //name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');        
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && !(name == undefined)) {
        console.log("Spawned new creep: " + name);
    }
};