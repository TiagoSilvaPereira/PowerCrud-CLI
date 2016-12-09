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
            this.makeSideMenu();
            this.makeAllModules();
        });

    },

    setAppName: function() {
        let files = [
            this.projectFolder + '/*.html',
            this.projectFolder + '/app/*.js',
            this.projectFolder + '/app/components/home/*.js',
            this.projectFolder + '/app/components/layout/views/*.html'
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

    makeSideMenu: function() {
        let menuItemsCode = '';

        this.project.data.objects.forEach((object) => {
            menuItemsCode += '\t\t<li role="presentation"><a href="#" ui-sref="root.' + object.name + '">' +
            this.plugUtils.capitalize(object.name) + '</a></li>\n';
        });

        this.plugUtils.replaceInFiles(this.projectFolder + '/app/components/layout/views/sidebar.html', 
            'menuItems', menuItemsCode);
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
            this.makeEditViewFile(object);
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
            code = this.replaceObjectsListCode(code,object);
            code = this.replaceDefaultCode(code, object);
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
        let baseFile = this.sourcePath + '/app/components/base/views/base.edit.html',
            destFile = this.projectFolder + '/app/components/' + object.name + '/views/' + object.name + '.edit.html';

        this.plugUtils.fileFromBaseFile(baseFile, destFile, (code) => {
            code = this.replaceFormFieldsCode(code,object);
            code = this.replaceDefaultCode(code, object);
            return code;
        });
    },

    replaceFormFieldsCode: function(code, object) {
        let fieldsCode = '';

        object.structure.forEach((field) => {
            if(this.plugUtils.isInputField(field)){
                fieldsCode += this.inputFieldCode(field, field.component); 
            }else
            if(this.plugUtils.isTextAreaField(field)){
                fieldsCode += this.textAreaFieldCode(field);
            }else
            if(this.plugUtils.isFileImageField(field)){
                fieldsCode += this.fileImageFieldCode(field);
            }
        });

        code = this.plugUtils.replaceCode(code, 'formFields', fieldsCode);
        return code;
    },

    inputFieldCode: function(field, componentType) {
        let required = (field.required) ? 'required="required"' : '';
        
        let code = 
        '\t<div class="form-group">\n'+
            '\t\t<label for="' + field.name + '">' + this.plugUtils.capitalize(field.name) + '</label>\n'+
            '\t\t<input ' + required + ' type="' + componentType + '" class="form-control" ng-model="vm.{%object%}.' + field.name + '">\n'+
        '\t</div>\n';

        return code;
    },

    textAreaFieldCode: function(field) {
        let required = (field.required) ? 'required="required"' : '';

        let code = 
        '\t<div class="form-group">\n'+
            '\t\t<label for="' + field.name + '">' + this.plugUtils.capitalize(field.name) + '</label>\n'+
            '\t\t<textarea ' + required + ' class="form-control" ng-model="vm.{%object%}.' + field.name + '"></textarea>\n'+
        '\t</div>\n';

        return code;
    },

    fileUploadFieldCode: function(field) {
        return '';
    },

    fileImageFieldCode: function(field) {
        let code = 
        '\t<div class="form-group" ng-if="vm.{%object%}.id">\n'+
            '\t\t<label for="' + field.name + '">Image</label>\n'+
            '\t\t<div>\n'+
              '\t\t\t<img ngf-thumbnail="file || vm.config.UploadAddress + \'/{%objects%}/\' + vm.{%object%}.' + field.name + '.name" width="150">\n'+
              '\t\t\t<div class="btn btn-default" ngf-select="vm.uploadFile($file, \'' + field.name + '\')" ng-model="file" ngf-pattern="\'image/*\'" ngf-accept="\'image/*\'">Select Files</div>\n'+
            '\t\t</div>\n'+
        '\t</div>\n';

        return code;
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