function define(name, value) {
    name = null;
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}



//define("debug", false);
define("debug", true);

// setup some minimum numbers for different roles

define("maxMulti", 0);
define("maxRepair", 1);
define("maxHarvester", 8);
define("maxUpgrader", 8);
