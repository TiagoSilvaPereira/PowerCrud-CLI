(function () {
    'use strict';

    angular
        .module('{%angularAppName%}')
        .controller('{%object%}EditController', {%object%}EditController);

    {%object%}EditController.$inject = ['CONFIG','{%objects%}Service', {%injectOtherServices%}'Upload','$state','$stateParams'];

    /* @ngInject */
    function {%object%}EditController(CONFIG, {%objects%}Service, {%otherServices%}Upload, $state, $stateParams) {
        var vm = this;
        vm.config = CONFIG;
        vm.{%object%} = {};
        vm.save{%Object%} = save{%Object%};
        vm.uploadFile = uploadFile;

        init();

        //////////////

        function init() {
            if($stateParams.id){
                get{%Object%}();
            }
            {%foreignFunctionsCall%}
        }

        function get{%Object%}() {
            {%objects%}Service.get{%Object%}($stateParams.id).then(
            function(response){
                vm.{%object%} = response.data.data;
            },
            function(error){console.error(error)});
        }

{%getForeignObjects%}
        function save{%Object%}() {
            {%objects%}Service.save{%Object%}(vm.{%object%}).then(
            function(response){
                var data = response.data.data;
                $state.go('root.{%objects%}.edit', {id: data.id});
            },
            function(error){console.error(error)});
        }

        function uploadFile(file, fieldName) {
            {%objects%}Service.uploadFile(vm.{%object%}.id, file, fieldName).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            });
        };

    }
})();