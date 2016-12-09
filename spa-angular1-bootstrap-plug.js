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

        this.plugUtils.copyFolder(this.sourcePath, this.projectFolder, () => {
            this.setAppName();
            this.makeInsertScripts();
            this.makeAngularStates();
            this.makeAllModules();
        });

    },

    setAppName: function() {
        let files = [
            this.projectFolder + '/*.html',
            this.projectFolder + '/app/*.js'
        ];

        this.plugUtils.replaceInFiles(files, 'appName', this.project.name);
        this.plugUtils.replaceInFiles(files, 'angularAppName', this.project.nameCamelCase);
    },

    makeInsertScripts: function() {
        let code = this.makeInsertScriptsCode();
        this.plugUtils.replaceInFiles(this.projectFolder + '/index.html', 'insertScripts', code);
    },

    makeInsertScriptsCode: function() {
        let code = '';

        this.project.data.objects.forEach((object) => {
            code += '\t<!-- ' + this.plugUtils.capitalize(object.name) + ' -->\n';
            code += '\t<script src="/app/components/' + object.name + '/' + object.name + '.services.js"></script>\n';
            code += '\t<script src="/app/components/' + object.name + '/' + object.name + '.controller.js"></script>\n';
            code += '\t<script src="/app/components/' + object.name + '/' + object.name + '.edit.controller.js"></script>\n\n';
        });

        return code;
    },

    makeAngularStates: function() {
        let code = this.makeObjectStates();
        this.plugUtils.replaceInFiles(this.projectFolder + '/app/app.states.js', 'states', code);
    },

    makeObjectStates: function() {
        let code = '';
        
        this.project.data.objects.forEach((object) => {
            code += this.makeObjectStateCode(object);
        });

        return code;
    },

    makeObjectStateCode: function(object) {
        let code = 
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
        this.project.data.objects.forEach((object) => {
            this.makeModule(object);
        });
    },

    makeModule: function(object) {
        let moduleDestDir = this.projectFolder + '/app/components/' + object.name + '/';

        // Make Module Root Directory
        this.plugUtils.makeDirectory(moduleDestDir, () => {
            this.makeServicesFile(object);
            this.makeListControllerFile(object);
            this.makeEditControllerFile(object);

            this.makeModuleViews(object);
        });
    },

    makeModuleViews: function(object) {
        let viewsDestDir = this.projectFolder + '/app/components/' + object.name + '/views/';

        this.plugUtils.makeDirectory(viewsDestDir, () => {
            this.makeListViewFile(object);
        });
    },

    makeServicesFile: function(object) {
        let baseFile = this.sourcePath + '/app/components/base/base.services.js',
            destFile = this.projectFolder + '/app/components/' + object.name + '/' + object.name + '.services.js';

        this.plugUtils.fileFromBaseFile(baseFile, destFile, (code) => {
            return this.replaceDefaultCode(code, object);
        });
    },

    makeListControllerFile: function(object) {
        let baseFile = this.sourcePath + '/app/components/base/base.controller.js',
            destFile = this.projectFolder + '/app/components/' + object.name + '/' + object.name + '.controller.js';

        this.plugUtils.fileFromBaseFile(baseFile, destFile, (code) => {
            return this.replaceDefaultCode(code, object);
        });
    },

    makeEditControllerFile: function(object) {
        let baseFile = this.sourcePath + '/app/components/base/base.edit.controller.js',
            destFile = this.projectFolder + '/app/components/' + object.name + '/' + object.name + '.edit.controller.js';

        this.plugUtils.fileFromBaseFile(baseFile, destFile, (code) => {
            return this.replaceDefaultCode(code, object);
        });
    },

    makeListViewFile: function(object) {
        let baseFile = this.sourcePath + '/app/components/base/views/base.list.html',
            destFile = this.projectFolder + '/app/components/' + object.name + '/views/' + object.name + '.list.html';

        this.plugUtils.fileFromBaseFile(baseFile, destFile, (code) => {
            code = this.replaceDefaultCode(code, object);
            code = this.replaceObjectsListCode(code,object);
            return code;
        });
    },

    /*
     * Verify the fields marked as "in-list", to create de objects list view
     */
    replaceObjectsListCode: function(code, object) {
        let headerFields = '', 
            listFields = '', 
            fieldsInList = this.fieldsInList(object);

        fieldsInList.forEach((field) => {
            headerFields += '\t\t\t\t\t<th>' + this.plugUtils.capitalize(field.name) + '</th>\n';
            listFields += '\t\t\t\t\t<td><span>{{' + object.name_singular + '.' + field.name + '}}</span></td>\n';
        });

        code = this.plugUtils.replaceCode(code, 'headerFields', headerFields);
        code = this.plugUtils.replaceCode(code, 'listFields', listFields);
        return code;
    },

    fieldsInList: function(object) {
        let fieldsInList = [];

        object.structure.forEach(function(field){
            if(field.in_list) fieldsInList.push(field);
        });

        return fieldsInList;
    },

    makeEditViewFile: function(object) {
        let baseFile = this.sourcePath + '/app/components/base/views/base.edit.html';
    },

    /*
     * Default replacements for all the files of the modules
     */
    replaceDefaultCode: function(code, object) {
        code = this.plugUtils.replaceCode(code, 'angularAppName', this.project.nameCamelCase);
        code = this.plugUtils.replaceCode(code, 'object', object.name_singular);
        code = this.plugUtils.replaceCode(code, 'Object', this.plugUtils.capitalize(object.name_singular));
        code = this.plugUtils.replaceCode(code, 'objects', object.name);
        code = this.plugUtils.replaceCode(code, 'Objects', this.plugUtils.capitalize(object.name));
        return code;
    }

}