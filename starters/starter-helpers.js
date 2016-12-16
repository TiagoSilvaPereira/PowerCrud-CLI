'use strict';

module.exports = {

    /* Plug Helpers */
    chooseLocalPlug: function(plugObject) {
        return require('../plugs/pwc-' + plugObject.plug + '-plug');
    },

    choosePlug: function(plugObject) {
        return require('pwc-' + plugObject.plug + '-plug');
    },

    /* Directory and Files Helpers */
    outputDirectory: function(project, subDirectory) {
        subDirectory = (subDirectory) ? '/' + subDirectory : '';
        return (project.output_directory || './projects') + '/' + project.name + subDirectory;
    }
}