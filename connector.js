'use strict';

module.exports = {
    init: function(project) {
        this.project = project;
        this.connectors = this.getConnectors();
        this.setupConnectors();
    },

    getConnectors: function() {
        return this.project.connectors_plugs;
    },

    setupConnectors: function() {
        this.connectors.forEach(function(connector){
            if(connector.type == 'api') {
                this.setupAPIConnector(connector);
            }
        }.bind(this));
    },

    setupAPIConnector: function(connector) {
        // Essa parte pode ser desnecessária, verificar!!!
        var apiConnector = require('./api-connector');
        apiConnector.init(connector);
        var plug = apiConnector.chooseAPIPlug();
        plug.init(this.project);
    }
}