'use strict';

module.exports = {

    filterAndOrganize: function(project) {
        console.log('--- Filtering and Organizing the Project ---');
        project.data.objects = this.order(project.data.objects);
        return project;
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