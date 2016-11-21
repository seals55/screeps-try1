function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

//define("debug", false);
define("debug", true);

// setup some minimum numbers for different roles
define("minimumNumberOfHarvesters", 4);
define("minimumNumberOfUpgraders", 2);
define("minimumNumberOfBuilders", 2);
define("minimumNumberOfRepairers", 1);

define("minimumNumberOfTowerfillers", 1);
define("maximumNumberOfTowerfillers", 1);

define("minimumNumberOfStorers", 1);
define("maximumNumberOfStorers", 1);

define("minimumNumberOfWallRepairers", 0);
define("maximumNumberOfWallRepairers", 1);
