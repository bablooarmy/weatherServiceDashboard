(function() {
  'use strict';
  angular.module('rainfallDashboard')
  .factory('rainfallService', function(dataService,$http,$q,$rootScope) {
    //will be used for debugging as well as testing api json structure
    var mockData = [
          {
          "request": "Amount of rainfall by day",
          "days": [
              {
              "day": 1,
              "amount": 50
              }, {
              "day": 2,
              "amount": 10
              }, {
              "day": 3,
              "amount": 20
              },{
              "day": 4,
              "amount": 70
              },{
              "day": 5,
              "amount": 30
              },{
              "day": 6,
              "amount": 60
              },{
              "day": 7,
              "amount": 10
              }
            ]
          }
        ];

        /*To calculate min,max & average chances of rain */
        var getChanceOfRain = function(pressure, temperature, amount) {
            var score = Math.log(amount + 1) * Math.log(pressure - 929) * Math.log(temperature - 9);
            var mean = Math.min(Math.max(score, 0), 100);
            var upper_bound = Math.min(1.5 * mean, 100);
            var lower_bound = Math.max(0.5 * mean, 0);
            return [lower_bound, mean, upper_bound];
        };

    return {
      getAmountByDay: function() {
        var deferred = $q.defer();
        dataService.getResourceURLs().then(function(response){
          $http({
            method: 'GET',
            url: response.data.rainfallAmountByDayUrl,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response){
            deferred.resolve(response);
          }).catch(function(errorRespone){
            console.log("API call failed due to: " + errorRespone);
            //get Mock data
            console.log("Showing Mock Data");
            deferred.resolve(mockData);
          });
        });
        return deferred.promise;
      },
      getUpdatedChartData: function(type, pressure, temperature){
        var rainfallTempData = [
            {
                key: "Amount Of Rainfall",
                bar: true,
                values: []
            }
        ];

        var chanceOfRainTempData = [];

        var chartData = $q.defer();

        this.getAmountByDay().then(function(response){
            if(response[0] && response[0].days){
              var upperBounditems = {key: 'upper',values:[]};
              var mediumBounditems = {key: 'medium',values:[]};
              var lowerBounditems = {key: 'lower',values:[]};
              for(var dayItem in response[0].days){
                if(response[0].days.hasOwnProperty(dayItem)){
                  var bounds = getChanceOfRain(pressure, temperature, response[0].days[dayItem].amount);
                  upperBounditems.values.push({'label':response[0].days[dayItem].day,'value': bounds[2]});
                  mediumBounditems.values.push({'label':response[0].days[dayItem].day,'value': bounds[1]});
                  lowerBounditems.values.push({'label':response[0].days[dayItem].day,'value': bounds[0]});
                  rainfallTempData[0].values.push({
                    'label':response[0].days[dayItem].day,
                    'value':response[0].days[dayItem].amount
                  });
                }
              }
              chanceOfRainTempData.push(upperBounditems);
              chanceOfRainTempData.push(mediumBounditems);
              chanceOfRainTempData.push(lowerBounditems);
              switch(type){
                case 'chanceOfRain':
                  chartData.resolve(chanceOfRainTempData);
                  $rootScope.$emit('showChanceOfRainChart',chanceOfRainTempData);
                break;
                case 'amountOfRainfall':
                  chartData.resolve(rainfallTempData);
                  $rootScope.$emit('showRainfallChart',rainfallTempData);
                break;
              }
            }
        }).catch(function(error){
          console.log('Error occured while fetching updated data: ' + error);
          chartData.reject(error);
        });
        return chartData.promise;
      }
    };
  })
})();
