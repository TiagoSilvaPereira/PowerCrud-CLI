(function () {
    'use strict';

    angular.module('{%angularAppName%}.services')
           .service('{%objects%}Service', {%objects%}Service);

    {%objects%}Service.$inject = ['$http', 'Upload', 'CONFIG'];

    function {%objects%}Service($http, Upload, CONFIG) {

        var factory = {
            get{%Objects%}: get{%Objects%},
            get{%Object%}: get{%Object%},
            save{%Object%}: save{%Object%},
            delete{%Object%}: delete{%Object%},
            uploadFile: uploadFile
        };

        function get{%Objects%}() {
            return $http({
                method: 'GET',
                url: CONFIG.APIAddress + '/{%objects%}'
            });
        }

        function get{%Object%}(id) {
            return $http({
                method: 'GET',
                url: CONFIG.APIAddress + '/{%objects%}/' + id
            });
        }

        function save{%Object%}(data) {
            if(data.id){
                return update{%Object%}(data);
            }

            return insert{%Object%}(data);
        }

        function insert{%Object%}(data) {
            return $http({
                method: 'POST',
                url: CONFIG.APIAddress + '/{%objects%}',
                data: data
            });
        }

        function update{%Object%}(data) {
            return $http({
                method: 'PUT',
                url: CONFIG.APIAddress + '/{%objects%}/' + data.id,
                data: data
            });
        }

        function delete{%Object%}(id) {
            return $http({
                method: 'DELETE',
                url: CONFIG.APIAddress + '/{%objects%}/' + id
            });
        }

        /*
         * fieldName - Is the field in the {%objects%} table that receives the file ID
        */
        function uploadFile(id, file, fieldName) {
            if(file){
                return Upload.upload({
                    url: CONFIG.APIAddress + '/{%objects%}/' + id + '/upload/' + fieldName,
                    data: {file: file}
                });
            }
        }

        return factory;
    }
})();