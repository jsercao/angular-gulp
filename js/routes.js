angular
  .module('app')
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider',
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

      $urlRouterProvider.otherwise('/dashboard');

      $ocLazyLoadProvider.config({
       // debug: true //此处打开可以查看加载详情
      });

      $breadcrumbProvider.setOptions({
        prefixStateName: 'app.main',
        includeAbstract: true,
        template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
      });

      $stateProvider
        .state('app', {
          abstract: true,
          templateUrl: 'views/common/layouts/full.html',
          ncyBreadcrumb: {
            label: 'Root',
            skip: true
          },
          resolve: {
            loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                serie: true,
                name: 'Font Awesome',
                files: ['css/font-awesome.min.css']
              }]);
            }]
          }
        })
        //主页模块
        .state('app.main', {
          url: '/dashboard',
          templateUrl: 'views/business/home/main.html',
          ncyBreadcrumb: {
            label: 'Home',
          },
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load({
                files: ['views/business/home/home.controller.js']
              });
            }]
          }
        })
        //业务模块
        .state('app.business', {
          url: "/business",
          abstract: true,
          template: '<ui-view></ui-view>',
          ncyBreadcrumb: {
            label: '业务模块'
          }
        })
        .state('app.business.module1', {
          url: '/module1',
          templateUrl: 'views/business/module1/module1.html',
          ncyBreadcrumb: {
            label: '模块一'
          },
          resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load({
                files: ['views/business/module1/module1.controller.js']
              });
            }]
          }
        })
        .state('appSimple', {
          abstract: true,
          templateUrl: 'views/common/layouts/simple.html',
          resolve: {
            loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([{
                serie: true,
                name: 'Font Awesome',
                files: ['css/font-awesome.min.css']
              }]);
            }],
          }
        })
        // 单独页面
        .state('appSimple.login', {
          url: '/login',
          templateUrl: 'views/pages/login.html'
        })
    }
  ]);