'use strict';

module.exports = {
    init: function(project) {
        this.project = project;
        this.plugUtils = require('./plug-utils');
        this.spaPlugs = project.spa_plugs;
        this.setupSpaPlugs();
    },

    setupSpaPlugs: function() {
        this.spaPlugs.forEach(function(spa){
            var spaPlug = this.plugUtils.choosePlug(spa);
            spaPlug.init(this.project);
        }.bind(this));
    }
}