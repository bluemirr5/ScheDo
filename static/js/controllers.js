'use strict';

/* Controllers */
angular.module('schedo.controllers', [])
.controller('scheduleCtrl', function($scope, $rootScope, scheduleService) {
	scheduler.insertSchedule = scheduleService.insertSchedule;
	scheduler.updateSchedule = scheduleService.updateSchedule;
	scheduler.deleteSchedule = scheduleService.deleteSchedule;
	scheduler.selectSchedule = scheduleService.selectSchedule;
	scheduler.userId = $rootScope.user.userId;
	scheduler.init('_scheduler', new Date(), "month");
})
.controller('projectCtrl', function($scope, $rootScope, scheduleService) {
	
})
.controller('statisticsCtrl', function($scope, $rootScope, scheduleService){
	var now = new Date();
	$scope.selectedYear = now.format("yyyy");
	$scope.selectedMonth = now.format("MM");
	$scope.years = makeYearBeforeAfter();
	
	$scope.getData = function() {
		
		var getStatisticsParma = {};
		getStatisticsParma.userId = $rootScope.user.userId;
		getStatisticsParma.month = $scope.selectedYear + $scope.selectedMonth
		
		scheduleService.selectMonthStatistics(getStatisticsParma, function(data){
			if(data.resultBody) {
				var tags = {};
				
				// get tags
				for(var i = 0; data.resultBody.statisticsList && i < data.resultBody.statisticsList.length; i++) {
					var statistics = data.resultBody.statisticsList[i];
					tags[statistics.Tag] = true;
				}
				
				// make View Model
				$scope.viewModelList = [];
				for(var k in tags) {
					var viewModel = {};
					viewModel.tag = k;
					viewModel.statistics = makeEmptyDateObjList($scope.selectedYear, $scope.selectedMonth);
					viewModel.totalDuration = 0;
					
					for(var i = 0; i < viewModel.statistics.length; i++) {
						var dateData = viewModel.statistics[i];
						
						for(var j = 0; j < data.resultBody.statisticsList.length; j++) {
							var statisticsObj = data.resultBody.statisticsList[j];
							if(dateData.fullDate == statisticsObj.StartDay && statisticsObj.Tag == viewModel.tag) {
								dateData.duration = statisticsObj.Duration/(1000*60*60);
								viewModel.totalDuration += dateData.duration;
							} 
						}
					}					
					$scope.viewModelList.push(viewModel);
				}
			}
		}, 
		function(){
			alert('fail');
		});	
	};
	
	$scope.getData();
	
});

function makeEmptyDateObjList(year, month) {
	var displayDateList = [];
	
	var formakeDate = new Date();
	formakeDate.setYear(year);
	formakeDate.setMonth(month-1);
	formakeDate.setDate(1);
	
	while(formakeDate.format("MM") == month) {
		var obj = {}
		obj.year = formakeDate.format("yyyy");
		obj.month = formakeDate.format("MM");
		obj.date = formakeDate.format("dd");
		if(formakeDate.getDay() == 0 || formakeDate.getDay() == 6) {
			obj.dayType = "holyday";
		} else {
			obj.dayType = "normalday";
		}
		
		obj.fullDate = formakeDate.format("yyyyMMdd");
		formakeDate.setDate(formakeDate.getDate()+1)
		displayDateList.push(obj);
	}	
	return displayDateList;
}

function makeYearBeforeAfter() {
	var years = [];
	var yearDate = new Date();
	yearDate.setYear(yearDate.getFullYear()-5)
	for(var i = 0; i < 10; i++) {
		years.push(yearDate.format("yyyy"));
		yearDate.setFullYear(yearDate.getFullYear()+1);
	}
	return years
}