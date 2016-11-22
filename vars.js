function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

//define("debug", false);
define("debug", true);

// setup some minimum numbers for different roles

define("maxMulti", 0);
define("maxRepair", 2);
define("maxHarvester", 4);
define("maxUpgrader", 4);
