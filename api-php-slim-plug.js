'use strict';

module.exports = {
    init: function(project) {

        console.log('Selected API Plug: PHP - Slim');
        
        this.ncp = require('ncp').ncp;
        this.fs = require('fs');
        this.plugUtils = require('./plug-utils');

        this.project = project;
        this.databaseConfig = this.getDatabaseConfig();

        // API Project Folder
        this.projectFolder = this.plugUtils.outputDirectory(project, 'api');

        this.plugUtils.copyFolder('./base_code/api_php_slim', this.projectFolder, function() {
            this.makeConfigFiles();
            this.makeRequires();
            this.makeModelsAndControllers();
            this.afterMakeAPI();
        }.bind(this));
    },

    getDatabaseConfig: function() {
        return this.project.database_plugs[0];
    },

    makeConfigFiles: function() {
        this.readFile('app/config/database.php', function(textData) {

            var connection = this.databaseConfig.connection;
            textData = this.plugUtils.replaceCode(textData, 'driver', this.databaseConfig.plug);
            textData = this.plugUtils.replaceCode(textData, 'database', this.databaseConfig.name);
            textData = this.plugUtils.replaceCode(textData, 'host', connection.host);
            textData = this.plugUtils.replaceCode(textData, 'username', connection.user);
            textData = this.plugUtils.replaceCode(textData, 'password', connection.password);

            this.writeFile('app/config/database.php', textData);
        }.bind(this));
    },

    makeRequires: function() {
        this.readFile('index.php', function(textData) {
            textData = this.plugUtils.replaceCode(textData, 'require_models', this.makeRequireModels());
            textData = this.plugUtils.replaceCode(textData, 'require_controllers', this.makeRequireControllers());

            this.writeFile('index.php', textData);
        }.bind(this))
    },

    makeRequireModels: function() {
        var code = '';
        // Make the models requires based on the project objects
        this.project.data.objects.forEach(function(object){
            code += 'require_once _APP . "/models/' + this.plugUtils.capitalize(object.name) + 'Model.php";';
            code += '\n';
        }.bind(this));

        return code;
    },

    makeRequireControllers: function() {
        var code = '';
        // Make the models requires based on the project objects
        this.project.data.objects.forEach(function(object){
            code += 'require_once _APP . "/controllers/' + this.plugUtils.capitalize(object.name) + 'Controller.php";';
            code += '\n';
        }.bind(this));

        return code;
    },

    makeModelsAndControllers: function() {
        this.project.data.objects.forEach(function(object){
            this.makeModel(object);
            this.makeController(object);
        }.bind(this));
    },

    makeModel: function(object) {
        this.readFile('app/models/baseModel.php', function(textData) {
            textData = this.plugUtils.replaceCode(textData, 'Model', this.plugUtils.capitalize(object.name));
            textData = this.plugUtils.replaceCode(textData, 'ModelSingular', this.plugUtils.capitalize(object.name_singular));
            textData = this.plugUtils.replaceCode(textData, 'table', object.name);
            textData = this.plugUtils.replaceCode(textData, 'fields', this.makeFillableFiels(object));

            this.writeFile('app/models/' + this.plugUtils.capitalize(object.name) + 'Model.php', textData);
        }.bind(this));
    },

    makeFillableFiels: function(object) {
        var fields = [];
        object.structure.forEach(function(field){
            fields.push('\'' + field.name + '\'');
        });

        return fields.join(',');
    },

    makeController: function(object) {
        this.readFile('app/controllers/baseController.php', function(textData) {
            textData = this.plugUtils.replaceCode(textData, 'Model', this.plugUtils.capitalize(object.name));
            textData = this.plugUtils.replaceCode(textData, 'ModelSingular', this.plugUtils.capitalize(object.name_singular));
            textData = this.plugUtils.replaceCode(textData, 'url_suffix', object.name);
            textData = this.plugUtils.replaceCode(textData, 'object', object.name_singular);

            this.writeFile('app/controllers/' + this.plugUtils.capitalize(object.name) + 'Controller.php', textData);
        }.bind(this));
    },

    afterMakeAPI: function() {
        // It runs a PHP Server in the API directory
        /*var exec = require('child_process').exec;
        var cmd = 'cd ' + this.plugUtils.outputDirectory(this.project, 'api') + '&php -S localhost:5000';

        exec(cmd, function(error, stdout, stderr) {
          if(error) throw error;
        });*/
    },

    readFile: function(file, successCallback) {
        this.fs.readFile(this.projectFolder + '/' + file, 'utf-8', function(err, data) {
            if (err) throw err;
            if(successCallback) successCallback(data);
        });
    },

    writeFile: function(file, content, successCallback) {
        this.fs.writeFile(this.projectFolder + '/' + file, content, function() {
            console.log('File ' + file +  ' created!');
            if(successCallback) successCallback();
        })
    }
}