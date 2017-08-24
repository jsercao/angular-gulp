angular
  .module('app', [
    'ui.router',
    'oc.lazyLoad',
    'ncy-angular-breadcrumb',
    'angular-loading-bar'
  ])
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 1;
  }])
  .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {

    $rootScope.$on('$stateChangeSuccess', function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    $rootScope.$state = $state;
    return $rootScope.$stateParams = $stateParams;

  }]);