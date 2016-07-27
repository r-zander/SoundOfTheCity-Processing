"use strict";
var ConstructionMode = {

    get: function () {
        return this;
    },

    /**
     * 1 = everything is build
     * 0 = everything is blocked from buildings.
     */
    density: 0.7,

    pathFinding: {
        straightCost: 1,

        diagonalCost: 1,

        newPathFinder: function (pathFinderGraph) {
            var easystar = new EasyStar.js();

            easystar.setGrid(pathFinderGraph);

            easystar.setAcceptableTiles([1]);

            easystar.enableSync();

            return easystar;
        }
    },

    streetsCanReplaceBuildings: false
};
