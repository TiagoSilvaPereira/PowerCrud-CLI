'use strict';

module.exports = {

    /* Plug Helpers */
    choosePlug: function(plugObject) {
        return require('../plugs/' + plugObject.plug + '-plug');
    },

    /* Directory and Files Helpers */
    outputDirectory: function(project, subDirectory) {
        subDirectory = (subDirectory) ? '/' + subDirectory : '';
        return (project.output_directory || './projects') + '/' + project.name + subDirectory;
    }
}