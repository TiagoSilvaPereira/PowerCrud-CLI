(function () {
    'use strict';

    angular
        .module('{%angularAppName%}')
        .controller('{%objects%}Controller', {%objects%}Controller);

    {%objects%}Controller.$inject = ['{%objects%}Service'];

    /* @ngInject */
    function {%objects%}Controller ({%objects%}Service) {
        var vm = this;
        vm.{%objects%} = [];
        vm.get{%Objects%} = get{%Objects%};
        vm.delete{%Object%} = delete{%Object%};

        init();

        //////////////

        function init () {
            get{%Objects%}();
        }

        function get{%Objects%} () {
            {%objects%}Service.get{%Objects%}().then(
            function(response){
                vm.{%objects%} = response.data.data;
            },
            function(error){console.error(error)});
        }

        function delete{%Object%} (id) {
            if(confirm('Delete this {%object%}?')){
                {%objects%}Service.delete{%Object%}(id).then(
                function(response){
                    get{%Objects%}();
                },
                function(error){console.error(error)});
            }
        }
    }
})();