'use strict';

module.exports = {
    init: function(project, successCallback) {
        this.project = project;
        this.makeDirectories();
        if(successCallback) successCallback();
    },

    makeDirectories: function() {
        var fs = require('fs'),
            plugUtils = require('./plug-utils'),
            dirProject = plugUtils.outputDirectory(this.project),
            dirApi = plugUtils.outputDirectory(this.project, 'api'),
            dirSpa = plugUtils.outputDirectory(this.project, 'spa'),
            dirWeb = plugUtils.outputDirectory(this.project, 'web');

        if (!fs.existsSync(dirProject)){ fs.mkdirSync(dirProject); }
        if (!fs.existsSync(dirApi)){ fs.mkdirSync(dirApi); }
        if (!fs.existsSync(dirSpa)){ fs.mkdirSync(dirSpa); }
        if (!fs.existsSync(dirWeb)){ fs.mkdirSync(dirWeb); }
    }
}