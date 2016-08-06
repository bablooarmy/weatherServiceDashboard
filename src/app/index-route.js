(function() {
  'use strict';
  angular
    .module('routing', ['ui.router'])
    .config(routeConfig)
    .run(function($rootScope) {
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
          //handle any logic when state chnage begins

        });
    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('weatherdashboard', {
        url: '/weatherdashboard',
        templateUrl: 'app/template/rainfalldashboard.html',
        controller: 'rainfallController',
        controllerAs: 'rfController',
        resolve: {
          isResourceLoaded:function(dataService){
            return dataService.getResourceURLs();
          }
        }
      })
    }
})();
