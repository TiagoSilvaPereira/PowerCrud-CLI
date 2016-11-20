/*
 * This module is used to create a MySQL database using the project data
 */

'use strict';

module.exports = {
    init: function(database) {
        this.database = database;
        this.databaseName = database.databaseName;
        this.connectionData = database.connection;
        this.setupConnection();
    },

    setupConnection: function() {
        console.log('Starting MySQL Connection...');

        var mysql = require('mysql');
        var connectionConfig = {
            host     : this.connectionData.host,
            port     : this.connectionData.port,
            user     : this.connectionData.user,
            password : this.connectionData.password,
            multipleStatements: true
        };

        this.connection = mysql.createConnection(connectionConfig);
        this.connection.connect();
    },

    createDatabase: function() {
        var sql = 'CREATE DATABASE IF NOT EXISTS ' + this.databaseName + '; USE ' + this.databaseName;

        this.connection.query(sql, function(err, rows, fields) {
            if (err) throw err;

            this.connectionData.database = this.databaseName;
            this.createDataStructure(this.database.data);

        }.bind(this));
    },

    createDataStructure: function(data) {
        var sql = this.createDataSql(data);

        this.connection.query(sql, function(err, rows, fields) {
            if (err) throw err;
            this.endConnection();
        }.bind(this));
    },

    createDataSql: function(data) {
        var sql = '';
        data.objects.forEach(function(object){
            sql += 'CREATE TABLE IF NOT EXISTS ' + object.name + '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY';
            
            object.structure.forEach(function(field){
                sql += ', ' + field.name + this.fieldType(field) + this.fieldRequired(field);
            }.bind(this));

            if(object.child_of) {
                object.child_of.forEach(function(parent){
                    sql += this.fieldFk(object.name, parent);
                }.bind(this));
            }

            sql += this.timestampsFields();

            sql += ') ENGINE=INNODB; ';

        }.bind(this));

        return sql;
    },

    fieldType: function(field) {
        if(field.type == 'text') {
            return (field.size == 'no-limit') ? ' TEXT ' : ' VARCHAR(' + field.size + ') ';
        }else
        if(field.type == 'password') {
            return (field.size == 'no-limit') ? ' TEXT ' : ' VARCHAR(' + field.size + ') ';
        }else
        if(field.type == 'file') {
            return ' VARCHAR(256) ';
        }
    },

    fieldFk: function(objectName, field) {
        var fkName = field + '_id';

        return ', ' + fkName + ' INT, ' + 'INDEX ' + objectName + '_' + fkName + ' (' 
                    + fkName + '), Foreign Key(' + fkName + ') references ' + field + '(id)';
    },

    fieldRequired(field) {
        return (field.required) ? ' NOT NULL ' : '';
    },

    timestampsFields() {
        return ', created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP' +
               ', updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
    },

    endConnection: function() {
        this.connection.end();
    }
}