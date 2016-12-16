'use strict';

module.exports = {

    filterAndOrganize: function(project) {
        console.log('--- Filtering and Organizing the Project ---');

        this.plugUtils = require('./plug-utils');

        project.nameCamelCase = this.plugUtils.camelize(project.name);
        project.data.objects = this.order(project.data.objects);
        project.data.objects = this.countFileFields(project.data.objects);
        return project;
    },

    /*
     * Count the quantity of File Fields the object has and set it. This is used for create File Upload
     * functions in the front-end and in the backend, if is necessary 
     */
    countFileFields: function(objects) {
        var count = 0;
        objects.forEach(function(object) {
            count = 0;
            object.structure.forEach(function(field){
                if(field.type == 'file') count++;
            });
            object.fileFieldsCount = count;
        });

        return objects;
    },

    /* If the object doesn't have a child_of value, this is a master object and is moved to the top
     * of the objects list. However, objects that are child of others objects needs to be correctly
     * ordened to don't throw errors while are created 
     */
    order: function(objects) {
        objects.sort(function(objectA, objectB){
            if(!objectA.child_of) return -1;
            if(objectA.child_of) return 1;

            return 0;
        });

        return objects;
    }
}