(function() {
  'use strict';
  angular.module('rainfallDashboard', ['nvd3'])
  .controller('rainfallController', function($scope, $rootScope, isResourceLoaded, rainfallService, $compile) {

    var chanceOfRainChartTemplate = '<nvd3 api="chancesOfRainChart" options="chancesOfRainOptions" data="chancesOfRainData"></nvd3>';
    var rainfallChartTemplate = '<nvd3 api="rainfallChart" options="rainfallOptions" data="rainfallData"></nvd3>';

    $rootScope.$on('showChanceOfRainChart', function($event, payload){
      $scope.chancesOfRainData = payload;
      console.log("chancesOfRainData = " + JSON.stringify($scope.chancesOfRainData));
      if(angular.element(document.getElementById('chanceOfRainChartWrapper')).children().length > 0){
        angular.element(document.getElementById('chanceOfRainChartWrapper')).children().remove();
      }
      angular.element(document.getElementById('chanceOfRainChartWrapper')).append($compile(chanceOfRainChartTemplate)($scope));
    });

    $rootScope.$on('showRainfallChart', function($event, payload){
      $scope.rainfallData = payload;
      console.log("rainfallData = " + JSON.stringify($scope.rainfallData));
      if(angular.element(document.getElementById('rainfallChartWrapper')).children().length > 0){
        angular.element(document.getElementById('rainfallChartWrapper')).children().remove();
      }
      angular.element(document.getElementById('rainfallChartWrapper')).append($compile(rainfallChartTemplate)($scope));
    });

    /*set data for pressure slider*/
    $scope.pressureSlider = {
      value: 1010,
      options: {
        floor: 970,
        ceil: 1030
      }
    };

    /*set data for temperature slider*/
    $scope.temperatureSlider = {
      value: 15,
      options: {
        floor: 10,
        ceil: 35
      }
    };

    /* Rainfall Chart options */
    $scope.rainfallOptions = {
            chart: {
                type: 'historicalBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.1f')(d);
                },
                duration: 100,
                xAxis: {
                    axisLabel: 'Days',
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'l/m2',
                    axisLabelDistance: -10
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return "Day " + d +":Amount Of Rainfall is";
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        /*Chance of rain chart options*/
        $scope.chancesOfRainOptions = {
              "chart": {
                "type": "stackedAreaChart",
                "height": 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                "margin": {
                  "top": 20,
                  "right": 20,
                  "bottom": 40,
                  "left": 55
                },
                "useInteractiveGuideline": true,
                "dispatch": {},
                "xAxis": {
                  "axisLabel": "Days"
                },
                "yAxis": {
                  "axisLabel": "%",
                  "axisLabelDistance": -10
                }
              }
            };


        $scope.updateChartData = function(){
          /*Chance of rain chart data*/
          rainfallService.getUpdatedChartData('chanceOfRain', $scope.pressureSlider.value, $scope.temperatureSlider.value);
          /* Rainfall Chart data */
          rainfallService.getUpdatedChartData('amountOfRainfall', $scope.pressureSlider.value, $scope.temperatureSlider.value);
        }

        $scope.sliderChange = function(e){
          $scope.updateChartData();
        };

        $scope.updateChartData();
  });
})();
