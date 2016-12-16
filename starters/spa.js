'use strict';

module.exports = {
    init: function(project) {
        this.project = project;
        this.starterHelpers = require('./starter-helpers');
        this.spaPlugs = project.spa_plugs;
        this.setupSpaPlugs();
    },

    setupSpaPlugs: function() {
        this.spaPlugs.forEach(function(spa){
            var spaPlug = this.starterHelpers.choosePlug(spa);
            spaPlug.init(this.project);
        }.bind(this));
    }
}