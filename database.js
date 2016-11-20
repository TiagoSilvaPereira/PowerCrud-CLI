'use strict';

module.exports = {
    init: function(project) {
        this.database = this.getDatabase(project);

        if(this.database) {
            this.setupDatabase();
        }
    },

    formatName: function(name) {
        name = name.toLowerCase();
        name = name.replace(/ /g, '_');
        return name;
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

    setupDatabase: function() {
        if(this.database.plug == 'mysql') {
            this.generateMySqlDatabase();
        }
    },

    generateMySqlDatabase: function() {
        console.log('--- Choose MySQL Plug ---');
        var mysqlGen = require('./mysql-plug');
        mysqlGen.init(this.database);
        mysqlGen.createDatabase();
    }
}