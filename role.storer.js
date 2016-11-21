/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.storer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  run: function( creep ) {

    // Setting the working variable so the creep focus
    // on getting the ressource or returning it.
    if ( creep.memory.working && creep.carry.energy == 0 ) {
        creep.memory.working = false;
    }

    if ( ! creep.memory.working && creep.carry.energy == creep.carryCapacity ) {
        creep.memory.working = true;
        creep.memory.targetContainer = false;
    }

    if ( creep.memory.working ) {

        // Bring the resources to the storage.
        var theStorage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE );
            }
        });

        if ( creep.transfer( theStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo( theStorage );
        }

    } else {

        // If the creep have a target.
        if ( creep.memory.targetContainer ) {

            // Go to the container.
            var theContainer = Game.getObjectById( creep.memory.targetContainer );

            if ( creep.withdraw( theContainer, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
                creep.moveTo( theContainer );
            }

        } else {

            // Find the container with the most energy.
            var target = creep.room.find( FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER );
                }
            });

            if ( target.length ) {

                var allContainer = [];

                // Calculate the percentage of energy in each container.
                for ( var i = 0; i < target.length; i++ ) {

                    allContainer.push( { energyPercent: ( ( target[i].store.energy / target[i].storeCapacity ) * 100 ), id: target[i].id } );

                }

                // Get the container containing the most energy.
                var highestContainer = _.max( allContainer, function( container ){ return container.energyPercent; });

                console.log( 'Going for the container id "' + highestContainer.id + '" at ' + highestContainer.energyPercent + '% full.' );

                // set the target in memory so the creep dosen't
                // change target in the middle of the room.
                creep.memory.targetContainer = highestContainer.id;

            }
        }
    }
  }

};