'use strict';

module.exports = {
    init: function(project) {
        this.database = this.getDatabase(project);
        this.starterHelpers = require('./starter-helpers');

        if(this.database) {
            this.setupDatabase();
        }
    },

    getDatabase: function(project) {
        var database = null;

        if(project.database_plugs.length > 0) {
            database = project.database_plugs[0];
            database.databaseName = database.name || this.formatName(project.name);
            database.data = project.data;
        }

        return database;
    },

    formatName: function(name) {
        name = name.toLowerCase();
        name = name.replace(/ /g, '_');
        return name;
    },

    setupDatabase: function() {
        if(this.database.plug == 'mysql') {
            this.useLocalPlug(this.database.plug);
        }else{
            this.useImportedPlug(this.database.plug);
        }
    },

    useLocalPlug: function(plugName) {
        var databasePlug = this.starterHelpers.chooseLocalPlug(plugName);
        databasePlug.init(this.database);
        databasePlug.createDatabase();
    },

    useImportedPlug: function(plugName) {
        var databasePlug = this.starterHelpers.choosePlug(plugName);
        databasePlug.init(this.database);
        databasePlug.createDatabase();
    }
}