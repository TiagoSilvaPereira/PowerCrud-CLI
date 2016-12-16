'use strict';

module.exports = {

    /* Object Helpers */
    getObjectByName: function(project, name) {
        let foundObject = {};

        project.data.objects.forEach(function(object){
            if(object.name == name) 
                foundObject = object;
        });

        return foundObject;
    },

    /* Input Helpers*/
    isTextField: function(field) {
        return (field.component == 'text' || field.component == 'password' || field.component == 'email');
    },

    isNumberField: function(field) {
        return (field.component == 'number');
    },

    isTextAreaField: function(field) {
        return (field.component == 'textarea');
    },

    isFileField: function(field) {
        return (field.component == 'file');
    },

    isFileImageField: function(field) {
        return (field.component == 'file-image');
    },

    /* Code Helpers */
    replaceCode: function(content, variable, replacement) {
        var re = new RegExp('{%' + variable + '%}', 'g');
        return content.replace(re, replacement);
    },

    getReplacementCode: function(variable) {
        return new RegExp('{%' + variable + '%}', 'g');
    },

    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    camelize: function(string) {
      return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '');
    },

    /* Directory and Files Helpers */
    outputDirectory: function(project, subDirectory) {
        subDirectory = (subDirectory) ? '/' + subDirectory : '';
        return (project.output_directory || './projects') + '/' + project.name + subDirectory;
    },

    copyFolder: function(sourceDir, destinyDir, successCallback) {
        var fileCopy = require('ncp').ncp;

        fileCopy(sourceDir, destinyDir, function(err){
            if(err) throw err;
            console.log(destinyDir,' - Folder Created!!');
            if(successCallback) successCallback();
        })
    },

    makeDirectory: function(path, successCallback) {
        var fs = require('fs');
        fs.mkdir(path, function(err, data) {
            if (err) throw err;
            console.log('Directory',path,'created!');
            if(successCallback) successCallback();
        });
    },

    /*
     * With this method, you can create a new file using a base file. And, if you need, you can manipulate
     * the data of the base file before save the destination file
     */
    fileFromBaseFile: function(baseFile, destFile, manipulatorCallback) {
        this.readFile(baseFile, (textData) => {
            if(manipulatorCallback) 
                textData = manipulatorCallback(textData);

            this.writeFile(destFile, textData);
        });
    },

    readFile: function(filePath, successCallback) {
        var fs = require('fs');
        fs.readFile(filePath, 'utf-8', function(err, data) {
            if (err) throw err;
            if(successCallback) successCallback(data);
        });
    },

    writeFile: function(filePath, content, successCallback) {
        var fs = require('fs');
        
        fs.writeFile(filePath, content, function(err) {
            if (err) throw err;
            console.log('File ' + filePath +  ' created!');
            if(successCallback) successCallback();
        })
    },

    replaceInFiles: function(files, variable, replacement) {
        var replace = require('replace-in-file');
        const options = {};

        options.files = files;
        options.allowEmptyPaths = false;
        options.replace = this.getReplacementCode(variable);
        options.with = replacement;

        replace.sync(options);
    }
}