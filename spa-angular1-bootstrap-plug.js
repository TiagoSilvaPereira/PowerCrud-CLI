'use strict';

module.exports = {
    init: function(project) {
        console.log('Selected SPA Plug: AngularJS 1.0 - Bootstrap');

        this.sourcePath = './base_code/spa_angular1_bootstrap';
        this.ncp = require('ncp').ncp;
        this.fs = require('fs');
        this.plugUtils = require('./plug-utils');

        this.project = project;
        this.projectFolder = this.plugUtils.outputDirectory(project, 'spa');

        this.plugUtils.copyFolder(this.sourcePath, this.projectFolder, function() {
            this.setAppName();
            this.makeInsertScripts();
            this.makeAngularStates();
        }.bind(this));

    },

    setAppName: function() {
        var files = [
            this.projectFolder + '/*.html',
            this.projectFolder + '/app/*.js',
            this.projectFolder + '/app/components/base/*.html',
            this.projectFolder + '/app/components/base/*.js',
        ];

        this.plugUtils.replaceInFiles(files, 'angularAppName', this.project.nameCamelCase);
    },

    makeInsertScripts: function() {
        var code = this.makeInsertScriptsCode();
        this.plugUtils.replaceInFiles(this.projectFolder + '/index.html', 'insertScripts', code);
    },

    makeInsertScriptsCode: function() {
        var code = '';

        this.project.data.objects.forEach(function(object){
            code += '\t<!-- ' + this.plugUtils.capitalize(object.name) + ' -->\n';
            code += '\t<script src="/app/components/' + object.name + '/' + object.name + '.services.js"></script>\n';
            code += '\t<script src="/app/components/' + object.name + '/' + object.name + '.controller.js"></script>\n';
            code += '\t<script src="/app/components/' + object.name + '/' + object.name + '.edit.controller.js"></script>\n\n';
        }.bind(this));

        return code;
    },

    makeAngularStates: function() {
        var code = this.makeObjectStates();
        this.plugUtils.replaceInFiles(this.projectFolder + '/app/app.states.js', 'states', code);
    },

    makeObjectStates: function() {
        var code = '';
        
        this.project.data.objects.forEach(function(object){
            code += this.makeObjectStateCode(object);
        }.bind(this));

        return code;
    },

    makeObjectStateCode: function(object) {
        var code = 
        "\t\t.state('root." + object.name + "', {\n"+
        "\t\t\turl: '/" + object.name + "',\n"+
            "\t\t\tviews: {\n"+
                "\t\t\t\t'main@': {\n"+
                    "\t\t\t\t\ttemplateUrl: 'app/components/" + object.name + "/views/" + object.name + ".list.html',\n"+
                    "\t\t\t\t\tcontroller: '" + object.name + "Controller as vm'\n"+
                "\t\t\t\t}\n"+
            "\t\t\t}\n"+
        "\t\t})\n"+
        "\t\t.state('root." + object.name + ".edit', {\n"+
            "\t\t\turl: '/edit/:id',\n"+
            "\t\t\tviews: {\n"+
                "\t\t\t\t'main@': {\n"+
                    "\t\t\t\t\ttemplateUrl: 'app/components/" + object.name + "/views/" + object.name + ".edit.html',\n"+
                    "\t\t\t\t\tcontroller: '" + object.name_singular + "EditController as vm'\n"+
                "\t\t\t\t}\n"+
            "\t\t\t}\n"+
        "\t\t})\n";

        return code;
    },

    makeAllModules: function() {
        this.project.data.objects.forEach(function(object){
            this.makeModule(object);
        }.bind(this));
    },

    makeModule: function(object) {
        var moduleBaseFiles =  [
            this.sourcePath + '/app/components/base/base.services.js',
            this.sourcePath + '/app/components/base/base.controller.js',
            this.sourcePath + '/app/components/base/base.edit.controller.js',
            this.sourcePath + '/app/components/base/views/base.edit.html',
            this.sourcePath + '/app/components/base/views/base.list.html',
        ];
    },

    replaceModuleVariables: function(object) {

    }

}