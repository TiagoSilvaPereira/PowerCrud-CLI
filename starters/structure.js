'use strict';

module.exports = {
    init: function(project, successCallback) {
        this.project = project;
        this.makeDirectories();
        if(successCallback) successCallback();
    },

    makeDirectories: function() {
        var fs = require('fs'),
            starterHelpers = require('./starter-helpers'),
            dirProject = starterHelpers.outputDirectory(this.project),
            dirApi = starterHelpers.outputDirectory(this.project, 'api'),
            dirSpa = starterHelpers.outputDirectory(this.project, 'spa'),
            dirWeb = starterHelpers.outputDirectory(this.project, 'web'),
            dirShared = starterHelpers.outputDirectory(this.project, 'shared');

        if (!fs.existsSync(dirProject)){ fs.mkdirSync(dirProject); }
        if (!fs.existsSync(dirApi)){ fs.mkdirSync(dirApi); }
        if (!fs.existsSync(dirSpa)){ fs.mkdirSync(dirSpa); }
        if (!fs.existsSync(dirWeb)){ fs.mkdirSync(dirWeb); }
        if (!fs.existsSync(dirShared)){ fs.mkdirSync(dirShared); }
    }
}