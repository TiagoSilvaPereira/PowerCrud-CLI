'use strict';

module.exports = {
    init: function(project) {
        this.project = project;
        this.starterHelpers = require('./starter-helpers');
        this.connectors = this.getConnectors();
        this.setupConnectors();
    },

    getConnectors: function() {
        return this.project.connectors_plugs;
    },

    setupConnectors: function() {
        this.connectors.forEach(function(connector){
            if(connector.type == 'api'){
                var connectorPlug = this.starterHelpers.choosePlug(connector);
                connectorPlug.init(this.project);
            }
        }.bind(this));
    }
}