(function() {
  'use strict';
  angular.module('dataModule',[])
  .factory('dataService', function($q,$http) {
    var resourceURLs;
    return {
      getResourceURLs : function() {
        var deferred = $q.defer();
        //cache resource data
        if(resourceURLs){
          deferred.resolve(resourceURLs);
        }
        else{
          $http({
            method: 'GET',
            url: 'assets/data/resources.json',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response){
            resourceURLs = response;
            deferred.resolve(resourceURLs);
          }).catch(function(errorRespone){
            deferred.reject(errorRespone);
          });
        }
        return deferred.promise;
      }
    };
  })
})();
