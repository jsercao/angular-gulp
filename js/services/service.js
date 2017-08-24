(function () {
  'use strict';

  angular
    .module('app')
    .service('Service', Service);

  Service.$inject = ['$scope'];

  function Service($scope) {

  }
})();