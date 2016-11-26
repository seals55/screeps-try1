var tower = {

    /** @param {Creep} creep **/
    run: function(curTower) {
       var hostile = curTower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
       curTower.attack(hostile)
        } else {
            // only repair if there are no enemies
            var closestDamagedStructure = curTower.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax });
            if (closestDamagedStructure) {
                curTower.repair(closestDamagedStructure);
            }
        }
    }
};

module.exports = tower;
