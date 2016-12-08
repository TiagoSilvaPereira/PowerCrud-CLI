'use strict';

module.exports = {
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

    outputDirectory: function(project, subDirectory) {
        subDirectory = (subDirectory) ? '/' + subDirectory : '';
        return (project.output_directory || './projects') + '/' + project.name + subDirectory;
    },

    choosePlug: function(plugObject) {
        return require('./' + plugObject.plug + '-plug');
    },

    copyFolder: function(sourceDir, destinyDir, successCallback) {
        var fileCopy = require('ncp').ncp;

        fileCopy(sourceDir, destinyDir, function(err){
            if(err) throw err;
            console.log(destinyDir,'Folder Created!!');
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