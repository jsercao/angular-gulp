(function () {
    'use strict';

    angular
        .module('app')
        .controller('Module1Controller', Module1Controller);

    Module1Controller.$inject = ['$scope'];

    function Module1Controller($scope) {
        $scope.title = "我是模块一控制器";
    }
})();