(function () {
    'use strict';

    angular
        .module('{%angularAppName%}')
        .controller('homeController', homeController);

    homeController.$inject = ["$scope"];

    function homeController($scope) {
        var vm = this;
    }
})();