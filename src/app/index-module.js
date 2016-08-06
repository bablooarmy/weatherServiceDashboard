(function() {
  'use strict';
  angular
    .module('weatherDashboard', ['routing','rainfallDashboard','dataModule'])
    .controller("appController",function($state){
      //navigate to dashboard state
      $state.go('weatherdashboard');

      });
})();
