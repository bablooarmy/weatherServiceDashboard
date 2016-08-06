!function(){"use strict";angular.module("weatherDashboard",["routing","rainfallDashboard","dataModule"]).controller("appController",["$state",function(a){a.go("weatherdashboard")}])}(),function(){"use strict";angular.module("weatherDashboard").config(["$provide",function(a){}])}(),function(){"use strict";function a(a){a.state("weatherdashboard",{url:"/weatherdashboard",templateUrl:"app/template/rainfalldashboard.html",controller:"rainfallController",controllerAs:"rfController",resolve:{isResourceLoaded:["dataService",function(a){return a.getResourceURLs()}]}})}a.$inject=["$stateProvider"],angular.module("routing",["ui.router"]).config(a).run(["$rootScope",function(a){a.$on("$stateChangeStart",function(a,b,c,d,e){})}])}(),function(){"use strict";function a(a,b){console.log("runBlock end")}a.$inject=["$log","$rootScope"],angular.module("weatherDashboard").run(a)}(),function(){"use strict";angular.module("rainfallDashboard",["nvd3"]).controller("rainfallController",["$scope","$rootScope","isResourceLoaded","rainfallService","$compile",function(a,b,c,d,e){var f='<nvd3 api="chancesOfRainChart" options="chancesOfRainOptions" data="chancesOfRainData"></nvd3>',g='<nvd3 api="rainfallChart" options="rainfallOptions" data="rainfallData"></nvd3>';b.$on("showChanceOfRainChart",function(b,c){a.chancesOfRainData=c,console.log("chancesOfRainData = "+JSON.stringify(a.chancesOfRainData)),angular.element(document.getElementById("chanceOfRainChartWrapper")).children().length>0&&angular.element(document.getElementById("chanceOfRainChartWrapper")).children().remove(),angular.element(document.getElementById("chanceOfRainChartWrapper")).append(e(f)(a))}),b.$on("showRainfallChart",function(b,c){a.rainfallData=c,console.log("rainfallData = "+JSON.stringify(a.rainfallData)),angular.element(document.getElementById("rainfallChartWrapper")).children().length>0&&angular.element(document.getElementById("rainfallChartWrapper")).children().remove(),angular.element(document.getElementById("rainfallChartWrapper")).append(e(g)(a))}),a.pressureSlider={value:1010,options:{floor:970,ceil:1030}},a.temperatureSlider={value:15,options:{floor:10,ceil:35}},a.rainfallOptions={chart:{type:"historicalBarChart",height:450,margin:{top:20,right:20,bottom:65,left:50},x:function(a){return a.label},y:function(a){return a.value},showValues:!0,valueFormat:function(a){return d3.format(",.1f")(a)},duration:100,xAxis:{axisLabel:"Days",showMaxMin:!1},yAxis:{axisLabel:"l/m2",axisLabelDistance:-10},tooltip:{keyFormatter:function(a){return"Day "+a+":Amount Of Rainfall is"}},zoom:{enabled:!0,scaleExtent:[1,10],useFixedDomain:!1,useNiceScale:!1,horizontalOff:!1,verticalOff:!0,unzoomEventType:"dblclick.zoom"}}},a.chancesOfRainOptions={chart:{type:"stackedAreaChart",height:450,x:function(a){return a.label},y:function(a){return a.value},margin:{top:20,right:20,bottom:40,left:55},useInteractiveGuideline:!0,dispatch:{},xAxis:{axisLabel:"Days"},yAxis:{axisLabel:"%",axisLabelDistance:-10}}},a.updateChartData=function(){d.getUpdatedChartData("chanceOfRain",a.pressureSlider.value,a.temperatureSlider.value),d.getUpdatedChartData("amountOfRainfall",a.pressureSlider.value,a.temperatureSlider.value)},a.sliderChange=function(b){a.updateChartData()},a.updateChartData()}])}(),function(){"use strict";angular.module("rainfallDashboard").factory("rainfallService",["dataService","$http","$q","$rootScope",function(a,b,c,d){var e=[{request:"Amount of rainfall by day",days:[{day:1,amount:50},{day:2,amount:10},{day:3,amount:20},{day:4,amount:70},{day:5,amount:30},{day:6,amount:60},{day:7,amount:10}]}],f=function(a,b,c){var d=Math.log(c+1)*Math.log(a-929)*Math.log(b-9),e=Math.min(Math.max(d,0),100),f=Math.min(1.5*e,100),g=Math.max(.5*e,0);return[g,e,f]};return{getAmountByDay:function(){var d=c.defer();return a.getResourceURLs().then(function(a){b({method:"GET",url:a.data.rainfallAmountByDayUrl,headers:{"Content-Type":"application/json"}}).then(function(a){d.resolve(a)}).catch(function(a){console.log("API call failed due to: "+a),console.log("Showing Mock Data"),d.resolve(e)})}),d.promise},getUpdatedChartData:function(a,b,e){var g=[{key:"Amount Of Rainfall",bar:!0,values:[]}],h=[],i=c.defer();return this.getAmountByDay().then(function(c){if(c[0]&&c[0].days){var j={key:"upper",values:[]},k={key:"medium",values:[]},l={key:"lower",values:[]};for(var m in c[0].days)if(c[0].days.hasOwnProperty(m)){var n=f(b,e,c[0].days[m].amount);j.values.push({label:c[0].days[m].day,value:n[2]}),k.values.push({label:c[0].days[m].day,value:n[1]}),l.values.push({label:c[0].days[m].day,value:n[0]}),g[0].values.push({label:c[0].days[m].day,value:c[0].days[m].amount})}switch(h.push(j),h.push(k),h.push(l),a){case"chanceOfRain":i.resolve(h),d.$emit("showChanceOfRainChart",h);break;case"amountOfRainfall":i.resolve(g),d.$emit("showRainfallChart",g)}}}).catch(function(a){console.log("Error occured while fetching updated data: "+a),i.reject(a)}),i.promise}}}])}(),function(){"use strict";angular.module("dataModule",[]).factory("dataService",["$q","$http",function(a,b){var c;return{getResourceURLs:function(){var d=a.defer();return c?d.resolve(c):b({method:"GET",url:"assets/data/resources.json",headers:{"Content-Type":"application/json"}}).then(function(a){c=a,d.resolve(c)}).catch(function(a){d.reject(a)}),d.promise}}}])}();