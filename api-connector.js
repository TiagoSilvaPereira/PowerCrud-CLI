'use strict';

module.exports = {
    init: function(connector) {
        this.connector = connector;
    },

    chooseAPIPlug: function() {
        return require('./' + this.connector.plug + '-plug');
    }
}